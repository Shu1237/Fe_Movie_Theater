"use client";
import { authRequest } from "@/apiRequest/auth";
import { cinemaRoomRequest } from "@/apiRequest/cinema-room";
import { Button } from "@/components/ui/button";
import { useAuthMutation } from "@/hooks/mutations/useAuth.mutation";

import { useSessionStore } from "@/stores/sesionStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const TestComponents = () => {
    const { user } = useSessionStore();
    const { logout } = useAuthMutation();
    const router = useRouter();

    const handleLogout = async () => {
        logout.mutate(undefined, {
            onSuccess: async (res) => {
                if (res.success) {
                    // call server to clear cookie
                    await authRequest.logoutServer();
                    toast.success(res.message || "Đăng xuất thành công!");
                    router.push("/login");
                }
            },
            onError: (error) => {
                console.log("Logout error:", error);
                toast.error(error?.message || "Đăng xuất thất bại!");
            }
        });

    }
    return (
        <div>
            <h1>{user?.username}</h1>
            <Button onClick={handleLogout}>Logout</Button>

        </div>
    )
}
export default TestComponents;