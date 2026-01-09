import React from "react";
import { oversizedFit } from "../../../models/objects/sizeCalculator/oversizedFit";
import { tshirtSizesF } from "../../../models/objects/sizeCalculator/tshirtSizesF";
import { tshirtSizesM } from "../../../models/objects/sizeCalculator/tshirtsSizesM";
import type { Messurement } from "../../../models/Types/sizeCalculator/Messurements";
import type { Product } from "../../../models/Types/Search/Product";

type Props = {
  product: Product;
  value: Messurement | null;
  onChange: (s: Messurement) => void;
  modal?: boolean;
};

export const SizePicker: React.FC<Props> = ({ product, value, onChange, modal }) => {
  if (!product) return null;

  const list =
    product.model === "Women"
      ? tshirtSizesF
      : product.model === "Man"
      ? tshirtSizesM
      : oversizedFit;

  const selectedSizeKey = value?.id ?? value?.size;

  return (
    <section className={`flex flex-col w-full  ${modal ? "justify-center items-center" : "gap-4"}`}>
      {modal === true ? 
        <span className=" w-[80%]">
          <h2 className="text-[clamp(22px,1.6vw,40px)] text-black font-semibold justify-start">Sizes</h2>
        </span>: null}
                      
      <section className="hidden md:grid grid-flow-col grid-rows-2  w-[80%] relative gap-0 bg-white text-[#010057]">
        {list.map((s) => {
          const key = s.id ?? s.size;
          const isSelected = selectedSizeKey === key;

          return (
              <button
               key={key}
               type="button"
               aria-pressed={isSelected}
               className={[
                  modal === true ? "border-[#010057] border-2  w-[100%] h-[100%]  desktop:h-[clamp(75px,4vw,400px)] flex justify-center items-center text-[clamp(14px,1.5vw,40px)] "
                  : "border-[#010057] border-2 flex justify-center items-center text-[clamp(16px,1.5vw,40px)] desktop:h-[clamp(50px,2vw,300px)]",
                 isSelected
                   ? "bg-[#010057] text-white font-semibold"
                   : "bg-white text-[#010057] hover:bg-gray-500 hover:text-white",
               ].join(" ")}
               onClick={() => onChange(s)}
              > 
                 {s.size}
              </button>
              
          );
        })}
      </section>
      <form >
        <select
          className={`md:hidden w-[50%] p-2 border border-[#010057] text-[#010057] text-[clamp(16px,1.5vw,40px)]  ${modal ? "mt-2" : ""}`}
          value={selectedSizeKey ?? ""}
          onChange={(e) => {    
            const selected = list.find(
              (s) => (s.id ?? s.size).toString() === e.target.value
            );
            if (selected) onChange(selected);
          }
          }
        >
          <option value="" disabled>Select Size</option>
          {list.map((s) => {
            const key = s.id  ?? s.size;
            return (
              <option key={key + "-mobile"} value={key}>
                {s.size}
              </option>
            );
          })}
        </select>            
      </form>
    </section>
  );
};
