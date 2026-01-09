import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router"

export const useGoBack = (fallback: string) => {
    const navigate = useNavigate();
    const location = useLocation();

    return useCallback(() =>  {
        if (location.state.canGoBack) {
            navigate(-1);
        } else {
            navigate(fallback, {replace: true})
        }
    }, [location, fallback])
}