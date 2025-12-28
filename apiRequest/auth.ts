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
};
