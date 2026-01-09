import { useState, type JSX } from "react";
import { useUserAuth } from "../../hooks/Auth/useUserAuth";
import { Modal } from "../ul/Modal";
import { Login } from "../../pages/Nav/Auth/Login";
import { useLocation } from "react-router";

export const ProtectedRoute = ({children}: {children: JSX.Element}) => {
    const { isAuthenticated, user, status } = useUserAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const location = useLocation();




    console.log("[ProtectedRoute] status:", status, "isAuthenticated:", isAuthenticated, "loading:",  "user:", user);

    if (!isAuthenticated) {
        console.log("[ProtectedRoute] Not authenticated, redirecting to login");
        return  <Modal
                  open={showAuthModal}
                  onClose={() => {
                    setShowAuthModal(false);
                  }}
                  title="Not logged in"
                >
                    <Login 
                      lastVisited={location.pathname}
                      onClose={() => {
                       setShowAuthModal(false);
                  }}/>
                 </Modal>
        
    }

    console.log("[ProtectedRoute] Authenticated, rendering children");
    return children;
}