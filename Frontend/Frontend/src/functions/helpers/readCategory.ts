import type { Size } from "../../models/Types/sizeCalculator/Size.";

const toNumOrNull = (s: string | null): number | null =>
  s == null || s.trim() === "" || Number.isNaN(Number(s)) ? null : Number(s);


export const readCategory = (
  keys: { shoulderSize: string; chestSize: string; waistSize: string }
): Size | null => {
  const shoulder = toNumOrNull(localStorage.getItem(keys.shoulderSize));
  const chest    = toNumOrNull(localStorage.getItem(keys.chestSize));   // ← fix här
  const waist    = toNumOrNull(localStorage.getItem(keys.waistSize));

  if (shoulder == null && chest == null && waist == null) return null;

  return { 
    shoulder: shoulder ?? 0,  
    chest: chest ?? 0, 
    waist: waist ?? 0 
  };
};