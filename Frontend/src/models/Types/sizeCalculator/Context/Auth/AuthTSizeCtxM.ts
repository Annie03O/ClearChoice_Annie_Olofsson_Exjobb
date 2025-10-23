import type React from "react";
import { createContext } from "react";
import type { TSizeMDTO } from "../../DTO/Auth/TSizeMDTO";

export type AuthTSizeCtxtM = {
    size: TSizeMDTO
    loading: boolean;
    setSize: React.Dispatch<React.SetStateAction<TSizeMDTO>>;
}

export const AuthTSizeContextM = createContext<AuthTSizeCtxtM | undefined>(undefined);