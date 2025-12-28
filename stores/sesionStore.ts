import { create } from "zustand"
import { decodeJWT } from "@/lib/utils"
import { JWTUserType } from "@/utils/type"

interface SessionState {
  access_token: string | null
  user: JWTUserType | null

  setSession: (access_token: string) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  access_token: null,
  user: null,

  setSession: (access_token: string) => {
    try {
      const decodedUser = decodeJWT<JWTUserType>(access_token)
      set({
        access_token,
        user: decodedUser,
      })
    } catch (error) {
      console.error("Invalid access token", error)
      set({
        access_token: null,
        user: null,
      })
    }
  },

  clearSession: () => {
    set({
      access_token: null,
      user: null,
    })
  },
}))
