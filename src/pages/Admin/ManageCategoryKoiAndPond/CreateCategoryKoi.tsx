import React, { useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import { axiosClient } from "@/lib/api/config/axios-client"

interface CreateCategoryKoiFormData {
  name: string
  description: string
}

const CreateCategoryKoi: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateCategoryKoiFormData>()

  const checkDuplicateName = async (name: string) => {
    try {
      const response = await axiosClient.get("/api/Koi/Get-All-KoiCategories")

      if (response.data.isSuccess) {
        return response.data.result.some(
          (category: { name: string }) => category.name === name
        )
      }
      return false
    } catch (error) {
      console.error("Error checking duplicate names:", error)
      return false
    }
  }

  const onSubmit: SubmitHandler<CreateCategoryKoiFormData> = async (data) => {
    setIsLoading(true)

    const isDuplicate = await checkDuplicateName(data.name)
    if (isDuplicate) {
      toast.error("Tên danh mục đã tồn tại. Vui lòng chọn tên khác.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axiosClient.post("/api/Koi/Add-KoiCategory", data)

      if (response.data.isSuccess) {
        toast.success("Thêm danh mục cá Koi thành công")
        reset()
        setTimeout(() => {
          navigate("/admin/quan-li-loai-ca-va-loai-ho/all-koi")
        }, 2000)
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error creating Koi category:", error)
      toast.error("Có lỗi xảy ra trong quá trình tạo danh mục")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h2 className="mb-4 text-2xl font-semibold">Tạo Danh Mục Cá Koi</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold">
              Tên danh mục
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Tên danh mục là bắt buộc" })}
              className="rounded-md border border-neutral-300 p-2"
              placeholder="Nhập tên danh mục"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="mb-2 font-semibold">
              Mô tả
            </label>
            <textarea
              id="description"
              {...register("description", { required: "Mô tả là bắt buộc" })}
              className="rounded-md border border-neutral-300 p-2"
              placeholder="Nhập mô tả"
            ></textarea>
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <CustomButton
            icon={
              isLoading ? (
                <ClipLoader size={20} color={"#fff"} />
              ) : (
                <IconSquareRoundedPlusFilled />
              )
            }
            label={isLoading ? "" : "Tạo"}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  )
}

export default CreateCategoryKoi
