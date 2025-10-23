import { CalcWTSize } from "../../components/SizeCalculator/Calc/CalcWTSize";
import { CalcMTSize } from "../../components/SizeCalculator/Calc/CalcTMSize"; 
import { CalcOSSize } from "../../components/SizeCalculator/Calc/CalcOSSize"; 

export const SizeCalculatorPage = () => {
    return (
        <>
            <CalcWTSize/>
            <CalcMTSize/>
            <CalcOSSize/>
        </>
    )

}
