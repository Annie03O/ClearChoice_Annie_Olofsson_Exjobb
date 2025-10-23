import type React from "react";
import { createContext } from "react";
import type { TSizeFDTO } from "../../DTO/Auth/TSizeFDTO"; 

export type AuthTSizeCtxtF = {
    size: TSizeFDTO,
    loading: boolean;
    setSize: React.Dispatch<React.SetStateAction<TSizeFDTO>>;
}

export const AuthTSizeContextF = createContext<AuthTSizeCtxtF | undefined>(undefined);