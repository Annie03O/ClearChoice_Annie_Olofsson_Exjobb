import { useEffect, useState } from "react";
import { api } from "../../../lib/apiBase";           // din axios-instans
import { getRecommendedTSizeF } from "../../../functions/sizeCalculator.ts/recommended/getRecommendedTSizeF"; // din beräknare
import { useMSizeCalc } from "../../../hooks/Calc/useMSizeCalc ";
import type { CalcTSizeMDTO } from "../../../models/Types/sizeCalculator/DTO/Calc/calcTSizeMDTO";

// Den här komponenten hanterar F (dam)
export const CalcMTSize = () => {
  const { size, loading, setSize } = useMSizeCalc(); // size: { shoulderSize, chestSize, waistSize } | null
  const [loadingSize, setLoadingSize] = useState(false); // laddning för beräkning/post
  const [err, setErr] = useState<string | null>(null);
  const [TShoulderSizeM, setTShoulderSizeM] = useState<number | "">("");
  const [TChestSizeM,    setTChestSizeM]    = useState<number | "">("");
  const [TWaistSizeM,    setTWaistSizeM]    = useState<number | "">("");
  const [TMResult,       setTMResult]       = useState<string>("");

  // 1) Hämta profilstorlek från backend (om inloggad)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get("/auth/saveSize"); // <- ska svara med { size?: { shoulderSize, chestSize, waistSize } }
        if (!active) return;
        const s = res.data?.size as CalcTSizeMDTO | undefined;
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
      setTShoulderSizeM(size.TShoulderSizeM ?? "");
      setTChestSizeM(size.TChestSizeM ?? "");
      setTWaistSizeM(size.TWaistSizeM ?? "");
    }
  }, [loading, size]);

  // 3) Om ingen profilstorlek – läs från localStorage (F-nycklar)
  useEffect(() => {
    if (size) return;
    const s = localStorage.getItem("TShoulderSizeM");
    const c = localStorage.getItem("TChestSizeM");
    const w = localStorage.getItem("TWaistSizeM");
    if (s) setTShoulderSizeM(+s);
    if (c) setTChestSizeM(+c);
    if (w) setTWaistSizeM(+w);
  }, [size]);

  // 4) Manuell spara (checkbox/klick). Sparar lokalt + context + backend
  const saveSize = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    try {
      const shoulderSize = Number(TShoulderSizeM);
      const chestSize    = Number(TChestSizeM);
      const waistSize    = Number(TWaistSizeM);

      if ([shoulderSize, chestSize, waistSize].some(n => Number.isNaN(n) || n <= 0)) {
        setErr("Only positive numbers are accepted");
        return;
      }

      // uppdatera context (F)
      setSize({ TShoulderSizeM, TChestSizeM, TWaistSizeM });

      // spara i localStorage (F-nycklar)
      localStorage.setItem("TShoulderSizeM", String(shoulderSize));
      localStorage.setItem("TChestSizeM",    String(chestSize));
      localStorage.setItem("TWaistSizeM",    String(waistSize));

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
    const ok = TShoulderSizeM !== "" && TChestSizeM !== "" && TWaistSizeM !== "";
    if (!ok) return;

    const timer = setTimeout(() => {
      const payload = {
        TShoulderSizeM: Number(TShoulderSizeM),
        TChestSizeM:    Number(TChestSizeM),
        TWaistSizeM:    Number(TWaistSizeM),
      };
      // lokalt
      localStorage.setItem("TShoulderSizeM", String(payload.TShoulderSizeM));
      localStorage.setItem("TChestSizeM",    String(payload.TChestSizeM));
      localStorage.setItem("TWaistSizeM",    String(payload.TWaistSizeM));
      // backend – tyst felhantering
      api.post("/auth/saveSize", payload).catch(() => {});
      // context
      setSize(payload);
    }, 600);

    return () => clearTimeout(timer);
  }, [TShoulderSizeM, TChestSizeM, TWaistSizeM, setSize]);

  // 6) Beräkning
  const handleTCalculationsF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setTMResult("");

    if (TShoulderSizeM === "" || TChestSizeM === "" || TWaistSizeM === "") {
      setErr("Enter shoulder, chest and waist");
      return;
    }

    setLoadingSize(true);
    try {
      const shoulders = Number(TShoulderSizeM);
      const chest     = Number(TChestSizeM);
      const waist     = Number(TWaistSizeM);

      if ([shoulders, chest, waist].some(n => Number.isNaN(n) || n <= 0)) {
        setErr("Only positive numbers are accepted");
        return;
      }
      const rec = getRecommendedTSizeF(shoulders, chest, waist);
      setTMResult(rec);
    } finally {
      setLoadingSize(false);
    }
  };

  return (
    <>
      <h1>T-shirts for women</h1>

      {loading && <p>Laddar profil...</p>}

      <form onSubmit={handleTCalculationsF} className="sc-container">
        <label htmlFor="shoulderM">Shoulders (cm)</label>
        <input
          id="shoulderM"
          type="number"
          value={TShoulderSizeM}
          onChange={(e) => setTShoulderSizeM(e.target.value === "" ? "" : +e.target.value)}
        />

        <label htmlFor="chestM">Chest (cm)</label>
        <input
          id="chestM"
          type="number"
          value={TChestSizeM}
          onChange={(e) => setTChestSizeM(e.target.value === "" ? "" : +e.target.value)}
        />

        <label htmlFor="waistM">Waist (cm)</label>
        <input
          id="waistM"
          type="number"
          value={TWaistSizeM}
          onChange={(e) => setTWaistSizeM(e.target.value === "" ? "" : +e.target.value)}
        />

        <button type="submit" disabled={loadingSize}>
          {loadingSize ? "Räknar..." : "Get Size"}
        </button>

        <label style={{ display: "inline-flex", gap: 8, alignItems: "center", marginLeft: 12 }}>
          <input type="checkbox" onChange={saveSize as any} /> Save in profile
        </label>

        {err && <p className="error">{err}</p>}
        {TMResult && <p className="result">{TMResult}</p>}
      </form>
    </>
  );
};
