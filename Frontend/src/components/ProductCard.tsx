import { useNavigate } from "react-router-dom";
import type { Color, Product } from "../models/Types/Search/Product";
import { useState } from "react";
import { AddToCartButton } from "./Cart/AddToCartButton";
import type { Messurement } from "../models/Types/sizeCalculator/Messurements";
import { oversizedFit } from "../models/objects/sizeCalculator/oversizedFit";
import { tshirtSizesM } from "../models/objects/sizeCalculator/tshirtsSizesM";
import { tshirtSizesF } from "../models/objects/sizeCalculator/tshirtSizesF";
import { SaveButton } from "./Saved/SaveButton";

type ProductPresentationProps = {
  oneProduct: Product;
  searchResult: boolean;
  home?: boolean;
};

export const ProductCard = ({ oneProduct, searchResult, home }: ProductPresentationProps) => {
  const navigate = useNavigate();
  const [openProductPage, setOpenProductPage] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [color, setColor] = useState<Color | null>(null);
  const [size, setSize] = useState<Messurement | null>(null);

  const goToProductPage = () => {
    if (openModal === true) {
      setOpenProductPage(false);
      return;
    }
    setOpenProductPage(true);
    navigate("/Products/" + oneProduct.id);
  };

  const imgSrc =
    oneProduct.images.black || oneProduct.images.white || oneProduct.images.grey || "";

  return (
    <section
      className={[
        "bg-[#f2f2f2] text-[#010057] border-4 border-black flex flex-col",
        home ? "overflow-hidden" : "", // ✅ gör att bilden kan ligga kant-i-kant utan glipor
      ].join(" ")}
    >
      <button onClick={goToProductPage} className="text-left">
        {/* Bild-wrapper */}
        <section
          className={[
            "w-full",
            home ? "" : "", // (valfritt, men håller det tydligt)
          ].join(" ")}
        >
          <section
            className={[
              "w-full",
              "aspect-square", // ✅ gör att bilden får en stabil ruta
              "overflow-hidden", // ✅ klipper bilden exakt i boxen
              home ? "" : "", // du kan lägga min/max här om du vill
            ].join(" ")}
          >
            <img
              src={imgSrc}
              alt={oneProduct.description}
              className="h-full w-full object-cover block" // ✅ fyller hela wrappern, inga “inline gaps”
            />
          </section>

          {/* Text */}
          <section className={home ? "p-2" : "p-2"}>
            <p className={home ? "text-[clamp(15px,4.7vw,40px)]" : "text-[clamp(20px,1.7vw,50px)]"}>
              {oneProduct.label}
            </p>
            <p className={home ? "text-[clamp(15px,4.2vw,40px)]" : "text-[clamp(18px,1.5vw,45px)]"}>
              Price: <b>{oneProduct.price}£</b>
            </p>
          </section>
        </section>
      </button>

      <section className="p-1 flex items-center justify-center gap-[5px]">
        <AddToCartButton
          product={oneProduct}
          productId={oneProduct.id}
          modal={true}
          selectedColor={color}
          selectedSize={size}
          sizeOptions={
            oneProduct.model === "Women"
              ? tshirtSizesF
              : oneProduct.model === "Man"
              ? tshirtSizesM
              : oversizedFit
          }
          setOpenModal={setOpenModal}
          setSelectedColor={setColor}
          setSelectedSize={setSize}
          startPage={home}
        />
        <SaveButton productId={oneProduct.id} home={home} />
      </section>
    </section>
  );
};
