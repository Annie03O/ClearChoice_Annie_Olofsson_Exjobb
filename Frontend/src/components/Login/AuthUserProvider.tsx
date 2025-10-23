import type React from "react";
import { createContext, useEffect, useState } from "react";
import type { User } from "../../models/Types/Login/User";
import { api } from "../../lib/apiBase";
import type { AuthUserCtxt } from "../../models/Types/Login/AuthUserCtx";

export const AuthUserContext = createContext<AuthUserCtxt | undefined>(undefined);

export const AuthUserProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/auth/me")
        .then(res =>  setUser(res.data.user))
        .catch(err => {
            if (err?.response?.status !== 401) console.error(err);            
            setUser(null)
        })
        .finally(() => setLoading(false));
    }, []);

    return (
        <AuthUserContext.Provider value={{user, loading, setUser}}>
            {children}
        </AuthUserContext.Provider>
    )
}
