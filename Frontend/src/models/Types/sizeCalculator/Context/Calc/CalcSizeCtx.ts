import type React from "react";
import { createContext } from "react";
import type { CalcSizeDTO } from "../../DTO/Calc/CalcDTO";

type CalcSizeCtx = {
  size: CalcSizeDTO
   | null | undefined; // ← nullable
  loading: boolean;
  setSize: React.Dispatch<React.SetStateAction<CalcSizeDTO | null | undefined>>; // ← nullable
};
export const CalcSizeContext = createContext<CalcSizeCtx | undefined>(undefined);
