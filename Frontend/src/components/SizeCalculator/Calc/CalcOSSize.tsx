import { useEffect, useState } from "react";
import { api } from "../../../lib/apiBase";           // din axios-instans
import { getRecommendedOversized} from "../../../functions/sizeCalculator.ts/recommended/getRecommendedOversized";
import { useOSSizeCalc } from "../../../hooks/Calc/useOSSizeCalc ";
import type { CalcOSDTO } from "../../../models/Types/sizeCalculator/DTO/Calc/calcOSDTO";

// Den här komponenten hanterar F (dam)
export const CalcOSSize = () => {
  const { size, loading, setSize } = useOSSizeCalc(); // size: { shoulderSize, chestSize, waistSize } | null
  const [loadingSize, setLoadingSize] = useState(false); // laddning för beräkning/post
  const [err, setErr] = useState<string | null>(null);
  const [OSShoulderSize, setOShoulderSize] = useState<number | "">("");
  const [OSChestSize,    setOSChestSize]    = useState<number | "">("");
  const [OSWaistSize,    setOSWaistSize]    = useState<number | "">("");
  const [OSResult,       setOSResult]       = useState<string>("");

  // 1) Hämta profilstorlek från backend (om inloggad)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get("/auth/saveSize"); // <- ska svara med { size?: { shoulderSize, chestSize, waistSize } }
        if (!active) return;
        const s = res.data?.size as CalcOSDTO | undefined;
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
      setOShoulderSize(size.OSShoulderSize ?? "");
      setOSChestSize(size.OSChestSize ?? "");
      setOSWaistSize(size.OSWaistSize ?? "");
    }
  }, [loading, size]);

  // 3) Om ingen profilstorlek – läs från localStorage (F-nycklar)
  useEffect(() => {
    if (size) return;
    const s = localStorage.getItem("OSShoulderSize");
    const c = localStorage.getItem("OSChestSize");
    const w = localStorage.getItem("OSWaistSize");
    if (s) setOShoulderSize(+s);
    if (c) setOSChestSize(+c);
    if (w) setOSWaistSize(+w);
  }, [size]);

  // 4) Manuell spara (checkbox/klick). Sparar lokalt + context + backend
  const saveSize = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    try {
      const shoulderSize = Number(OSShoulderSize);
      const chestSize    = Number(OSChestSize);
      const waistSize    = Number(OSWaistSize);

      if ([shoulderSize, chestSize, waistSize].some(n => Number.isNaN(n) || n <= 0)) {
        setErr("Only positive numbers are accepted");
        return;
      }

      // uppdatera context (F)
      setSize({ OSShoulderSize, OSChestSize, OSWaistSize });

      // spara i localStorage (F-nycklar)
      localStorage.setItem("OSShoulderSize", String(shoulderSize));
      localStorage.setItem("OSChestSize",    String(chestSize));
      localStorage.setItem("OSWaistSize",    String(waistSize));

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
    const ok = OSShoulderSize !== "" && OSChestSize !== "" && OSWaistSize !== "";
    if (!ok) return;

    const timer = setTimeout(() => {
      const payload = {
        OSShoulderSize: Number(OSShoulderSize),
        OSChestSize:    Number(OSChestSize),
        OSWaistSize:    Number(OSWaistSize),
      };
      // lokalt
      localStorage.setItem("OSShoulderSize", String(payload.OSShoulderSize));
      localStorage.setItem("OSChestSize",    String(payload.OSChestSize));
      localStorage.setItem("OSWaistSize",    String(payload.OSWaistSize));
      // backend – tyst felhantering
      api.post("/auth/saveSize", payload).catch(() => {});
      // context
      setSize(payload);
    }, 600);

    return () => clearTimeout(timer);
  }, [OSShoulderSize, OSChestSize, OSWaistSize, setSize]);

  // 6) Beräkning
  const handleTCalculationsF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setOSResult("");

    if (OSShoulderSize === "" || OSChestSize === "" || OSWaistSize === "") {
      setErr("Enter shoulder, chest and waist");
      return;
    }

    setLoadingSize(true);
    try {
      const shoulders = Number(OSShoulderSize);
      const chest     = Number(OSChestSize);
      const waist     = Number(OSWaistSize);

      if ([shoulders, chest, waist].some(n => Number.isNaN(n) || n <= 0)) {
        setErr("Only positive numbers are accepted");
        return;
      }
      const rec = getRecommendedOversized(shoulders, chest, waist);
      setOSResult(rec);
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
          value={OSShoulderSize}
          onChange={(e) => setOShoulderSize(e.target.value === "" ? "" : +e.target.value)}
        />

        <label htmlFor="chestM">Chest (cm)</label>
        <input
          id="chestM"
          type="number"
          value={OSChestSize}
          onChange={(e) => setOSChestSize(e.target.value === "" ? "" : +e.target.value)}
        />

        <label htmlFor="waistM">Waist (cm)</label>
        <input
          id="waistM"
          type="number"
          value={OSWaistSize}
          onChange={(e) => setOSWaistSize(e.target.value === "" ? "" : +e.target.value)}
        />

        <button type="submit" disabled={loadingSize}>
          {loadingSize ? "Räknar..." : "Get Size"}
        </button>

        <label style={{ display: "inline-flex", gap: 8, alignItems: "center", marginLeft: 12 }}>
          <input type="checkbox" onChange={saveSize as any} /> Save in profile
        </label>

        {err && <p className="error">{err}</p>}
        {OSResult && <p className="result">{OSResult}</p>}
      </form>
    </>
  );
};
