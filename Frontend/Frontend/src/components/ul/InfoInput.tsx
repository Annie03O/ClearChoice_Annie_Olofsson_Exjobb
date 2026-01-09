import type { ChangeEventHandler } from "react";

type InputProps = {
    id?: string;
    placeholder: string;
    type?: "text" | "email" | "password" |  "adress";
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement> | undefined;
    required?: boolean;
}
export const InfoInput = ({id, placeholder, type, value, onChange, required}: InputProps) => {
    return (
        required === true ? <input className="p-2 rounded border-[#2E3F44] border text-black" id={id} placeholder={placeholder} type={type} value={value} onChange={onChange} required/>
        : <input className="p-2 rounded text-black border-[#2E3F44] border" id={id} placeholder={placeholder} type={type} value={value} onChange={onChange}/>
    )
}