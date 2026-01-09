import { useContext } from "react"
import { CalcTSizeContextM } from "../../models/Types/sizeCalculator/Context/Calc/CalcTSizeCtxM";

export const useMSizeCalc = () => {
    const ctx = useContext(CalcTSizeContextM);
    if (!ctx) throw new Error("useCalc must be used within an AuthProvider");
    return ctx;
}