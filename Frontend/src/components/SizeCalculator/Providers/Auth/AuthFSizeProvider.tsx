import type React from "react";
import { createContext, useEffect, useState } from "react";
import { api} from "../../../../lib/apiBase";
import { useAuth } from "../../../Login/LoginUserProvider";
import type { TSizeFDTO } from "../../../../models/Types/sizeCalculator/DTO/Auth/TSizeFDTO";
import type { AuthTSizeCtxtF } from "../../../../models/Types/sizeCalculator/Context/Auth/AuthTSizeCtxF";

export const AuthFSizeContext = createContext<AuthTSizeCtxtF | undefined>(undefined);

export const AuthFSizeProvider = ({children}: {children: React.ReactNode}) => {
    const { isAuthenticated } = useAuth();
    const [size, setSize] = useState<TSizeFDTO>({
        TShoulderSizeF: null,
        TChestSizeF: null,
        TWaistSizeF: null,
    });
    const [loading, setLoading] = useState(true);
 

    useEffect(() => {
        // Only load sizes if user is authenticated
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const loadSizes = async () => {
            try {
                const sizeRes = await api.post("/auth/saveSize");
                setSize(sizeRes.data?.size ?? {TShoulderSizeF: null, TChestSizeF: null, TWaistSizeF: null});
            } catch (sizeErr: any) {
                if (sizeErr?.response?.status !== 401) console.error("[SizeProvider] Error loading sizes:", sizeErr);
                setSize({TShoulderSizeF: null, TChestSizeF: null, TWaistSizeF: null});
            } finally {
                setLoading(false);
            }
        };
        
        loadSizes();
    }, [isAuthenticated]);

    return (
        <AuthFSizeContext.Provider value={{size, loading, setSize}}>
            {children}
        </AuthFSizeContext.Provider>
    )
}
