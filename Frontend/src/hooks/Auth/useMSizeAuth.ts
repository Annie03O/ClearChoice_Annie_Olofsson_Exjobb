import { useContext } from "react"
import { AuthMSizeContext } from "../../components/SizeCalculator/Providers/Auth/AuthMSizeProvider ";

export const useMSizeAuth = () => {
    const ctx = useContext(AuthMSizeContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}