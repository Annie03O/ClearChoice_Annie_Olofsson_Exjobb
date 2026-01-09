import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useCart } from "../../hooks/useCart";
import type { Color, Product } from "../../models/Types/Search/Product";
import type { Messurement } from "../../models/Types/sizeCalculator/Messurements";
import { Modal } from "../ul/Modal";
import { Button } from "../ul/Button";
import { ColorPicker } from "../../pages/Nav/Products/ColorPicker";
import { SizePicker } from "../../pages/Nav/Products/SizePicker";


type AddCartToButtonProps = {
  product: Product;
  productId: string
  selectedColor?: Color | null;
  selectedSize?: Messurement | null ;
  setSelectedColor?: Dispatch<SetStateAction<Color | null>>
  setSelectedSize?: Dispatch<SetStateAction<Messurement | null>>
  modal: boolean;
  sizeOptions: Messurement[]; // ✅ NY
  setOpenModal?: Dispatch<SetStateAction<boolean>>
  startPage?: boolean;
};

export const AddToCartButton = ({ product, productId, selectedColor, selectedSize, modal, sizeOptions, setOpenModal, setSelectedColor, setSelectedSize, startPage}: AddCartToButtonProps) => {
  const { dispatch } = useCart();
  const [open, setOpen] = useState(false);
  // Lokala val i modalen (för "alla produkter"-sidan)
  const availableColors = useMemo(() => {
    const images = product.images ?? ({} as any);

    return (Object.keys(images) as Color[]).filter((c) => !!images?.[c])
  }, [product]);

  const disabled = !selectedColor || !selectedSize;

const addToCart = (color: Color, size: Messurement) => {
  if (!color) return console.error("[color]: Color not found");
  if (!size) return console.error("[size]: Size not found");

  const img = product.images?.[color];
  if (!img) return console.error("Image not found");

  const price = product.price;
  if (price == null) return console.error("Price not found");

  const sizeKey = (size as any).size ?? (size as any).id;
  if (!sizeKey) return console.error("Size key missing");

  dispatch({
    type: "ADD_ITEM",
    payload: {
      id: `${productId}_${color}_${sizeKey}`,
      product,
      productId: product.id,
      label: product.label,
      price,
      color,
      imgUrl: img,
      size,
    },
    qty: 1,
  });
};


const handleClick = () => {
  
  if (modal === true) {
    setOpenModal!(true)
  }
  console.log("handleClick fired", { modal, openBefore: open });

  if (modal) {
    // sätt defaults när modalen öppnas
    if (!selectedColor) setSelectedColor!(availableColors[0] ?? null);
    if (!selectedSize) setSelectedSize!(sizeOptions[0] ?? null);

    setOpen(true);
    return;
  }

  if (!selectedColor || !selectedSize) return;
  addToCart(selectedColor, selectedSize);
};


  const handleConfirm = () => {
    if (!selectedColor || !selectedSize) return;
    addToCart(selectedColor!, selectedSize!);
    setOpen(false)

    setSelectedColor!(null);
    setSelectedSize!(null);
  }

  return (
    <>
    <Button type="button" variant="primary" size="large" modal={modal} onClick={handleClick} startPage={startPage}>
        Add to Cart
      </Button>

      {modal && (
         <Modal open={open} onClose={() => setOpen(false)} title="Chose size and color" calculator={false}>
             <section className=" flex flex-col gap-4 ">
              <section className="p-2">
                  <section className=" flex flex-col gap-4 mb-4 justify-center items-center">
                   <ColorPicker product={product} color={selectedColor!} setPickedColor={setSelectedColor!} modal={true}/>
                  </section>
                  <SizePicker product={product} value={selectedSize!} onChange={setSelectedSize!} modal/>
              </section>
              <section className=" pt-2 pb-2 flex justify-center items-center gap-[clamp(1em,4vw,3rem)]">
                <Button variant="secondary" size="full-width" onClick={() => setOpen(false)}>No</Button>
                <Button type="button" modal={false} size="full-width" disabled={!modal ? disabled : false} onClick={handleConfirm}>
                   Add to Cart
                </Button>
              </section>
             </section>
         </Modal>
      )}
    </>
  );
};
