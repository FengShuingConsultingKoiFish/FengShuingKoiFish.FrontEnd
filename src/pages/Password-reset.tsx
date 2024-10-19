import { useCallback, useEffect, useState } from "react"

import { yupResolver } from "@hookform/resolvers/yup"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import * as yup from "yup"

import useLoginModal from "@/hooks/useLoginModal"

import { ResetPassword } from "@/lib/api/User"

import { Button } from "@/components/global/atoms/button"
import Logo from "@/components/layout/header/Logo"
import { BackgroundEff } from "@/components/ui/BackgroundEff"
import Input from "@/components/ui/Input"

const PasswordReset = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [emailMissing, setEmailMissing] = useState<boolean>(false)
  const loginModal = useLoginModal()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  interface PasswordResetFormData {
    email: string
    newPassword: string
    confirmedNewPassword: string
    token: string
  }

  // Define the form schema with Yup
  const schema = yup.object().shape({
    email: yup.string().notRequired(),
    token: yup.string().notRequired(),
    newPassword: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu là bắt buộc"),
    confirmedNewPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Mật khẩu không khớp")
      .required("Hãy nhập lại mật khẩu")
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<PasswordResetFormData>({
    //resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmedNewPassword: "",
      token: ""
    }
  })

  useEffect(() => {
    // Extract email and token from the query params
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    // If both email and token are found, set them as the default values
    if (email && token) {
      setValue("email", email)
      setValue("token", token)
    } else if (!email) {
      setEmailMissing(true)
    }
  }, [searchParams, setValue])

  const onSubmit: SubmitHandler<PasswordResetFormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true)
        const result = await ResetPassword(
          data.email,
          data.newPassword,
          data.confirmedNewPassword,
          data.token
        )
        setIsLoading(false)
        console.log(data.email)
        console.log(data.token)
        console.log(data.confirmedNewPassword)
        console.log(data.newPassword)
        if ("result" in result && result.result.isSuccess) {
          toast.success(result.result.message)
          navigate("/")
          loginModal.onOpen()
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

  if (emailMissing) {
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
                  Vui lòng kiểm tra email để lấy liên kết khôi phục mật khẩu !
                </h2>
              </div>
            </div>
          </div>
        </div>
      </BackgroundEff>
    )
  }

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
                Khôi phục mật khẩu
              </h2>
              <div className="flex flex-col gap-3">
                <Input
                  id="email"
                  placeholder=""
                  type="email"
                  label="Email của bạn"
                  disabled={true}
                  register={register}
                  errors={errors}
                  required
                />
                <Input
                  id="newPassword"
                  placeholder=""
                  type="password"
                  label="Mật khẩu mới"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
                <Input
                  id="confirmedNewPassword"
                  placeholder=""
                  type="password"
                  label="Nhập lại mật khẩu"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
              </div>

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
                    "Xác nhận"
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

export default PasswordReset
