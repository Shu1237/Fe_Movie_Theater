export type ResponseData<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type JWTUserType = {
  account_id: string;
  username: string;
  email: string;
  provider: "local" | "google";
  role_id: number;
};

export interface AuthContextType {
  setTokenFromContext: (accessToken: string) => void;
}