import http from "@/lib/http";
import { LoginInput } from "@/schemas/authSchema";

export const authRequest = {
  login: (data: LoginInput) =>
    http.post<{ access_token: string; refresh_token: string }>(
      "/auth/login",
      data
    ),
  // call sever to set up token
  auth: (body: { access_token: string; refresh_token: string }) =>
    http.post("/api/auth", body, {
      baseURL: "",
    }),
  logoutClient: () => http.post("/auth/logout", {}),
  logoutServer: () =>
    http.post("/api/auth/logout", undefined, {
      baseURL: "",
    }),

    // call client to refresh token
  refreshTokenClient: (body: { refresh_token: string }) =>
    http.post<{access_token:string}>("/auth/refresh_token", body),

  // call sever to refresh token - GỬI access_token thay vì refresh_token
  refreshTokenServer: (body: {access_token: string }) =>
    http.post<{access_token:string}>("/api/auth/refresh_token", body,
      {
        baseURL: ""

      }
    ),
      
};
