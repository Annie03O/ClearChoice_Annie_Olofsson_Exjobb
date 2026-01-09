// src/hooks/useFSizeCalc.ts
import { useState } from "react";
import type { CalcTSizeFDTO } from "../../../../models/Types/sizeCalculator/DTO/Calc/CalcTSizeFDTO";
import { CalcTSizeContextF } from "../../../../models/Types/sizeCalculator/Context/Calc/CalcTSizeCtxF";

export const CalcFSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [size, setSize] = useState<CalcTSizeFDTO | null>(null);
  const [loading] = useState(false);
  return (
    <CalcTSizeContextF.Provider value={{ size, loading, setSize }}>
      {children}
    </CalcTSizeContextF.Provider>
  );
};
