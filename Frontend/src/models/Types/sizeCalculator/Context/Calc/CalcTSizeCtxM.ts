import type React from "react";
import { createContext } from "react";
import type { CalcTSizeMDTO } from "../../DTO/Calc/calcTSizeMDTO";

type CalcSizeCtxM = {
  size: CalcTSizeMDTO
   | null; // ← nullable
  loading: boolean;
  setSize: React.Dispatch<React.SetStateAction<CalcTSizeMDTO | null>>; // ← nullable
};
export const CalcTSizeContextM = createContext<CalcSizeCtxM | undefined>(undefined);
