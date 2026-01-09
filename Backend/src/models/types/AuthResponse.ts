import { AuthUser } from "./AuthUser";

export type AuthResponse = {
    user: AuthUser;
    accessToken?: string;
};