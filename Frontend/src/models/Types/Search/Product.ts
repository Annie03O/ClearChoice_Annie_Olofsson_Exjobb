export type Product = {
  id: string;
  label: string;
  fandom: string;
  white: string;
  black: string;
  grey: string;
  price: number;
  path: string;
  description: string;
  fit: string;
  class: string;
  washing: {
    temp: number;
    similarColors: boolean;
    canBleach: boolean;
    dry: string;
    iron: string;
    dryClean: boolean;
  };
};
