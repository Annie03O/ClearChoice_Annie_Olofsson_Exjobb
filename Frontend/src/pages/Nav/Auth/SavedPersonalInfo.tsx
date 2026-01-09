// src/pages/Nav/Auth/SavedPersonalInfo.tsx
import { useEffect } from "react";
import type { AuthUser } from "../../../models/Types/Login/AuthUser";

type SavedPersonalInfoProps = {
  open: boolean;
  onClose: () => void;
  saved: AuthUser;
  error: string | null;
};

export const SavedPersonalInfo = ({
  open,
  onClose,
  saved,
  error,
}: SavedPersonalInfoProps) => {
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
    <section className="p-1 relative flex flex-col gap-2 justify-center items-center
                          text-[clamp(15px,2vw,40px)]
                          min-[1800px]:text-[clamp(40px,2vw,60px)]
                        ">
  {error && <p className="text-red-500 mb-2">{error}</p>}

      <section className="border-b w-fit">
        <p className=" pt-2 pb-2">
          <b>Full Name:</b> {saved!.name}
        </p>
      </section>

      <section className="border-b w-fit pt-2 pb-2">
        <p>
          <b>Email:</b> {saved!.email}
        </p>
      </section>
    </section>
  );
};
