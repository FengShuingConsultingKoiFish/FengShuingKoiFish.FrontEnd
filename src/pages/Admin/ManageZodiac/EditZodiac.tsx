import { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

interface EditZodiacFormData {
  zodiacName: string
}

const EditZodiac: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditZodiacFormData>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchZodiacDetails = async () => {
      setIsLoading(true)
      try {
        const response = await axiosClient.get("/api/Zodiac/Get-All-Zodiac")
        if (response.data.isSuccess) {
          const zodiac = response.data.result.find(
            (item: { id: number; zodiacName: string }) =>
              item.id === parseInt(id || "0")
          )
          if (zodiac) {
            reset({ zodiacName: zodiac.zodiacName })
          } else {
            toast.error("Không tìm thấy mệnh.")
            navigate("/admin/quan-li-menh/all")
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

    fetchZodiacDetails()
  }, [id, navigate, reset])

  const checkDuplicateZodiacName = async (name: string) => {
    try {
      const response = await axiosClient.get("/api/Zodiac/Get-All-Zodiac")
      if (response.data.isSuccess) {
        return response.data.result.some(
          (zodiac: { id: number; zodiacName: string }) =>
            zodiac.zodiacName === name && zodiac.id !== parseInt(id || "0")
        )
      }
      return false
    } catch (error) {
      console.error("Error checking duplicate zodiac name:", error)
      return false
    }
  }

  const onSubmit: SubmitHandler<EditZodiacFormData> = async (data) => {
    setIsLoading(true)
    const isDuplicate = await checkDuplicateZodiacName(data.zodiacName)

    if (isDuplicate) {
      toast.error("Tên mệnh đã tồn tại. Vui lòng chọn tên khác.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axiosClient.put(`/api/Zodiac/${id}`, {
        zodiacName: data.zodiacName
      })

      if (response.data.isSuccess) {
        toast.success("Cập nhật mệnh thành công.")
        navigate("/admin/quan-li-menh/all")
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi cập nhật.")
      }
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật mệnh.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h2 className="mb-4 text-2xl font-semibold">Chỉnh sửa mệnh</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="zodiacName" className="mb-2 font-semibold">
              Tên mệnh
            </label>
            <input
              type="text"
              id="zodiacName"
              {...register("zodiacName", { required: "Tên mệnh là bắt buộc" })}
              className="rounded-md border border-neutral-300 p-2"
              placeholder="Nhập tên mệnh"
            />
            {errors.zodiacName && (
              <p className="text-sm text-red-500">
                {errors.zodiacName.message}
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
              onClick={() => navigate("/admin/quan-li-menh/all")}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditZodiac
