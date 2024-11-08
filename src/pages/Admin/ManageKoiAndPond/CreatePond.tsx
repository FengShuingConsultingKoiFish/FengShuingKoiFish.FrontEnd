import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { MdAddPhotoAlternate } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import { axiosClient } from "@/lib/api/config/axios-client"

import { FileUpload } from "@/components/ui/FileUpload"
import Input from "@/components/ui/Input"

interface CreatePondFormData {
  pondCategoryId: number
  name: string
  description: string
  image: string
}

interface PondCategory {
  id: number
  name: string
}

interface PondCharacteristic {
  id: number
  name: string
  pondCategoryId: number
}

const CreatePond: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [pondCategories, setPondCategories] = useState<PondCategory[]>([])
  const [existingPondCharacteristics, setExistingPondCharacteristics] =
    useState<PondCharacteristic[]>([])
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreatePondFormData>()

  useEffect(() => {
    const fetchPondCategories = async () => {
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCategories"
        )
        if (response.data.isSuccess) {
          setPondCategories(response.data.result)
        } else {
          toast.error("Có lỗi xảy ra khi tải danh sách loại hồ.")
        }
      } catch (error) {
        console.error("Error fetching pond categories:", error)
        toast.error("Có lỗi xảy ra khi tải danh sách loại hồ.")
      }
    }

    const fetchExistingPondCharacteristics = async () => {
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCharacteristics"
        )
        if (response.data.isSuccess) {
          setExistingPondCharacteristics(response.data.result)
        }
      } catch (error) {
        console.error("Error fetching pond characteristics:", error)
        toast.error("Có lỗi xảy ra khi tải danh sách đặc điểm hồ.")
      }
    }

    fetchPondCategories()
    fetchExistingPondCharacteristics()
  }, [])

  const handleFileUploadClick = () => {
    setShowFileUpload(true)
  }

  const handleFileChange = (files: File[]) => {
    setUploadedFile(files[0])
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("File", file)

    try {
      const response = await axiosClient.post(
        "/api/Images/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      if (response.data.isSuccess) {
        return response.data.result.filePath
      } else {
        toast.error("Tải lên ảnh không thành công, vui lòng thử lại.")
        return null
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Có lỗi xảy ra khi tải lên ảnh.")
      return null
    }
  }

  const onSubmit: SubmitHandler<CreatePondFormData> = async (data) => {
    const selectedCategoryId = Number(data.pondCategoryId)

    // Kiểm tra trùng lặp
    const isDuplicate = existingPondCharacteristics.some(
      (pond) =>
        pond.name.trim().toLowerCase() === data.name.trim().toLowerCase() &&
        pond.pondCategoryId === selectedCategoryId
    )

    if (isDuplicate) {
      toast.error(
        "Tên đặc điểm hồ đã tồn tại trong loại hồ đã chọn. Vui lòng chọn tên khác."
      )
      return
    }

    setIsLoading(true)
    try {
      const uploadedImageUrl = uploadedFile
        ? await handleImageUpload(uploadedFile)
        : ""
      if (!uploadedImageUrl) {
        setIsLoading(false)
        return
      }

      const pondPayload = {
        ...data,
        pondCategoryId: selectedCategoryId,
        image: uploadedImageUrl
      }

      const response = await axiosClient.post(
        "/api/Pond/Add-PondCharacteristic",
        pondPayload
      )
      if (response.data.isSuccess) {
        toast.success("Tạo đặc điểm hồ thành công")
        reset()
        setUploadedFile(null)
        setShowFileUpload(false)
        setTimeout(() => {
          navigate("/admin/quan-li-ca-va-ho/all-pond")
        }, 1000)
      } else {
        toast.error(
          response.data.message || "Có lỗi xảy ra khi tạo đặc điểm hồ."
        )
      }
    } catch (error) {
      console.error("Error creating pond characteristic:", error)
      toast.error("Có lỗi xảy ra khi tạo đặc điểm hồ.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex w-full flex-col">
      <div className="max-w-[500px]">
        <h2 className="mb-4 text-2xl font-semibold">Tạo đặc điểm hồ</h2>
        <div className="flex items-center justify-start gap-5">
          <CustomButton
            icon={<MdAddPhotoAlternate size={25} />}
            label="Tải ảnh lên"
            onClick={handleFileUploadClick}
          />
        </div>
        {showFileUpload && <FileUpload onChange={handleFileChange} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="pondCategoryId" className="block font-semibold">
              Chọn loại hồ
            </label>
            <select
              id="pondCategoryId"
              {...register("pondCategoryId", {
                required: "Vui lòng chọn loại hồ"
              })}
              className="w-full rounded-md border border-neutral-300 p-2"
              disabled={isLoading}
            >
              <option value="">-- Chọn loại hồ --</option>
              {pondCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.pondCategoryId && (
              <p className="text-sm text-red-500">
                {errors.pondCategoryId.message}
              </p>
            )}
          </div>
          <Input
            id="name"
            label="Tên đặc điểm hồ"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            onChange={() => {}}
          />
          <Input
            id="description"
            label="Mô tả"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            onChange={() => {}}
          />

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

export default CreatePond
