// src/hooks/useFSizeCalc.ts
import { useState } from "react";
import type { CalcOSDTO } from "../../../../models/Types/sizeCalculator/DTO/Calc/calcOSDTO";
import { CalcOSSizeContext } from "../../../../models/Types/sizeCalculator/Context/Calc/CalcOSSizeCtx";

export const CalcOSSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [size, setSize] = useState<CalcOSDTO | null>(null);
  const [loading] = useState(false);
  return (
    <CalcOSSizeContext.Provider value={{ size, loading, setSize }}>
      {children}
    </CalcOSSizeContext.Provider>
  );
};
