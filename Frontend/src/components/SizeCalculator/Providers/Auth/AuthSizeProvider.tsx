import type React from "react";
import { createContext, useEffect, useState } from "react";
import { api} from "../../../../lib/apiBase";
import type { SizeDTO } from "../../../../models/Types/sizeCalculator/DTO/SizeDTO";
import type { AuthSizeCtxt } from "../../../../models/Types/sizeCalculator/Context/Auth/AuthSizeCtx";

export const AuthSizeContext = createContext<AuthSizeCtxt | undefined>(undefined);

export const AuthSizeProvider = ({children}: {children: React.ReactNode}) => {
    const [size, setSize] = useState<SizeDTO>({
        TShoulderSizeF: null,
        TShoulderSizeM: null,
        TChestSizeF: null,
        TChestSizeM: null,
        TWaistSizeF: null,
        TWaistSizeM: null,
        OSChestSize: null,
        OSShoulderSize: null,
        OSWaistSize: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/auth/saveSize")
        .then((res) =>  setSize(res.data.size ?? null))
        .catch((err) => {
            if (err?.response?.status !== 401) console.error(err);            
            setSize({
                TShoulderSizeF: null,
                TShoulderSizeM: null,
                TChestSizeF: null,
                TChestSizeM: null,
                TWaistSizeF: null,
                TWaistSizeM: null,
                OSChestSize: null,
                OSShoulderSize: null,
                OSWaistSize: null
            })
        })
        .finally(() => setLoading(false));
    }, []);

    return (
        <AuthSizeContext.Provider value={{size, loading, setSize}}>
            {children}
        </AuthSizeContext.Provider>
    )
}
