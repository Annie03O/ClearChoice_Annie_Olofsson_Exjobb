export type TSizeEUW =  
  "32" | "34" | "36" | "38" | "40" 
  | "42" | "44" | "46" | "48" | "50" | "52" | "54";

export type OSSizeEU =  
  "32" | "34" | "36" | "38" | "40" 
  | "42" | "44" | "46" | "48" | "50" | "52" | "54";
export type TSizeEUM =
  | "40" | "42" | "44" | "46" | "48"
  | "50" | "52" | "54" | "56" | "58"
  | "60" | "62" | "64" | "66" | "68" | "70";

export type AllSizes = {
    Women: TSizeEUW;
    Men: TSizeEUM;
    Ovesized: OSSizeEU;
}

export type Size = {
    id?: number,
    shoulder: number,
    chest: number,
    waist: number
};