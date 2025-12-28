"use client";

import { useSessionStore } from "@/stores/sesionStore";
import { AuthContextType } from "@/utils/type";
import { createContext, useContext, useEffect, type ReactNode } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialAccessToken,
  initialRefreshToken
}: {
  children: ReactNode;
  initialAccessToken?: string | null;
  initialRefreshToken?: string | null;
}) => {
  const setSession = useSessionStore((state) => state.setSession);

  const setTokenFromContext = (accessToken: string, refreshToken: string) => {
    setSession(accessToken, refreshToken);
  };


  useEffect(() => {
    if (initialAccessToken && initialRefreshToken) {
      setSession(initialAccessToken, initialRefreshToken);
    }
  }, [initialAccessToken, initialRefreshToken, setSession]);

  return (
    <AuthContext.Provider value={{setTokenFromContext  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};