import type React from "react";
import { createContext, useEffect, useState } from "react";
import { api } from "../../../../lib/apiBase";
import type { osSizeDTO } from "../../../../models/Types/sizeCalculator/DTO/Auth/osDTO";
import type { AuthOSSizeCtxt } from "../../../../models/Types/sizeCalculator/Context/Auth/AuthOSSizeCtx"; 

export const AuthOSSizeContext = createContext<AuthOSSizeCtxt | undefined>(undefined);

export const AuthOSSizeProvider = ({children}: {children: React.ReactNode}) => {
    const [size, setSize] = useState<osSizeDTO>({
        OSShoulderSize: null,
        OSChestSize: null,
        OSWaistSize: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/auth/saveSize")
        .then((res) =>  setSize(res.data.size ?? null))
        .catch((err) => {
            if (err?.response?.status !== 401) console.error(err);            
            setSize({OSShoulderSize: null, OSChestSize: null, OSWaistSize: null})
        })
        .finally(() => setLoading(false));
    }, []);

    return (
        <AuthOSSizeContext.Provider value={{size, loading, setSize}}>
            {children}
        </AuthOSSizeContext.Provider>
    )
}
