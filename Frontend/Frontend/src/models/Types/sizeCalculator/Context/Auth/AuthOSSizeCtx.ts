import type React from "react";
import { createContext } from "react";
import type { osSizeDTO } from "../../DTO/Auth/osDTO";

export type AuthOSSizeCtxt = {
    size: osSizeDTO;
    loading: boolean;
    setSize: React.Dispatch<React.SetStateAction<osSizeDTO>>;
}

export const AuthTSizeContextM = createContext<AuthOSSizeCtxt | undefined>(undefined);