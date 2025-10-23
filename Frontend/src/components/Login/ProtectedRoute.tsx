import { Navigate } from "react-router";
import type { JSX } from "react";
import { useUserAuth } from "../../hooks/Auth/useUserAuth";

export const ProtectedRoute = ({children}: {children: JSX.Element}) => {
    const {user, loading} = useUserAuth();

    if (loading) return <div>Loading...</div>
    if (!user) return <Navigate to="/login" replace/>

    return children;
}