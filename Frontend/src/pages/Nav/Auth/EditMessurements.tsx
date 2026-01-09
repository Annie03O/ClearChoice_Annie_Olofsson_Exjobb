import {  useEffect, type ChangeEvent, type FormEvent } from "react";

type EditMessurementsProps = {
    open: boolean;
    onClose: () => void;
    edit: {
        shoulders: string;
        chest: string;
        waist: string;
    };
    error: string | null;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onShoulderChange: (value: string) => void;
    onChestChange: (value: string) => void;
    onWaistChange: (value: string) => void;
}
export const EditMessurements = ({ edit,
    open, onClose,
    error, onSubmit, onShoulderChange, 
    onChestChange, onWaistChange, 
}: EditMessurementsProps) => {

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
    
        
    
    const handleShoulderChange = (e: ChangeEvent<HTMLInputElement>) => {
        onShoulderChange(e.target.value);
    }
    
    const handleChestChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChestChange(e.target.value);
    }
    const handleWaistChange = (e: ChangeEvent<HTMLInputElement>) => {
        onWaistChange(e.target.value);
    }
    return (
        <section>
          {error && <p className="text-red-500">{error}</p>}
            <form
                className="relative  flex text-lg gap-2"
                onSubmit={onSubmit}
              >
                <section className="flex flex-col gap-2 border p-[clamp(2px,2vw,20px)]">
                  <section className="flex gap-2 border-b p-[5px] ">
                    <label className="w-[80px]">Shoulders:</label>
                    <input
                      className="text-black w-[40px] text-center border"
                      type="number"
                      value={edit.shoulders}
                      onChange={handleShoulderChange}
                    />{" "}
                    cm    
                  </section   >

                  <section className="flex gap-2 border-b pl-[5px] pb-[5px]">
                  <label className=" w-[80px]">Chest:</label>
                    <input
                      className="text-black w-[40px] text-center border"
                      type="number"
                      value={edit.chest}
                      onChange={handleChestChange}
                    />{" "}
                    cm    
                  </section   >

                  <section className="flex gap-2  pl-[5px]  pb-[5px] border-b">
                    <label className="w-[80px]">Waist:</label>
                    <input
                      className="text-black w-[40px] text-center border"
                      type="number"
                      value={edit.waist}
                      onChange={handleWaistChange}
                    />{" "}
                    cm    
                  </section   >

                </section>
 
              </form>
          </section>
    )
}