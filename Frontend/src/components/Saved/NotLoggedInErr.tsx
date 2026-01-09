import { useEffect } from "react";
import { Button } from "../ul/Button"

type NotLoggedInProps = {
      open: boolean;
      onClose: () => void;
      login: boolean;
      setLogin: React.Dispatch<React.SetStateAction<Boolean>>; // ← nullable
}
export const NotLoggedIn: React.FC<NotLoggedInProps> = ({open, onClose, login, setLogin}) => {
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      if (open) document.addEventListener("keydown", onKey);
      document.body.style.overflow = open ? "hidden" : "";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }, [open, onClose]);
  
    if (!open) return null;

  return ( 
        <section>
            <p className="text-black ml-2 text-xl">
              This function requires an account
            </p>         
            <section className="flex border gap-6 align-center justify-center pt-2 pb-2">
              <Button variant="secondary" size="medium"> No thanks</Button>
              <Button variant="primary" size="medium" onClick={() => setLogin(true)} >Log In</Button>
            </section>
        </section>
    )
}