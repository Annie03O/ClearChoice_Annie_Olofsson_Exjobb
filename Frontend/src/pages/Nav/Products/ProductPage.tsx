import { products } from "../../../models/objects/products";
import { useParams } from "react-router";
import type { Color, Product } from "../../../models/Types/Search/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddToCartButton } from "../../../components/Cart/AddToCartButton";
import { tshirtSizesF } from "../../../models/objects/sizeCalculator/tshirtSizesF";
import { faRuler } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../../../components/ul/Modal";
import { useMemo, useState } from "react";
import { tshirtSizesM } from "../../../models/objects/sizeCalculator/tshirtsSizesM";
import { CalcSizeProvider } from "../../../components/SizeCalculator/Providers/Calc/CalcSizeProvider";
import { oversizedFit } from "../../../models/objects/sizeCalculator/oversizedFit";
import { ModalCalcSize } from "../../../components/SizeCalculator/Calc/ModalCalcSize";
import { ProductDescDesktop } from "./ProductDescDesktop";
import { ProductDescMobile } from "./ProductDescMobile";
import { ColorPicker } from "./ColorPicker";
import type { Messurement } from "../../../models/Types/sizeCalculator/Messurements";
import { SizePicker } from "./SizePicker";
import { SaveButton } from "../../../components/Saved/SaveButton";

export const ProductPage = () => {
  const [color, setColor] = useState<Color | null>(null);
  const [size, setSize] = useState<Messurement | null>(null);
  const [openCalc, setOpenCalc] = useState(false);
  const { id } = useParams();

  const product = useMemo(
    () => products.find((p) => p.id === String(id)),
    [id]
  );

  if (!product) return <h2>Product not found</h2>;

  const imgSrc =
    color === "grey"
      ? product.images.grey
      : color === "white"
      ? product.images.white
      : product.images.black;

  const sizeOptions =
    product.model === "Women"
      ? tshirtSizesF
      : product.model === "Man"
      ? tshirtSizesM
      : oversizedFit;

  const handleCalculator = () => setOpenCalc(true);

  return (
    <section className="bg-white text-[#010057] flex justify-center">
      {/* Wrapper: maxbredd + responsiv padding */}
      <section className="w-full max-w-[1200px] px-[clamp(12px,3vw,40px)] py-[clamp(12px,3vw,40px)]">
        {/* Grid: 1 kolumn på mobil, 2 på md+ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(12px,3vw,40px)]">
          {/* LEFT: Bild + (desktop desc under bilden) */}
          <section className="flex flex-col gap-[clamp(10px,2vw,20px)]">
            {/* Bild-ruta: alltid skalbar */}
            <section className="relative w-full overflow-hidden border-4 border-black bg-[#f2f2f2]">
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={imgSrc}
                  alt={product.description}
                  className="w-full h-full object-cover block"
                />
              </div>

              {/* Save uppe på bilden (bra både mobil/desktop) */}
              <span className="absolute bottom-2 right-2">
                <SaveButton productId={product.id} />
              </span>
            </section>

            {/* Desktop-desc endast md+ */}
            <section className="hidden md:block">
              <ProductDescDesktop product={product} />
            </section>
          </section>

          {/* RIGHT: Info + val + actions */}
          <section className="flex flex-col gap-[clamp(10px,2vw,20px)]">
            <h1 className="text-[clamp(22px,2.2vw,40px)] leading-tight">
              {product.label}
            </h1>

            <section className="flex flex-col gap-2">
              <h2 className="text-[clamp(16px,1.4vw,22px)] font-semibold">
                Colors
              </h2>
              <ColorPicker product={product} color={color} setPickedColor={setColor} />
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-[clamp(16px,1.4vw,22px)] font-semibold">
                Sizes
              </h2>
              <SizePicker product={product} value={size} onChange={setSize} />
            </section>

            {/* Price + Calculator: responsivt och utan absolut-position */}
            <section className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-[clamp(16px,1.4vw,22px)] whitespace-nowrap">
                Price: <b>{product.price} £</b>
              </p>

              <button
                className="text-[clamp(14px,1.2vw,18px)] hover:text-gray-500 flex items-center gap-2 underline whitespace-nowrap"
                onClick={handleCalculator}
                type="button"
              >
                Size Calculator
                <FontAwesomeIcon className="text-[.95em]" icon={faRuler} />
              </button>
            </section>

            {/* Actions: wrap på små skärmar, snyggt på stora */}
            <section className="flex gap-3 flex-wrap items-center">
              <AddToCartButton
                productId={product.id}
                sizeOptions={sizeOptions}
                modal={false}
                product={product}
                selectedColor={color}
                selectedSize={size}
              />
              {/* SaveButton finns redan på bild, men om du vill ha här också: */}
              {/* <SaveButton productId={product.id} /> */}
            </section>

            {/* Mobile-desc endast under md */}
            <section className="md:hidden">
              <ProductDescMobile product={product} />
            </section>
          </section>
        </section>

        {/* Modal (delad för både mobile/desktop) */}
        <Modal open={openCalc} onClose={() => setOpenCalc(false)} title="Size Calculator" calculator>
          <CalcSizeProvider>
            {product.model === "Women" ? (
              <ModalCalcSize id="F-size" model={tshirtSizesF} title="T-Shirts for women" modal />
            ) : product.model === "Man" ? (
              <ModalCalcSize id="M-size" model={tshirtSizesM} title="T-Shirts for men" modal />
            ) : (
              <ModalCalcSize id="OS-Size" model={oversizedFit} title="Hoodies/Sweatshirt" modal />
            )}
          </CalcSizeProvider>
        </Modal>
      </section>
    </section>
  );
};
