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

interface CreateKoiFormData {
  koiCategoryId: number
  name: string
  colors: string
  pattern: string
  description: string
  image: string
}

interface KoiCategory {
  id: number
  name: string
}

const CreateKoi: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [koiCategories, setKoiCategories] = useState<KoiCategory[]>([])
  const [existingKoiList, setExistingKoiList] = useState<
    { name: string; koiCategoryId: number }[]
  >([])
  const navigate = useNavigate()
  const [isKoiListLoading, setIsKoiListLoading] = useState<boolean>(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateKoiFormData>()

  useEffect(() => {
    const fetchKoiCategories = async () => {
      try {
        const response = await axiosClient.get("/api/Koi/Get-All-KoiCategories")
        if (response.data.isSuccess) {
          setKoiCategories(response.data.result)
        } else {
          toast.error("Có lỗi xảy ra khi tải danh sách loại cá Koi.")
        }
      } catch (error) {
        console.error("Error fetching koi categories:", error)
        toast.error("Có lỗi xảy ra khi tải danh sách loại cá Koi.")
      }
    }

    const fetchExistingKoiList = async () => {
      try {
        const response = await axiosClient.get("/api/Koi/Get-All-KoiBreeds")
        if (response.data.isSuccess) {
          setExistingKoiList(response.data.result)
        }
      } catch (error) {
        console.error("Error fetching existing koi breeds:", error)
        toast.error("Có lỗi xảy ra khi tải danh sách giống cá Koi.")
      } finally {
        setIsKoiListLoading(false)
      }
    }

    fetchKoiCategories()
    fetchExistingKoiList()
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

  const onSubmit: SubmitHandler<CreateKoiFormData> = async (data) => {
    if (isKoiListLoading) {
      toast.error("Danh sách giống cá Koi chưa tải xong.")
      return
    }

    const normalizedName = data.name.trim().toLowerCase()
    const selectedCategoryId = Number(data.koiCategoryId)

    const isDuplicate = existingKoiList.some((koi) => {
      const isNameMatch = koi.name.trim().toLowerCase() === normalizedName
      const isCategoryMatch = koi.koiCategoryId === selectedCategoryId
      return isNameMatch && isCategoryMatch
    })

    if (isDuplicate) {
      toast.error(
        "Tên giống cá Koi đã tồn tại trong loại này. Vui lòng chọn tên khác."
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

      const koiPayload = { ...data, image: uploadedImageUrl }

      const response = await axiosClient.post(
        "/api/Koi/Add-KoiBreed",
        koiPayload
      )

      if (response.data.isSuccess) {
        toast.success("Tạo giống cá Koi thành công")
        reset()
        setUploadedFile(null)
        setShowFileUpload(false)
        setTimeout(() => {
          navigate("/admin/quan-li-ca-va-ho/all-koi")
        }, 1000)
      } else {
        toast.error(
          response.data.message || "Có lỗi xảy ra khi tạo giống cá Koi."
        )
      }
    } catch {
      toast.error("Có lỗi xảy ra khi tạo giống cá Koi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex w-full flex-col">
      <div className="max-w-[500px]">
        <h2 className="mb-4 text-2xl font-semibold">Tạo giống cá Koi</h2>
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
            <label htmlFor="koiCategoryId" className="block font-semibold">
              Chọn loại cá Koi
            </label>
            <select
              id="koiCategoryId"
              {...register("koiCategoryId", {
                required: "Vui lòng chọn loại cá Koi"
              })}
              className="w-full rounded-md border border-neutral-300 p-2"
              disabled={isLoading}
            >
              <option value="">-- Chọn loại cá Koi --</option>
              {koiCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.koiCategoryId && (
              <p className="text-sm text-red-500">
                {errors.koiCategoryId.message}
              </p>
            )}
          </div>
          <Input
            id="name"
            label="Tên giống cá Koi"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            onChange={() => {}}
          />
          <Input
            id="colors"
            label="Màu sắc"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            onChange={() => {}}
          />
          <Input
            id="pattern"
            label="Hoa văn"
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

export default CreateKoi
