import { useCallback, useState } from "react"

import { yupResolver } from "@hookform/resolvers/yup"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import * as yup from "yup"

import useLoginModal from "@/hooks/useLoginModal"
import useSignupModal from "@/hooks/useSignupModal"

import { loginUser } from "@/lib/api/Authen"
import { setCurrentUser } from "@/lib/redux/reducers/userSlice"
import { AppDispatch } from "@/lib/redux/store"

import Input from "../Input"
import Heading from "../ModalHead"
import Modal from "./Modal"

// Define the schema with yup
const schema = yup.object().shape({
  email: yup.string().required("Vui lòng nhập tên hoặc email của bạn"),
  password: yup.string().required("Mật khẩu là bắt buộc")
})

interface LoginFormData {
  email: string
  password: string
}

const LoginModal = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const loginModal = useLoginModal()
  const signupModal = useSignupModal()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<LoginFormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true)
        const result = await dispatch(loginUser(data.email, data.password))
        setIsLoading(false)

        // Store token in localStorage (or sessionStorage as in loginUser function)
        if (result && result.user) {
          const mappedUser = {
            Id: result.user.Id,
            Name: result.user.Name,
            Email: result.user.Email,
            Role: result.user.Role
          }
          dispatch(setCurrentUser(mappedUser))

          toast.success(result.message)
          loginModal.onClose()
          if (result.user.Name === "Admin") {
            navigate("/admin")
          } else {
            navigate("/")
          }
        }
      } catch (error: any) {
        setIsLoading(false)
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors
          if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((err: { key: string; value: string }) => {
              toast.error(`${err.value}`)
            })
          } else {
            toast.error("Login failed due to unknown reasons")
          }
        } else {
          toast.error("An unknown error occurred during login.")
        }
      }
    },
    [loginModal, dispatch]
  )

  const toogle = useCallback(() => {
    loginModal.onClose()
    signupModal.onOpen()
  }, [loginModal])

  const handleForgotPass = useCallback(() => {
    navigate("/password-forgot")
    loginModal.onClose()
  }, [loginModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Chào mừng !"
        subtitle="Hãy điền thông tin đăng nhập của bạn"
      />

      <Input
        id="email"
        onChange={() => {}}
        label="Email hoặc tên"
        disabled={isLoading}
        register={register}
        errors={errors}
        placeholder=""
        required
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <Input
        id="password"
        onChange={() => {}}
        type="password"
        label="Mật khẩu"
        disabled={isLoading}
        register={register}
        errors={errors}
        placeholder=""
        required
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}
    </div>
  )

  const footerContent = (
    <div className="mt-3 flex flex-col gap-4">
      <hr />
      <div className="mt-4 text-center text-sm font-semibold">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Bạn là người mới ? </div>
          <div
            onClick={toogle}
            className="cursor-pointer text-sm hover:underline"
          >
            Tạo tài khoản ở đây
          </div>
        </div>
      </div>
      <div className="mt-2 text-center text-sm font-semibold">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Quên mật khẩu? </div>
          <div
            onClick={handleForgotPass}
            className="cursor-pointer text-sm hover:underline"
          >
            Ở đây
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Đăng nhập"
      actionLabel={
        isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Tiếp tục"
      }
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default LoginModal
