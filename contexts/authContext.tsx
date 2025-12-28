"use client";

import Loading from "@/components/loading";
import { useSessionStore } from "@/stores/sesionStore";
import { AuthContextType } from "@/utils/type";
import { authRequest } from "@/apiRequest/auth";
import { toast } from "sonner";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const setTokenFromContext = (accessToken: string, refreshToken: string) => {
    setSession(accessToken, refreshToken);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Case 1: Có cả access_token và refresh_token → OK, hydrate bình thường
      if (initialAccessToken && initialRefreshToken) {
        setSession(initialAccessToken, initialRefreshToken);
        setIsHydrated(true);
        return;
      }

      // Case 2: Không có refresh_token → Middleware đã xử lý redirect
      // Trường hợp này không xảy ra ở đây vì middleware đã chặn
      if (!initialRefreshToken) {
        setIsHydrated(true);
        return;
      }

      // Case 3: Có refresh_token nhưng KHÔNG có access_token
      // → Call API để lấy access_token mới
      if (!initialAccessToken && initialRefreshToken) {
        console.log("Access token missing, refreshing from cookies...");
        setIsRefreshing(true);

        try {
          // Gọi API backend để refresh access_token
          const result = await authRequest.refreshTokenClient({
            refresh_token: initialRefreshToken
          });

          if (!result.data?.access_token) {
            throw new Error("Invalid refresh token response");
          }

          const newAccessToken = result.data.access_token;
          
          console.log("New access token received, syncing...");
          
          // Step 1: Set vào Zustand store
          setSession(newAccessToken, initialRefreshToken);
          
          // Step 2: Đồng bộ access_token mới vào cookies thông qua API route
          await authRequest.refreshTokenServer({
            access_token: newAccessToken
          });
          
          console.log("Access token restored successfully");
          toast.success("Phiên đăng nhập đã được khôi phục");
          
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          
          // Refresh thất bại → Clear hết và redirect
          toast.error("Không thể khôi phục phiên đăng nhập, vui lòng đăng nhập lại");
          
          try {
            // Xóa cookies
            await authRequest.logoutServer();
          } catch (logoutError) {
            console.error("Failed to clear cookies:", logoutError);
          }
          
          // Redirect về login
          window.location.href = "/login";
          return;
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsHydrated(true);
    };

    initializeAuth();
  }, []); 

  // Show loading khi đang hydrate hoặc đang refresh
  if (!isHydrated || isRefreshing) {
    return <Loading />;
  }

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