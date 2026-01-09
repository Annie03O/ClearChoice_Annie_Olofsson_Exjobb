import { useEffect } from "react";
import type { SizePayload } from "../../../services/size";

type SavedMessurementsProps = {
  open: boolean;
  onClose: () => void;
  saved: SizePayload;
  error: string | null;
};

export const SavedMessurements = ({
  open,
  onClose,
  saved,
  error,
}: SavedMessurementsProps) => {
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
   <section className="flex flex-col gap-4 
    w-full text-lg justify-center items-center">
       {error && <p className="text-red-500">{error}</p>}
        <section className="flex flex-col border w-full md:w-[fit-content] max-[1800px]:text-[clamp(15px,2vw,40px)] min-[1800px]:text-[clamp(40px,1.7vw,60px)] p-[clamp(2px,2vw,20px)]">
                
        <section className="flex gap-2 border-b p-[clamp(2px,2vw,20px)]">
          <label className="w-[clamp(200px,2.7vw,1000px)] ">Shoulders:</label>
          <p className="w-[clamp(200px,2.7vw,1000px)] text-center "
          >{saved.shoulders}
           cm    </p>
        </section   >
        <section className="flex gap-2 border-b p-[clamp(2px,2vw,20px)]">
          <label className="w-[clamp(200px,2.7vw,1000px)]">Chest:</label>
          <p className="w-[clamp(200px,2.7vw,1000px)] text-center"
          >{saved.chest} cm</p>
              
        </section   >
        <section className="flex gap-2 border-b p-[clamp(2px,2vw,20px)]">
          <label className="w-[clamp(200px,2.7vw,1000px)]">Waist:</label>
          <p className=" w-[clamp(200px,2.7vw,1000px)] text-center"
          >{saved.waist} cm</p>
        </section   >
        </section>
    </section>
  );
};
