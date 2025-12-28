"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { LoginInput, loginSchema } from "@/schemas/authSchema"
import { useAuthMutation } from "@/hooks/mutations/useAuth.mutation"
import { authRequest } from "@/apiRequest/auth"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/authContext"



export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const { login } = useAuthMutation()
  const { setTokenFromContext } = useAuthContext()
  const handleSubmit = async (data: LoginInput) => {
    login.mutate(data, {
      onSuccess: async (res) => {
        if (res.success) {
          setTokenFromContext(res.data.access_token, res.data.refresh_token);
          // server
          try {
            await authRequest.auth({
              access_token: res.data.access_token,
              refresh_token: res.data.refresh_token
            });
            toast.success(res.message || "Đăng nhập thành công!");
            router.push("/register");
            router.refresh();
          } catch (error) {
            console.error("Lỗi khi set cookie:", error);
            toast.error("Không thể lưu phiên đăng nhập");
          }

        } else {
          toast.error(res.message || "Đăng nhập thất bại. Vui lòng thử lại!");
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  }
//   const handleLoginGoogle = (credentialResponse: CredentialResponse) => {
//     loginGoogle.mutate(credentialResponse, {
//       onSuccess: (res) => {
//         if (res.isSuccess) {
//           setToken(res.data);
//           toast.success(res.message || "Đăng nhập thành công!");
//           router.navigate({ to: "/" });

//         } else {
//           toast.error(res.message || "Đăng nhập thất bại. Vui lòng thử lại!");
//         }
//       },
//       onError: (error) => {
//         toast.error(error.message);
//       },
//     })
//   }

  return (
    <Card className="w-full max-w-md mx-auto mt-16 shadow-xl rounded-2xl border border-primary/10 bg-background/95 backdrop-blur-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-extrabold text-primary">Đăng nhập</CardTitle>
        <CardDescription className="text-muted-foreground">
          Nhập email và mật khẩu để đăng nhập vào tài khoản của bạn
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

            {/* Email */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Nhập tên đăng nhập của bạn"
                        className="pl-12 border-primary/20 focus:border-primary"
                        disabled={login.isPending}
                        autoComplete="username"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu của bạn"
                        className="pl-12 pr-12 border-primary/20 focus:border-primary"
                        disabled={login.isPending}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={login.isPending}

                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Forgot password */}
            {/* <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="px-0 text-sm font-medium text-secondary hover:text-secondary/80"
                disabled={login.isPending}
                onClick={() => router.navigate({ to: "/auth/forgot-password" })}
              >
                Quên mật khẩu?
              </Button>
            </div> */}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
              disabled={login.isPending}
            >
              {login.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <span className="flex-1 h-px bg-border" />
              <span className="mx-3 text-muted-foreground text-sm">hoặc</span>
              <span className="flex-1 h-px bg-border" />
            </div>

            {/* Google Login */}
            {/* <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => handleLoginGoogle(credentialResponse)}
                onError={() => toast.error("Login Google thất bại")}
              />
            </div> */}

            {/* Register link */}
            {/* <div className="text-center mt-4 text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Button
                type="button"
                variant="link"
                className="px-0 font-medium text-primary hover:text-primary/80"
                disabled={login.isPending}
                onClick={() => router.navigate({ to: "/auth/register" })}
              >
                Đăng ký ngay
              </Button>
            </div> */}

          </form>
        </Form>
      </CardContent>
    </Card>
  )

}