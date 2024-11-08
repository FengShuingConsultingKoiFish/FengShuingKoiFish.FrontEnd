import { useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import { axiosClient } from "@/lib/api/config/axios-client"

interface CreateZodiacFormData {
  zodiacName: string
}

export const CreateZodiac = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateZodiacFormData>()

  const checkDuplicateZodiacName = async (name: string) => {
    try {
      const response = await axiosClient.get("/api/Zodiac/Get-All-Zodiac")
      if (response.data.isSuccess) {
        return response.data.result.some(
          (zodiac: { zodiacName: string }) => zodiac.zodiacName === name
        )
      }
      return false
    } catch (error) {
      console.error("Error fetching zodiac names:", error)
      return false
    }
  }

  const onSubmit: SubmitHandler<CreateZodiacFormData> = async (data) => {
    setIsLoading(true)
    const isDuplicate = await checkDuplicateZodiacName(data.zodiacName)

    if (isDuplicate) {
      toast.error("Tên mệnh đã tồn tại. Vui lòng chọn tên khác.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axiosClient.post("/api/Zodiac/Add-Zodiac", {
        zodiacName: data.zodiacName
      })

      if (response.data.isSuccess) {
        toast.success("Thêm mệnh thành công")
        reset()
        setTimeout(() => {
          navigate("/admin/quan-li-menh/all")
        }, 1000)
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error creating zodiac:", error)
      toast.error("Có lỗi xảy ra trong quá trình tạo mệnh")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h2 className="mb-4 text-2xl font-semibold">Tạo mệnh mới</h2>
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
