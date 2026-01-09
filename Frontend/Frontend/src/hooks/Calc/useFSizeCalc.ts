import { useContext } from "react"
import { CalcTSizeContextF } from "../../models/Types/sizeCalculator/Context/Calc/CalcTSizeCtxF";

export const useFSizeCalc = () => {
  const ctx = useContext(CalcTSizeContextF);
  if (!ctx) throw new Error("useFSizeCalc must be used within FSizeProvider");
  return ctx;
};
