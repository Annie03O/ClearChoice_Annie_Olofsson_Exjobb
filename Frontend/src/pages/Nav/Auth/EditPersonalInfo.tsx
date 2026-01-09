// src/pages/Nav/Auth/EditPersonalInfo.tsx
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type EditPersonalInfoProps = {
  open: boolean;
  onClose: () => void;
  initialName: string;
  initialEmail: string;
  error: string | null;
  loading?: boolean;
  onSave: (values: { name: string; email: string; password?: string }) => void;
};

export const EditPersonalInfo = ({
  open,
  onClose,
  initialName,
  initialEmail,
  error,
  loading,
  onSave,
}: EditPersonalInfoProps) => {
  // 🔹 Lokal state – detta styr inputs
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");

  // När modalen öppnas eller initialvärden byts → synca
  useEffect(() => {
    if (open) {
      setName(initialName);
      setEmail(initialEmail);
      setPassword("");
    }
  }, [open, initialName, initialEmail]);

  // ESC + body scroll
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      name,
      email,
      password: password || undefined,
    });
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <section className="w-full ">
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form
        className="relative flex text-lg gap-2 w-full border"
        onSubmit={handleSubmit}
      >
        <section className="flex flex-col gap-2 border p-[5px] w-full text-[clamp(15px,2.7vw,35px)]">
          <section className="flex gap-4 border-b pb-[5px]">
            <label className="w-[clamp(150px,2.7vw,1000px)] border font-semibold">Name:</label>
            <input
              className="text-black w-[clamp(300px,30vw,1000px)] border pl-1"
              type="text"
              value={name}
              onChange={handleNameChange}
            />
          </section>

          <section className="flex gap-4 border-b pb-[5px]">
            <label className="w-[clamp(150px,2.7vw,1000px)] font-semibold">Email:</label>
            <input
              className="text-black w-[clamp(300px,30vw,1000px)] pl-1"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
          </section>

          <section className="flex gap-4 pt-[5px]">
            <label className="w-[clamp(150px,2.7vw,1000px)] font-semibold">Password:</label>
            <input
              className="text-black w-[clamp(300px,30vw,1000px)] pl-1"
              type="password"
              placeholder="Nytt lösenord (valfritt)"
              value={password}
              onChange={handlePasswordChange}
            />
          </section>
        </section>
      </form>
    </section>
  );
};
