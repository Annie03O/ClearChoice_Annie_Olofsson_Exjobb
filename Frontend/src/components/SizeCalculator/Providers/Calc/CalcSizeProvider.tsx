// src/hooks/useFSizeCalc.ts
import { useState } from "react";
import { CalcSizeContext } from "../../../../models/Types/sizeCalculator/Context/Calc/CalcSizeCtx";
import type { CalcSizeDTO } from "../../../../models/Types/sizeCalculator/DTO/Calc/CalcDTO";

export const CalcSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [size, setSize] = useState<CalcSizeDTO | null | undefined>(null);
  const [loading] = useState(false);


  return (
    <CalcSizeContext.Provider value={{ size, loading, setSize }}>
      {children}
    </CalcSizeContext.Provider>
  );
};
