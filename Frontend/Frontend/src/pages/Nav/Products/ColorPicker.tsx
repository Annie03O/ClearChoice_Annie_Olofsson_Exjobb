import type React from "react";
import type { Color,  Product } from "../../../models/Types/Search/Product";
import { useEffect, type Dispatch, type SetStateAction } from "react";

type Props = {
  product: Product;
  color: Color | null;
  setPickedColor:  Dispatch<SetStateAction<Color | null>>;
  modal?: boolean;
};

export const ColorPicker: React.FC<Props> = ({product, setPickedColor, color, modal}) => {
  const images = product.images ?? {};

const options = [
  { key: "black" as const, src: images.black, alt: "Black" },
  { key: "white" as const, src: images.white, alt: "White" },
  { key: "grey" as const, src: images.grey, alt: "Grey" },
].filter((o) => !!o.src);

  const safeSelected: Color | undefined =
  color && options.some(o => o.key === color) ? color : options[0]?.key;

  useEffect(() => {
    if (!color && safeSelected) setPickedColor(safeSelected);
  }, [color, safeSelected, setPickedColor]);

  if (!safeSelected) return null; 

  console.log("Vald färg,", color);
  

  return (
    <section className={`flex w-[80%] ${modal === true ? "flex-col": ""}`}>
      {modal === true ? 
        <span className=" w-[80%] mb-2">
          <h2 className="text-[clamp(22px,1.6vw,40px)] text-black font-semibold justify-start ">Colors</h2>
        </span>: null}
      
      <section className="flex w-fit">
      {options.map((o) => {
        const isActive = safeSelected === o.key;
        
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => setPickedColor(o.key)}
            className={`bg-transparent rounded-lg transition ${
              isActive ? "border-[#010057] border-2" : "border-transparent hover:border-gray-500 hover:border-2"
            }`}
            aria-pressed={isActive}
            aria-label={`Välj färg ${o}`}
          >
            {o.src ? (
              <img
                src={o.src}
                alt={o.alt}
                className=" desktop:w-[150px] desktop:h-[150px] object-cover block md:h-[70px] md:w-[70px] w-[50px]  h-[50px]"
              />
            ) : (
              // fallback om bild saknas
              <span className="w-14 h-14 grid place-items-center px-2">
                {o.alt}
              </span>
            )}
          </button>
        );
      })}
      </section>
    </section>
  );
}
