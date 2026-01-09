import { createContext, useState, type ReactNode } from "react";
import type { AuthUser } from "../../../../models/Types/Login/AuthUser";

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
};

export const AuthSizeContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const logout = () => {
    // Här kan du även anropa backend /auth/logout om du vill
    // och rensa tokens/localStorage osv.'
    setUser(null);
  };

  return (
    <AuthSizeContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn: !!user,
        logout,
      }}
    >
      {children}
    </AuthSizeContext.Provider>
  );
};
