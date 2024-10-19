
import { useCallback, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { ClipLoader } from "react-spinners"
import * as yup from "yup"

//import ModalButton from "./ModalBtn";
import useLoginModal from "@/hooks/useLoginModal"
import useSignupModal from "@/hooks/useSignupModal"

import { registerUser } from "@/lib/api/Authen"

import Input from "../Input"
import Heading from "../ModalHead"
import Modal from "./Modal"

//const emailUsernameRegex = /^[a-zA-Z0-9.]+$/

// Define the form schema with Yup
const schema = yup.object().shape({
  name: yup.string().required("Hãy nhập tên của bạn"),
  email: yup
    .string()
    .required("Email là bắt buộc"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu không khớp")
    .required("Hãy nhập lại mật khẩu"),
  phoneNumber: yup.string().required("Hãy nhập số điện thoại") // Add validation for phone number
})

// Define types for the form data
interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
}

const SignupModal: React.FC = () => {
  const signupModal = useSignupModal()
  const loginModal = useLoginModal()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      phoneNumber: ""
    }
  })

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true)

        const result = await registerUser(
          data.email,
          data.name,
          data.password,
          data.confirmPassword,
          data.phoneNumber
        )
        setIsLoading(false)
        signupModal.onClose()
        toast.success(result.message)
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
    [signupModal]
  )

  const toggle = useCallback(() => {
    signupModal.onClose()
    loginModal.onOpen()
  }, [loginModal, signupModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Chào mừng bạn đến với KoiFish!"
        subtitle="Hãy tạo tài khoản nào!"
      />

      <Input
        id="email"
        placeholder=""
        onChange={()=>{}}
        label="Email"
        domain=""
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <Input
        id="name"
        placeholder=""
        onChange={()=>{}}
        label="Tên của bạn"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <Input
        id="password"
        placeholder=""
        onChange={()=>{}}
        type="password"
        label="Mật khẩu"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}

      <Input
        id="confirmPassword"
        placeholder=""
        onChange={()=>{}}
        type="password"
        label="Nhập lại mật khẩu"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.confirmPassword && (
        <p className="text-red-500">{errors.confirmPassword.message}</p>
      )}

      <Input
        id="phoneNumber"
        placeholder=""
        onChange={()=>{}}
        type="text"
        label="Số điện thoại"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.phoneNumber && (
        <p className="text-red-500">{errors.phoneNumber.message}</p>
      )}
    </div>
  )

  const footerContent = (
    <div className="mt-3 flex flex-col gap-4">
      <hr />
      <div className="mt-4 text-center text-sm font-semibold">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Đã có tài khoản?</div>
          <div
            onClick={toggle}
            className="cursor-pointer text-neutral-800 hover:underline"
          >
            Đăng nhập
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={signupModal.isOpen}
      title="Đăng ký"
      actionLabel={
        isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Tiếp tục"
      }
      onClose={signupModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default SignupModal
