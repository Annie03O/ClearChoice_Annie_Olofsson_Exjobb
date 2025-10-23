import { useContext } from "react"
import { CalcOSSizeContext } from "../../models/Types/sizeCalculator/Context/Calc/CalcOSSizeCtx";

export const useOSSizeCalc = () => {
    const ctx = useContext(CalcOSSizeContext);
    if (!ctx) throw new Error("useCalc must be used within an AuthProvider");
    return ctx;
}