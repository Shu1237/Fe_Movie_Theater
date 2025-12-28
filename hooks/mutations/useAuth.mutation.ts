
import { authRequest } from "@/apiRequest/auth";
import { LoginInput } from "@/schemas/authSchema";
import { useMutation } from "@tanstack/react-query";
export const useAuthMutation = () => {
    const login = useMutation({
       mutationFn: async (data:LoginInput)=>{
            return await authRequest.login(data)
       }
    });
    const logout = useMutation({
        mutationFn: async ()=>{
             return await authRequest.logoutClient()
        }
     });
    return { login, logout };
}