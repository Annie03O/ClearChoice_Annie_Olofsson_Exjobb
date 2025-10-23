import type React from "react";
import { createContext, useEffect, useState } from "react";
import { api} from "../../../../lib/apiBase";
import type { TSizeFDTO } from "../../../../models/Types/sizeCalculator/DTO/Auth/TSizeFDTO";
import type { AuthTSizeCtxtF } from "../../../../models/Types/sizeCalculator/Context/Auth/AuthTSizeCtxF";

export const AuthFSizeContext = createContext<AuthTSizeCtxtF | undefined>(undefined);

export const AuthFSizeProvider = ({children}: {children: React.ReactNode}) => {
    const [size, setSize] = useState<TSizeFDTO>({
        TShoulderSizeF: null,
        TChestSizeF: null,
        TWaistSizeF: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/auth/saveSize")
        .then((res) =>  setSize(res.data.size ?? null))
        .catch((err) => {
            if (err?.response?.status !== 401) console.error(err);            
            setSize({TShoulderSizeF: null, TChestSizeF: null, TWaistSizeF: null})
        })
        .finally(() => setLoading(false));
    }, []);

    return (
        <AuthFSizeContext.Provider value={{size, loading, setSize}}>
            {children}
        </AuthFSizeContext.Provider>
    )
}
