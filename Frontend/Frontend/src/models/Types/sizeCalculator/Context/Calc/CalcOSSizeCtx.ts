import type React from "react";
import { createContext } from "react";
import type { CalcOSDTO } from "../../DTO/Calc/calcOSDTO";

type CalcOSSizeCtx = {
  size: CalcOSDTO
   | null; // ← nullable
  loading: boolean;
  setSize: React.Dispatch<React.SetStateAction<CalcOSDTO | null>>; // ← nullable
};
export const CalcOSSizeContext = createContext<CalcOSSizeCtx | undefined>(undefined);
