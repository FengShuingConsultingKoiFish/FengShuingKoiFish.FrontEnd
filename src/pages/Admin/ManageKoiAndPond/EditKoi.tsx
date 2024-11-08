import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { MdAddPhotoAlternate } from "react-icons/md"
import { useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import { axiosClient } from "@/lib/api/config/axios-client"

import { FileUpload } from "@/components/ui/FileUpload"
import Input from "@/components/ui/Input"

interface EditKoiFormData {
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

interface KoiBreed {
  id: number
  name: string
  koiCategoryId: number
}

const EditKoi: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [koiCategories, setKoiCategories] = useState<KoiCategory[]>([])
  const [existingKoiBreeds, setExistingKoiBreeds] = useState<KoiBreed[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditKoiFormData>()

  useEffect(() => {
    const fetchKoiDetails = async () => {
      setIsLoading(true)
      try {
        const response = await axiosClient.get(`/api/Koi/Get-All-KoiBreeds`)
        if (response.data.isSuccess) {
          const koi = response.data.result.find(
            (item: KoiBreed) => item.id === parseInt(id || "0")
          )

          if (koi) {
            reset({
              koiCategoryId: koi.koiCategoryId,
              name: koi.name,
              colors: koi.colors,
              pattern: koi.pattern,
              description: koi.description,
              image: koi.image
            })
          } else {
            toast.error("Không tìm thấy giống cá Koi.")
            navigate("/admin/quan-li-loai-ca-va-loai-ho/all-koi")
          }
          setExistingKoiBreeds(response.data.result)
        } else {
          toast.error("Có lỗi xảy ra khi tải dữ liệu.")
        }
      } catch {
        toast.error("Lỗi khi tải dữ liệu.")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchKoiCategories = async () => {
      try {
        const response = await axiosClient.get("/api/Koi/Get-All-KoiCategories")
        if (response.data.isSuccess) {
          setKoiCategories(response.data.result)
        }
      } catch {
        toast.error("Có lỗi xảy ra khi tải danh sách loại cá Koi.")
      }
    }

    fetchKoiDetails()
    fetchKoiCategories()
  }, [id, navigate, reset])

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

  const onSubmit: SubmitHandler<EditKoiFormData> = async (data) => {
    const selectedCategoryId = Number(data.koiCategoryId)
    const normalizedName = data.name.trim().toLowerCase()

    const isDuplicate = existingKoiBreeds.some(
      (koi) =>
        koi.name.trim().toLowerCase() === normalizedName &&
        koi.koiCategoryId === selectedCategoryId &&
        koi.id !== parseInt(id || "0")
    )

    if (isDuplicate) {
      toast.error(
        "Tên giống cá Koi đã tồn tại trong loại đã chọn. Vui lòng chọn tên khác."
      )
      return
    }

    setIsLoading(true)
    try {
      const uploadedImageUrl = uploadedFile
        ? await handleImageUpload(uploadedFile)
        : data.image
      if (!uploadedImageUrl) {
        setIsLoading(false)
        return
      }

      const koiPayload = {
        ...data,
        koiCategoryId: selectedCategoryId,
        image: uploadedImageUrl
      }

      const response = await axiosClient.put(
        `/api/Koi/${id}/KoiBreed`,
        koiPayload
      )
      if (response.data.isSuccess) {
        toast.success("Cập nhật giống cá Koi thành công.")
        navigate("/admin/quan-li-ca-va-ho/all-koi")
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi cập nhật.")
      }
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật giống cá Koi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex w-full flex-col">
      <div className="max-w-[500px]">
        <h2 className="mb-4 text-2xl font-semibold">Chỉnh sửa giống cá Koi</h2>
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
            label={isLoading ? "" : "Cập nhật"}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  )
}

export default EditKoi
