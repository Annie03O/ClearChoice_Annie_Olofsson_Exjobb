import { useEffect, useState } from "react";
import { Modal } from "../../ul/Modal";
import type { Messurement } from "../../../models/Types/sizeCalculator/Messurements";
import { getSizeFromRules } from "../../../functions/sizeCalculator.ts/recommended/getSizeFromRules";
import { CalcSizeForm } from "./CalcSizeForm";
import { Button } from "../../ul/Button";
import { useNavigate } from "react-router";

type CalcSizeProps = {
    id: string;
    model: Messurement[];
    computeResult?: (
        rules: Messurement[],
        values: { 
            shoulder: number;
            chest: number;
            waist: number;
        }
    ) => string;
    title: string;
    modal?: boolean;
  };
export const CalcSize: React.FC<CalcSizeProps> = ({
  id,
  model,
  computeResult = getSizeFromRules,
  title,
  modal
}) => {
  const [loadingSize, setLoadingSize] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [shoulderSize, setShoulderSize] = useState<number | "">("");
  const [chestSize, setChestSize] = useState<number | "">("");
  const [waistSize, setWaistSize] = useState<number | "">("");
  const [result, setResult] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [showAuthErr, setShowAuthErr] = useState(false);
  const key = (field: "shoulder" | "chest" | "waist") => `${id}:${field}`;
  const navigate = useNavigate();
  // Auto-save to localStorage (without pre-filling on mount)
  useEffect(() => {
    const ok = shoulderSize !== "" && chestSize !== "" && waistSize !== "";
    if (!ok) return;

    const timer = setTimeout(() => {
      const shoulders = Number(shoulderSize);
      const chest = Number(chestSize);
      const waist = Number(waistSize);

      if ([shoulders, chest, waist].some((n) => Number.isNaN(n) || n <= 0)) {
        return;
      }

      localStorage.setItem(key("shoulder"), String(shoulders));
      localStorage.setItem(key("chest"), String(chest));
      localStorage.setItem(key("waist"), String(waist));
    }, 600);

    return () => clearTimeout(timer);
  }, [shoulderSize, chestSize, waistSize, id]);

  let visable;
 
  const bgStyle = modal === true ? "text-black flex align-center justify-center" 
    : "bg-[#010057]"

  const goToProducts = () => {
    navigate("/Products")
  }
  return (
    <section className={`${bgStyle} ${visable} p-4 rounded`}>
   
    <CalcSizeForm 
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
          setResult(rec)
          setShowResult(true)
        }}
      />
         

        {err && <p className="error">{err}</p>}
        <Modal open={showResult} onClose={() => setShowResult(false)} title={title}>
          {result && (
            <p className="text-black ml-2 text-xl">
              You have size "{result}"
            </p>
          )}
          <section className="flex border justify-center items-center gap-6">
            <Button type="submit" size="large" variant="secondary" onClick={() => setShowResult(false)}>Close</Button>
            <Button type="submit" size="large" variant="primary" onClick={goToProducts}>To products</Button>
          </section>
        </Modal>

        <Modal open={showAuthErr} onClose={() => setShowAuthErr(false)} title="Inlogglning krävs">
          <p className="text-black ml-2 text-xl">
              Login is required to save messurements
          </p>         
          <section>
            <button className="text-black get-size">Log In</button>
          </section>
        </Modal>
    </section>
  );
};
