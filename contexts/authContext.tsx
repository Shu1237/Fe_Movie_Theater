"use client";

import { useSessionStore } from "@/stores/sesionStore";
import { AuthContextType } from "@/utils/type";
import { createContext, useContext, useEffect, type ReactNode } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) => {
  const setSession = useSessionStore((state) => state.setSession);

  const setTokenFromContext = (accessToken: string) => {
    setSession(accessToken);
  };

  // Đồng bộ token từ cookie vào Zustand khi component mount hoặc initialToken thay đổi
  useEffect(() => {
    if (initialToken) {
      setSession(initialToken);
    }
  }, [initialToken, setSession]);

  return (
    <AuthContext.Provider value={{ setTokenFromContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};