import { useContext } from "react"
import { AuthUserContext } from "../../components/Login/AuthUserProvider";


export const useUserAuth = () => {
    const ctx = useContext(AuthUserContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}