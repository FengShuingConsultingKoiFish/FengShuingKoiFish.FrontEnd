import { useCallback, useState } from "react"

import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import { ForgotPassword } from "@/lib/api/User"

import { Button } from "@/components/global/atoms/button"
import Logo from "@/components/layout/header/Logo"
import { BackgroundEff } from "@/components/ui/BackgroundEff"
import Input from "@/components/ui/Input"

const PasswordForgot = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  interface PasswordForgotFormData {
    email: string
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordForgotFormData>({
    defaultValues: {
      email: ""
    }
  })

  const onSubmit: SubmitHandler<PasswordForgotFormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true)
        const result = await ForgotPassword(data.email)
        setIsLoading(false)
        console.log(result)
        if ("result" in result && result.result.isSuccess) {
          toast.success(result.result.message)
          navigate("/")
        } else {
          toast.error(result.message || "Something went wrong")
        }
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.errors
            ? error.response.data.errors
                .map((err: { value: string }) => `${err.value}`)
                .join(", ")
            : error.response.data.message || "Error occurred!"

          toast.error(errorMessage)
        } else {
          toast.error("Something went wrong")
        }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return (
    <BackgroundEff className="pointer-events-none flex w-full flex-col items-center justify-center px-4">
      <div className="pointer-events-auto z-20 mb-12 cursor-pointer">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="pointer-events-auto z-20 w-full bg-white">
        <div className="flex flex-col items-center justify-center px-4 py-6">
          <div className="w-full max-w-md">
            <div className="rounded-3xl p-8 shadow-2xl">
              <h2 className="mb-16 text-center text-2xl font-bold text-primary">
                Nhập email đã đăng ký tài khoản
              </h2>
              <Input
                id="email"
                placeholder=""
                type="email"
                label="Email của bạn"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <div className="my-10 flex justify-center">
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ClipLoader size={24} color="white" />
                  ) : (
                    "Gửi email xác nhận"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundEff>
  )
}

export default PasswordForgot
