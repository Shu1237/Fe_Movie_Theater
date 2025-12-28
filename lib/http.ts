import envconfig from "@/config";
import { normalizePath } from "./utils";
import { ResponseData } from "@/utils/type";
import { useSessionStore } from "@/stores/sesionStore";

const isServer = typeof window === "undefined";
interface CustomOptions extends RequestInit {
  baseURL?: string | undefined;
  params?: Record<string, string | number | boolean | undefined>;
}

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
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const payload: ResponseData<T> = await res.json();
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
