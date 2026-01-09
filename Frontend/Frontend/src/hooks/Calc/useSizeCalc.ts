import { useContext } from "react"
import { CalcSizeContext } from "../../models/Types/sizeCalculator/Context/Calc/CalcSizeCtx";

export const useSizeCalc = () => {
    const ctx = useContext(CalcSizeContext);
    if (!ctx) throw new Error("useCalc must be used within an AuthProvider");
    return ctx;
}