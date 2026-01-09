import { useEffect, useState } from "react";
import { Button } from "../../ul/Button";
import { useUserAuth } from "../../../hooks/Auth/useUserAuth";
import type { SizePayload } from "../../../services/size";
import type { Messurement } from "../../../models/Types/sizeCalculator/Messurements";

type CalcSizeFormProps = {
  id: string;
  model: Messurement[];
  title: string;
  computeResult: (
    rules: Messurement[],
    values: { shoulder: number; chest: number; waist: number }
  ) => string;
  setErr: (err: string | null) => void;
  loadingSize?: boolean;
  setLoadingSize: (loadingSize: boolean) => void;
  onGetResult: (result: string) => void;
  shoulderSize: number | "";
  setShoulderSize: (value: number | "") => void;
  chestSize: number | "";
  setChestSize: (value: number | "") => void;
  waistSize: number | "";
  setWaistSize: (value: number | "") => void;
};

export const ModalCalcSizeForm: React.FC<CalcSizeFormProps> = ({
  id,
  title,
  computeResult,
  setErr,
  loadingSize,
  setLoadingSize,
  model,
  onGetResult,
  shoulderSize,
  setShoulderSize,
  chestSize,
  setChestSize,
  waistSize,
  setWaistSize,
}) => {
  const { isAuthenticated, user, setUser } = useUserAuth();
  const [showAuthErr, setShowAuthErr] = useState(false);

  const key = (field: "shoulder" | "chest" | "waist") => `${id}:${field}`;

  // autosave
  useEffect(() => {
    const ok = shoulderSize !== "" && chestSize !== "" && waistSize !== "";
    if (!ok) return;

    const timer = setTimeout(() => {
      const shoulders = Number(shoulderSize);
      const chest = Number(chestSize);
      const waist = Number(waistSize);

      if ([shoulders, chest, waist].some((n) => Number.isNaN(n) || n <= 0)) return;

      localStorage.setItem(key("shoulder"), String(shoulders));
      localStorage.setItem(key("chest"), String(chest));
      localStorage.setItem(key("waist"), String(waist));
    }, 600);

    return () => clearTimeout(timer);
  }, [shoulderSize, chestSize, waistSize, id]);

  const saveSize = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!isAuthenticated) {
      setShowAuthErr(true);
      return;
    }

    const shoulders = Number(shoulderSize);
    const chest = Number(chestSize);
    const waist = Number(waistSize);

    if ([shoulders, chest, waist].some((n) => Number.isNaN(n) || n <= 0)) {
      setErr("Only positive numbers are accepted");
      return;
    }

    if (!user) {
      setErr("User not found");
      return;
    }

    setLoadingSize(true);
    try {
      const meassurements: SizePayload = {
        id: user.id,
        shoulders,
        chest,
        waist,
      };

      setUser({ ...user, meassurements });
      localStorage.setItem("messurements", JSON.stringify(meassurements));
    } catch (e) {
      console.error(e);
      setErr("Couldn't save size");
    } finally {
      setLoadingSize(false);
    }
  };

  const handleCalculations = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);

    if (shoulderSize === "" || chestSize === "" || waistSize === "") {
      setErr("Enter shoulder, chest and waist");
      return;
    }

    const shoulders = Number(shoulderSize);
    const chest = Number(chestSize);
    const waist = Number(waistSize);

    if ([shoulders, chest, waist].some((n) => Number.isNaN(n) || n <= 0)) {
      setErr("Only positive numbers are accepted");
      return;
    }

    setLoadingSize(true);
    try {
      const rec = computeResult(model, { shoulder: shoulders, chest, waist });
      onGetResult(rec);
    } finally {
      setLoadingSize(false);
    }
  };

  return (
    <form onSubmit={handleCalculations} className="flex flex-col p-4 w-fit bg-white rounded">
      <h1 className="text-2xl text-black mb-2">{title}</h1>

      {showAuthErr && (
        <p className="text-red-600 text-sm mb-2">
          Du måste vara inloggad för att spara i profilen.
        </p>
      )}

      <label className="text-black" htmlFor={`${id}-shoulder`}>Shoulders (cm)</label>
      <input
        className="border border-gray-400 rounded text-black"
        id={`${id}-shoulder`}
        type="number"
        value={shoulderSize}
        onChange={(e) => setShoulderSize(e.target.value === "" ? "" : +e.target.value)}
      />

      <label className="text-black mt-2" htmlFor={`${id}-chest`}>Chest (cm)</label>
      <input
        className="border border-gray-400 rounded text-black"
        id={`${id}-chest`}
        type="number"
        value={chestSize}
        onChange={(e) => setChestSize(e.target.value === "" ? "" : +e.target.value)}
      />

      <label className="text-black mt-2" htmlFor={`${id}-waist`}>Waist (cm)</label>
      <input
        className="border border-gray-400 rounded text-black"
        id={`${id}-waist`}
        type="number"
        value={waistSize}
        onChange={(e) => setWaistSize(e.target.value === "" ? "" : +e.target.value)}
      />

      <section className="flex items-center justify-between mt-4 gap-4">
        <label className="text-black text-sm">
          <input type="checkbox" onChange={(e) => e.target.checked && saveSize(e)} /> Save in profile
        </label>

        <Button type="submit" disabled={loadingSize} size="small" variant="thirtiary">
          {loadingSize ? "Räknar..." : "Get Size"}
        </Button>
      </section>
    </form>
  );
};
