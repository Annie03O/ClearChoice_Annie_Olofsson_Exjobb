import type { AuthUser } from "./AuthUser";

export type AuthUserCtxt = {
    user: AuthUser;
    loading: boolean;
    setUser: (u: AuthUser) => void;
}