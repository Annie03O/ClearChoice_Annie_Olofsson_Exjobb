import { useContext } from "react"
import { AuthFSizeContext } from "../../components/SizeCalculator/Providers/Auth/AuthFSizeProvider";

export const useFSizeAuth = () => {
    const ctx = useContext(AuthFSizeContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}