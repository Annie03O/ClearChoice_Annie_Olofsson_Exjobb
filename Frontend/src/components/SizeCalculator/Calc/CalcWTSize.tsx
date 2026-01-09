import { useEffect, useState } from "react";
import { api } from "../../../lib/apiBase";           // din axios-instans
import { useFSizeCalc } from "../../../hooks/Calc/useFSizeCalc"; // ditt F-context
import { getRecommendedTSizeF } from "../../../functions/sizeCalculator.ts/recommended/getRecommendedTSizeF"; // din beräknare
import type { CalcTSizeFDTO } from "../../../models/Types/sizeCalculator/DTO/Calc/CalcTSizeFDTO";

// Den här komponenten hanterar F (dam)
export const CalcWTSize = () => {
  const { size, loading, setSize } = useFSizeCalc(); // size: { shoulderSize, chestSize, waistSize } | null
  const [loadingSize, setLoadingSize] = useState(false); // laddning för beräkning/post
  const [err, setErr] = useState<string | null>(null);
  const [TShoulderSizeF, setTShoulderSizeF] = useState<number | "">("");
  const [TChestSizeF,    setTChestSizeF]    = useState<number | "">("");
  const [TWaistSizeF,    setTWaistSizeF]    = useState<number | "">("");
  const [TFResult,       setTFResult]       = useState<string>("");

  // 1) Hämta profilstorlek från backend (om inloggad)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get("/auth/saveSize"); // <- ska svara med { size?: { shoulderSize, chestSize, waistSize } }
        if (!active) return;
        const s = res.data?.size as CalcTSizeFDTO | undefined;
        // Context för F håller ett objekt med { shoulderSize, chestSize, waistSize } | null
        setSize(s ?? null);
      } catch {
        if (active) setSize(null); // inte inloggad eller ingen data
      }
    })();
    return () => { active = false; };
  }, [setSize]);

  // 2) När profilstorlek finns (och backendladdning klar), fyll formuläret
  useEffect(() => {
    if (!loading && size) {
      setTShoulderSizeF(size.shoulderSize ?? "");
      setTChestSizeF(size.chestSize ?? "");
      setTWaistSizeF(size.waistSize ?? "");
    }
  }, [loading, size]);

  // 3) Om ingen profilstorlek – läs från localStorage (F-nycklar)
  useEffect(() => {
    if (size) return;
    const s = localStorage.getItem("TShoulderSizeF");
    const c = localStorage.getItem("TChestSizeF");
    const w = localStorage.getItem("TWaistSizeF");
    if (s) setTShoulderSizeF(+s);
    if (c) setTChestSizeF(+c);
    if (w) setTWaistSizeF(+w);
  }, [size]);

  // 4) Manuell spara (checkbox/klick). Sparar lokalt + context + backend
  const saveSize = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    try {
      const shoulderSize = Number(TShoulderSizeF);
      const chestSize    = Number(TChestSizeF);
      const waistSize    = Number(TWaistSizeF);

      if ([shoulderSize, chestSize, waistSize].some(n => Number.isNaN(n) || n <= 0)) {
        setErr("Only positive numbers are accepted");
        return;
      }

      // uppdatera context (F)
      setSize({ shoulderSize, chestSize, waistSize });

      // spara i localStorage (F-nycklar)
      localStorage.setItem("TShoulderSizeF", String(shoulderSize));
      localStorage.setItem("TChestSizeF",    String(chestSize));
      localStorage.setItem("TWaistSizeF",    String(waistSize));

      // spara i backend
      setLoadingSize(true);
      await api.post("/auth/saveSize", { shoulderSize, chestSize, waistSize });
      console.log("Size saved in profile");
    } catch (e) {
      console.error(e);
      setErr("Couldn't save size");
    } finally {
      setLoadingSize(false);
    }
  };

  // 5) Autosave (debounce 600ms) när alla tre fälten har giltiga värden
  useEffect(() => {
    const ok = TShoulderSizeF !== "" && TChestSizeF !== "" && TWaistSizeF !== "";
    if (!ok) return;

    const timer = setTimeout(() => {
      const payload = {
        shoulderSize: Number(TShoulderSizeF),
        chestSize:    Number(TChestSizeF),
        waistSize:    Number(TWaistSizeF),
      };
      // lokalt
      localStorage.setItem("TShoulderSizeF", String(payload.shoulderSize));
      localStorage.setItem("TChestSizeF",    String(payload.chestSize));
      localStorage.setItem("TWaistSizeF",    String(payload.waistSize));
      // backend – tyst felhantering
      api.post("/auth/saveSize", payload).catch(() => {});
      // context
      setSize(payload);
    }, 600);

    return () => clearTimeout(timer);
  }, [TShoulderSizeF, TChestSizeF, TWaistSizeF, setSize]);

  // 6) Beräkning
  const handleTCalculationsF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setTFResult("");

    if (TShoulderSizeF === "" || TChestSizeF === "" || TWaistSizeF === "") {
      setErr("Enter shoulder, chest and waist");
      return;
    }

    setLoadingSize(true);
    try {
      const shoulders = Number(TShoulderSizeF);
      const chest     = Number(TChestSizeF);
      const waist     = Number(TWaistSizeF);

      if ([shoulders, chest, waist].some(n => Number.isNaN(n) || n <= 0)) {
        setErr("Only positive numbers are accepted");
        return;
      }
      const rec = getRecommendedTSizeF(shoulders, chest, waist);
      setTFResult(rec);
    } finally {
      setLoadingSize(false);
    }
  };

  return (
    <>
      <h1>T-shirts for women</h1>

      {loading && <p>Laddar profil...</p>}

      <form onSubmit={handleTCalculationsF} className="sc-container">
        <label htmlFor="shoulderF">Shoulders (cm)</label>
        <input
          id="shoulderF"
          type="number"
          value={TShoulderSizeF}
          onChange={(e) => setTShoulderSizeF(e.target.value === "" ? "" : +e.target.value)}
        />

        <label htmlFor="chestF">Chest (cm)</label>
        <input
          id="chestF"
          type="number"
          value={TChestSizeF}
          onChange={(e) => setTChestSizeF(e.target.value === "" ? "" : +e.target.value)}
        />

        <label htmlFor="waistF">Waist (cm)</label>
        <input
          id="waistF"
          type="number"
          value={TWaistSizeF}
          onChange={(e) => setTWaistSizeF(e.target.value === "" ? "" : +e.target.value)}
        />

        <button type="submit" disabled={loadingSize}>
          {loadingSize ? "Räknar..." : "Get Size"}
        </button>

        <label style={{ display: "inline-flex", gap: 8, alignItems: "center", marginLeft: 12 }}>
          <input type="checkbox" onChange={saveSize as any} /> Save in profile
        </label>

        {err && <p className="error">{err}</p>}
        {TFResult && <p className="result">{TFResult}</p>}
      </form>
    </>
  );
};
