"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../../lib/apiBase";
import type { AuthUser } from "../../models/Types/Login/AuthUser";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>; 
  loading?: boolean;
};

const AuthUserCtx = createContext<AuthContextValue | null>(null);


type AuthUserProviderProps = {
  children: React.ReactNode;
};

export const LoginUserProvider = ({ children }: AuthUserProviderProps)  => {
  const [user, setUser] = useState<AuthUser>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Kör en tyst refresh + hämta /me när appen startar
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        console.log("[Auth] Initial load - attempting refresh...");
        // Ignorera 401 refresh fel – om refresh misslyckas blir vi bara unauthenticated
        try {
          await api.post("/auth/refresh");
          console.log("[Auth] Refresh successful");
        } catch (err: any) {
          console.log("[Auth] Refresh failed:", err.response?.status);
          if (err.response?.status !== 401) throw err;
        }
        console.log("[Auth] Attempting to fetch /me...");
        const { data } = await api.get("/auth/me");
        if (!cancelled) {
          console.log("[Auth] Got user data:", data);
          setUser(data);
          setStatus("authenticated");
        }
      } catch (err) {
        console.log("[Auth] Initial load failed, setting unauthenticated");
        if (!cancelled) {
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("[Auth] Starting login...");
      const loginRes = await api.post("/auth/login", { email, password });
      console.log("[Auth] Login response:", loginRes.data);
      
      const meRes = await api.get("/auth/me");
      console.log("[Auth] Me response:", meRes.data);
      
      setUser(meRes.data);
      setStatus("authenticated");
      console.log("[Auth] Login successful, user set");
      return true;
    } catch (err: any) {
      console.error("[Auth] Login failed:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: err.config?.url
      });
      setUser(null);
      setStatus("unauthenticated");
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      console.log("[Auth] Logout successful");
    } catch (err) {
      console.error("[Auth] Logout error:", err);
    }
    setUser(null);
    setStatus("unauthenticated");
  };

  const handleSetUser = (userData: AuthUser) => {
    setUser(userData);
    if (userData) {
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  };

  const value: AuthContextValue = {
    user,
    status,
    isAuthenticated: status === "authenticated",
    login,
    logout,
    setUser: handleSetUser,
    loading: status === "loading",
  };

  return <AuthUserCtx.Provider value={value}>{children}</AuthUserCtx.Provider>;
};

/**
 * useAuth – Hooken du anropar i komponenter
 * Exponerar: { user, status, isAuthenticated, login, logout }
 */
export const useAuth = () => {
  const ctx = useContext(AuthUserCtx);
  if (!ctx) throw new Error("useAuth must be used within <LoginUserProvider>");
  return ctx;
};

