import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import type { Product } from "../../models/Types/Search/Product";
import { products } from "../../models/objects/products"; // ✅ ändra sökväg om din skiljer
import { Modal } from "../ul/Modal"; 
import { useSaved } from "../../hooks/useSaved";
import { useUserAuth } from "../../hooks/Auth/useUserAuth";
import { Button } from "../ul/Button";
import { Login } from "../../pages/Nav/Auth/Login";
import { NotLoggedIn } from "./NotLoggedInErr";
import SaveIcon from "../../../public/isSaved.svg"
import NotSavedIcon from "../../../public/NotSaved.svg" 

export const SaveButton = ({productId, home}: {productId: string, home?: boolean}) => {
  const { dispatch, state } = useSaved();
  const { isAuthenticated } = useUserAuth();
  const location = useLocation(); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [login, setLogin] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [justSavedLabel, setJustSavedLabel] = useState("");

  if (!productId) return null;

  const product: Product | undefined = products.find((p) => p.id === productId);
  if (!product) {
    return <p className="text-red-600">Kunde inte hitta produkt med id: {productId}</p>;
  }

  // ✅ SANNINGEN: är produkten sparad?
  const isSaved = useMemo(
    () => state.savedItems.some((x) => x.id === productId || x.productId === productId),
    [state.savedItems, productId]
  );

  const isDuplicateOpen = state.lastError === "DUPLICATE_ITEM";

  const saveItem = () => {
    const img =
      product.images?.black ??
      product.images?.white ??
      product.images?.grey ??
      product.black ??
      product.white ??
      product.grey;

    if (!img) {
      console.error("Image not found for product:", product);
      return;
    }

    dispatch({ type: "CLEAR_ERROR" });
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        product,
        productId: product.id,
        label: product.label,
        imgUrl: img,
        price: product.price ?? 0,
      },
    });
  };

  const removeItem = () => {
    dispatch({ type: "REMOVE_ITEM", id: product.id });
    dispatch({ type: "CLEAR_ERROR" });
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    dispatch({ type: "CLEAR_ERROR" });

    if (isSaved) {
      removeItem();
    } else {
      setJustSavedLabel(product.label);
      saveItem();
      setSavedModalOpen(true)
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Save to favorites"
        className={ `${home === true ? "h-[clamp(20px, 1vw, 25px)]" : "h-[clamp(20px, 1vw, 30px)]"}  flex items-center justify-center hover:opacity-80`}
      >
        <img src={isSaved ? SaveIcon : NotSavedIcon} className="h-[clamp(40px,3.25vw,50px)]" alt="" />
      </button>

      {/* AUTH MODAL */}
      <Modal
        open={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setLogin(false);
        }}
        title="Not logged in"
      >
        <section>
          {!login ? (
            <NotLoggedIn
              open={true}
              onClose={() => setShowAuthModal(false)}
              login={login}
              setLogin={() => setLogin(true)}
            />
          ) : (
            <Login onClose={() => setShowAuthModal(false)} lastVisited={location.pathname }/>
          )}
        </section>
      </Modal>

      {/* DUPLICATE MODAL */}
      <Modal
        open={isDuplicateOpen}
        onClose={() => dispatch({ type: "CLEAR_ERROR" })}
        title="Already saved"
      >
        <p className="text-black text-center ">
          You have already saved "{product.label}"
        </p>
        <p className="text-black text-center pb-4">Would you like to delete it?</p>
        <section className="flex w-full gap-4 items-center justify-center pt-2 pb-2">
          <Button type="button" variant="secondary" onClick={() => dispatch({ type: "CLEAR_ERROR" })}>
            Close
          </Button>
          <Button type="button" onClick={removeItem}>
            Yes
          </Button>
        </section>
      </Modal>

      {/* SAVED SUCCESS MODAL */}
      <Modal open={savedModalOpen} onClose={() => setSavedModalOpen(false)} title="Saved">
        <p className="text-black text-center pb-4">
          "{justSavedLabel || product.label}" is saved in favorites
        </p>
        <section className="flex w-full gap-4 items-center justify-center pt-2 pb-2">
          <Button type="button" variant="secondary" onClick={() => setSavedModalOpen(false)}>
            Close
          </Button>
          <Button type="button" onClick={() => setSavedModalOpen(false)}>
            Ok
          </Button>
        </section>
      </Modal>
    </>
  );
};