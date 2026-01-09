import { useState, useEffect } from "react";
import type { Messurement } from "../../../models/Types/sizeCalculator/Messurements";
import { getSizeFromRules } from "../../../functions/sizeCalculator.ts/recommended/getSizeFromRules";
import { SizeInfo } from "./SizeInfo";
import { CalcSizeForm } from "./CalcSizeForm";
import { ModalCalcSizeForm } from "./ModalCalcSizeForm";

type CalcSizeProps = {
  id: string;
  model: Messurement[];
  computeResult?: (
    rules: Messurement[],
    values: { shoulder: number; chest: number; waist: number }
  ) => string;
  title: string;
  modal?: boolean;
};

export const ModalCalcSize: React.FC<CalcSizeProps> = ({
  id,
  model,
  computeResult = getSizeFromRules,
  title,
}) => {
  const [loadingSize, setLoadingSize] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [view, setView] = useState<"form" | "result">("form");
  const [shoulderSize, setShoulderSize] = useState<number | "">("");
  const [chestSize, setChestSize] = useState<number | "">("");
  const [waistSize, setWaistSize] = useState<number | "">("");

  return (
    <section className="calculator">
      {err && <p className="text-red-500 mb-2">{err}</p>}

      {view === "result" ? (
        <SizeInfo
          title={title}
          result={result}
          onClose={() => setView("form")}
        />
      ) : (
        <ModalCalcSizeForm
          id={id}
          title={title}
          model={model}
          setErr={setErr}
          computeResult={computeResult}
          loadingSize={loadingSize}
          setLoadingSize={setLoadingSize}
          shoulderSize={shoulderSize}
          setShoulderSize={setShoulderSize}
          chestSize={chestSize}
          setChestSize={setChestSize}
          waistSize={waistSize}
          setWaistSize={setWaistSize}
          onGetResult={(rec) => {
            setResult(rec);
            setView("result");
          }}
        />
      )}
    </section>
  );
};
