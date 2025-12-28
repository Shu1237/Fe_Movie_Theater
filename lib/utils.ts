import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {jwtDecode} from "jwt-decode";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const decodeJWT = <T>(token: string) => {
  return jwtDecode(token) as T
}