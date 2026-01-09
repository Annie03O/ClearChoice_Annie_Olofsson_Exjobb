import React, { type FormEvent } from "react";

type ButtonSize = "tiny" | "extra-small" | "small" | "medium" | "large" | "full-width";
type ButtonVariant = "primary" | "secondary" | "thirtiary";

type ButtonProps = {
  children: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: "submit" | "button";
  modal?: boolean;  
  gap?: number | string;
  startPage?: boolean;
  disabled?: boolean;

  // Standard React onClick
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};

const gapClassMap: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  9: "gap-9",
  10: "gap-10",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  gap,
  size = "medium",
  variant = "primary",
  type = "button",
  disabled,
  modal,
  onClick,
  startPage,

}) => {
  const sizeClass =
    size === "tiny"
      ? "w-[clamp(2.5em,2vw,4em)] h-[2rem]"
      : size === "extra-small"
      ? "w-auto h-[2.3rem] text-[0.9rem]"
      : size === "small"
      ? "w-auto h-[2rem] whitespace-nowrap p-2"
      : size === "medium"
      ? "w-[clamp(100px,6.5vw,400px)] h-[clamp(35px,2.25vw,60px)] text-[clamp(15px,1.5vw,30px)]"
      : size === "large"
      ? ` ${startPage === true ? "5rem text-[clamp(15px,.9vw,30px)] pl-2 pr-2 h-[2.7rem]": "w-[10rem] text-[clamp(15px,1.3vw,30px)] h-[2.7rem]"}   desktop:w-[clamp(100px,8.5vw,500px)] desktop:h-[clamp(35px,4.25vw,60px)] `
      : size === "full-width"
      ? `w-[fit-content] ${startPage === true ? "w-[120px] text-[24px]":"min-w-[150px] text-[clamp(16px,1.3vw,40px)]"} p-2 pl-4 pr-4 h-[clamp(40px,3vw,70px)] `
      : "";

  const variantClass =
    variant === "primary"
      ? "bg-[#010057] hover:bg-gray-500 hover:border-black hover:border-[2px] active:bg-gray-800 text-white"
      : variant === "secondary"
      ? "bg-white border-black border-[2px] hover:text-white hover:bg-gray-500 active:bg-gray-400 text-black"
      : "bg-[#6774ff] hover:bg-[#2b3284] active:bg-[#1b1e4a] text-white";

  const radiusClass =
    size === "small"
      ? "rounded-[20px]"
      : size === "medium"
      ? "rounded-[25px]"
      : "rounded-[30px]";

  // gap som Tailwind-klass om number (och finns i map)
  const gapClass = typeof gap === "number" ? gapClassMap[gap] ?? "" : "";

  // gap som inline style om string (eller number som inte finns i map)
  const inlineGapStyle =
    typeof gap === "string"
      ? { gap }
      : typeof gap === "number" && !gapClassMap[gap]
      ? { gap: `${gap}px` } // fallback om du skickar t.ex gap={12}
      : undefined;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={inlineGapStyle}
      className={[
        sizeClass,
        variantClass,
        radiusClass,
        "flex justify-center items-center whitespace-nowrap overflow-hidden text-ellipsis px-2",
        gapClass,
        disabled ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
};
