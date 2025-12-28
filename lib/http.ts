import envconfig from "@/config";
import { ResponseData } from "@/utils/type";
import { useSessionStore } from "@/stores/sesionStore";
import { redirect } from "next/navigation";
import { authRequest } from "@/apiRequest/auth";

const isServer = typeof window === "undefined";
interface CustomOptions extends RequestInit {
  baseURL?: string | undefined;
  params?: Record<string, string | number | boolean | undefined>;
}
const isExpired = "Token expired";

async function httpRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: CustomOptions | undefined
): Promise<ResponseData<T>> {
  const body = data?.body
    ? data.body instanceof FormData
      ? data.body
      : JSON.stringify(data.body)
    : undefined;
  //   base header
  const baseHeaders =
    body instanceof FormData
      ? {
          Authorization: useSessionStore.getState().access_token
            ? `Bearer ${useSessionStore.getState().access_token}`
            : "",
        }
      : {
          "Content-type": "application/json",
          Authorization: useSessionStore.getState().access_token
            ? `Bearer ${useSessionStore.getState().access_token}`
            : "",
        };

  // Nếu không truyền baseUrl => envConfig.NEXT_PUBLIC_API_URL
  // Nếu truyền baseUrl => sever nextjs

  const baseUrl =
    data?.baseURL === undefined ? envconfig.NEXT_PUBLIC_API_URL : data.baseURL;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;
  const res = await fetch(fullUrl, {
    ...data,
    headers: {
      ...baseHeaders,
      ...data?.headers,
    } as any,
    body,
    method,
  });
  const payload: ResponseData<T> = await res.json();
  if (!res.ok) {
    if (res.status === 401 && payload.message === isExpired) {
      // server
      if (isServer) {
        redirect("/login");
      }
      // client
      else {
        const refresh_token_client = useSessionStore.getState().refresh_token;
        if (!refresh_token_client) {
          location.href = "/login";
          throw new Error("No refresh token available");
        }
        
        try {
          console.log("Refreshing token...");
          const result = await authRequest.refreshTokenClient({ 
            refresh_token: refresh_token_client 
          });
          
          if (result.data?.access_token) {
            // Update store with new token
            useSessionStore.getState().setSession(
              result.data.access_token,
              refresh_token_client
            );
            
            // Call server để set cookie
            await authRequest.refreshTokenServer({ 
              access_token: result.data.access_token
            });
            
            // Retry the original request
            return httpRequest<T>(method, url, data);
          } else {
            location.href = "/login";
            throw new Error("Failed to refresh token");
          }
        } catch (error) {
          location.href = "/login";
          throw error;
        }
      }
    }
    throw new Error(payload.message || "Lỗi không xác định");
  }

  return payload;
}

const http = {
  get<T>(url: string, options?: CustomOptions) {
    return httpRequest<T>("GET", url, options);
  },
  post<T>(
    url: string,
    body: any,
    data?: Omit<CustomOptions, "body"> | undefined
  ) {
    return httpRequest<T>("POST", url, { ...data, body });
  },
  put<T>(
    url: string,
    body: any,
    data?: Omit<CustomOptions, "body"> | undefined
  ) {
    return httpRequest<T>("PUT", url, { ...data, body });
  },
  delete<T>(url: string, data?: Omit<CustomOptions, "body"> | undefined) {
    return httpRequest<T>("DELETE", url, data);
  },
};
export default http;
