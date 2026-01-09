export type Color = "white" | "black" | "grey";


export type ColorImages = Partial<Record<Color, string>>

export type Product = {
  id: string;
  label: string;
  fandom?: string;
  white?: string;
  black?: string;
  grey?: string;
  price?: number;
  path?: string;
  description?: string;
  model?: "Women" | "Man" | "Unisex";
  class?: string; 
  images: ColorImages;
  availableColor: Color[];
  washing?: {
    temp?: number;
    similarColors?: boolean;
    canBleach?: boolean;
    dry?: string;
    iron?: string;
    dryClean?: boolean;
  };
};
