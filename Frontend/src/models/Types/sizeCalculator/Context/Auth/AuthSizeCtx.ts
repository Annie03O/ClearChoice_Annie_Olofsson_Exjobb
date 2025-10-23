import type React from "react";
import type { SizeDTO } from "../../DTO/SizeDTO";
import { createContext } from "react";

export type AuthSizeCtxt = {
    size: SizeDTO | null;
    loading: boolean;
    setSize: React.Dispatch<React.SetStateAction<SizeDTO>>;
}

export const AuthSizeContext = createContext<AuthSizeCtxt | undefined>(undefined);