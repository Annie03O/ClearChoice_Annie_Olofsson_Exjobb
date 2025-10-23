import type { User } from "./User";

export type AuthUserCtxt = {
    user: User;
    loading: boolean;
    setUser: (u: User) => void;
}