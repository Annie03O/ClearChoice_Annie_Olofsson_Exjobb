// src/hooks/useFSizeCalc.ts
import { useState } from "react";
import type { CalcTSizeMDTO } from "../../../../models/Types/sizeCalculator/DTO/Calc/calcTSizeMDTO";
import { CalcTSizeContextM } from "../../../../models/Types/sizeCalculator/Context/Calc/CalcTSizeCtxM";

export const CalcMSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [size, setSize] = useState<CalcTSizeMDTO | null>(null);
  const [loading] = useState(false);
  return (
    <CalcTSizeContextM.Provider value={{ size, loading, setSize }}>
      {children}
    </CalcTSizeContextM.Provider>
  );
};
