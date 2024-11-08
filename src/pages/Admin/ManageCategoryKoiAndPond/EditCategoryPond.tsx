import { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

interface EditCategoryPondFormData {
  name: string
  description: string
}

const EditCategoryPond: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditCategoryPondFormData>()

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setIsLoading(true)
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCategories"
        )
        if (response.data.isSuccess) {
          const category = response.data.result.find(
            (item: { id: number; name: string; description: string }) =>
              item.id === parseInt(id || "0")
          )
          if (category) {
            reset({ name: category.name, description: category.description })
          } else {
            toast.error("Không tìm thấy danh mục.")
            navigate("/admin/quan-li-loai-ca-va-loai-ho/all-pond")
          }
        } else {
          toast.error("Có lỗi xảy ra khi tải dữ liệu.")
        }
      } catch {
        toast.error("Lỗi khi tải dữ liệu.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryDetails()
  }, [id, navigate, reset])

  const checkDuplicateCategoryName = async (name: string) => {
    try {
      const response = await axiosClient.get("/api/Pond/Get-All-PondCategories")
      if (response.data.isSuccess) {
        return response.data.result.some(
          (category: { id: number; name: string }) =>
            category.name === name && category.id !== parseInt(id || "0")
        )
      }
      return false
    } catch (error) {
      console.error("Error checking duplicate category name:", error)
      return false
    }
  }

  const onSubmit: SubmitHandler<EditCategoryPondFormData> = async (data) => {
    setIsLoading(true)
    const isDuplicate = await checkDuplicateCategoryName(data.name)

    if (isDuplicate) {
      toast.error("Tên danh mục đã tồn tại. Vui lòng chọn tên khác.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axiosClient.put(`/api/Pond/${id}`, data)
      if (response.data.isSuccess) {
        toast.success("Cập nhật danh mục hồ thành công.")
        navigate("/admin/quan-li-loai-ca-va-loai-ho/all-pond")
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi cập nhật.")
      }
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật danh mục.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h2 className="mb-4 text-2xl font-semibold">Chỉnh sửa danh mục hồ</h2>
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
          <div className="flex justify-between">
            <CustomButton
              label={isLoading ? "Đang lưu..." : "Lưu"}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            />
            <CustomButton
              label="Hủy"
              type="button"
              onClick={() =>
                navigate("/admin/quan-li-loai-ca-va-loai-ho/all-pond")
              }
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditCategoryPond
