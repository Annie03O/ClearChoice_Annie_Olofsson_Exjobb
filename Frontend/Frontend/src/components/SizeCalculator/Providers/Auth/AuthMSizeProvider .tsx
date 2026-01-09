import type React from "react";
import { createContext, useEffect, useState } from "react";
import { api } from "../../../../lib/apiBase";
import type { TSizeMDTO } from "../../../../models/Types/sizeCalculator/DTO/Auth/TSizeMDTO";
import type { AuthTSizeCtxtM } from "../../../../models/Types/sizeCalculator/Context/Auth/AuthTSizeCtxM";

export const AuthMSizeContext = createContext<AuthTSizeCtxtM | undefined>(undefined);

export const AuthMSizeProvider = ({children}: {children: React.ReactNode}) => {
    const [size, setSize] = useState<TSizeMDTO>({
        TShoulderSizeM: null, 
        TChestSizeM: null,
        TWaistSizeM: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/auth/saveSize")
        .then((res) =>  setSize(res.data.size ?? null))
        .catch((err) => {
            if (err?.response?.status !== 401) console.error(err);            
            setSize({TShoulderSizeM: null, TChestSizeM: null, TWaistSizeM: null})
        })
        .finally(() => setLoading(false));
    }, []);

    if (!size) return;

    return (
        <AuthMSizeContext.Provider value={{size, loading, setSize}}>
            {children}
        </AuthMSizeContext.Provider>
    )
}
