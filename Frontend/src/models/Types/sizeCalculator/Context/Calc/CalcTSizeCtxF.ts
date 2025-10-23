import type React from "react";
import { createContext } from "react";
import type { CalcTSizeFDTO } from "../../DTO/Calc/calcTSizeFDTO";

type CalcFSizeCtx = {
  size: CalcTSizeFDTO
   | null; // ← nullable
  loading: boolean;
  setSize: React.Dispatch<React.SetStateAction<CalcTSizeFDTO | null>>; // ← nullable
};
export const CalcTSizeContextF = createContext<CalcFSizeCtx | undefined>(undefined);
