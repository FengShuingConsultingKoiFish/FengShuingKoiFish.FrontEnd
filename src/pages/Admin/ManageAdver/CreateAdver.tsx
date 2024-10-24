import React, { useCallback, useState } from "react"

import ImgChoosingModal from "@/pages/Blog/components/ImgChoosingModal"
import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { yupResolver } from "@hookform/resolvers/yup"
import { IconSquareRoundedPlusFilled, IconUpload } from "@tabler/icons-react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { MdAddPhotoAlternate } from "react-icons/md"
import { ClipLoader } from "react-spinners"

import useImgChoosingModal from "@/hooks/useChooseImgModal"

import { createUpdateAdvertisement } from "@/lib/api/AdvertisementPkg"
import { uploadImage } from "@/lib/api/Image"

import { FileUpload } from "@/components/ui/FileUpload"
import Input from "@/components/ui/Input"

interface CreateAdverFormData {
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  imageIds: number[]
}

interface Image {
  id: number
  imageUrl: string
}

export const CreateAdver: React.FC = () => {
  const imgChoosingModal = useImgChoosingModal()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [hideUploadButton, setHideUploadButton] = useState<boolean>(false)
  const [hideSelectButton, setHideSelectButton] = useState<boolean>(false)

  const handleSelectImages = (images: Image[]) => {
    setSelectedImages(images)
  }

  const handleFileUploadClick = () => {
    setShowFileUpload(true)
    setHideSelectButton(true)
  }

  const handleFileChange = (files: File[]) => {
    console.log("Selected file:", files[0])
    setUploadedFile(files[0])
  }

  const handleSelectImageClick = () => {
    imgChoosingModal.onOpen()
    setHideUploadButton(true)
  }

  const handleFileUpload = async (file: File): Promise<number> => {
    try {
      console.log("Uploading file:", file)
      const uploadedImageId = await uploadImage(file)
      console.log("Uploaded image ID:", uploadedImageId)
      return uploadedImageId
    } catch (error) {
      toast.error("Failed to upload image")
      throw error
    }
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<CreateAdverFormData>({
    //resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      limitAd: 0,
      limitContent: 0,
      limitImage: 0,
      imageIds: []
    }
  })

  const onSubmit: SubmitHandler<CreateAdverFormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true)

        let imageIds = selectedImages.map((image) => image.id)

        if (uploadedFile) {
          const uploadedImageId = await handleFileUpload(uploadedFile)
          console.log("New image ID to be added:", uploadedImageId)
          imageIds.push(uploadedImageId)
        }

        // Prepare the payload for the API call
        const adverPayload = {
          id: 0,
          name: data.name,
          price: data.price,
          description: data.description,
          limitAd: data.limitAd,
          limitContent: data.limitContent,
          limitImage: data.limitImage,
          imageIds: imageIds
        }

        console.log(adverPayload)
        console.log(uploadedFile)

        console.log("Final AdverPkg Payload:", adverPayload)
        const result = await createUpdateAdvertisement(adverPayload)

        setIsLoading(false)

        if (result.isSuccess) {
          toast.success("Tạo quảng cáo thành công")
          reset()
          setSelectedImages([])
          setHideUploadButton(false)
          setHideSelectButton(false)
          setShowFileUpload(false)
        }
      } catch (error: any) {
        setIsLoading(false)
        toast.error(error.message || "An unknown error occurred.")
      }
    },
    [selectedImages, uploadedFile]
  )

  return (
    <div className="relative flex w-full flex-col">
      <div className="max-w-[500px]">
        <h2 className="mb-4 text-2xl font-semibold">Tạo gói quảng cáo</h2>
        <div className="flex items-center justify-start gap-5">
          <CustomButton
            icon={<IconUpload size={25} />}
            label="Tải ảnh lên"
            onClick={handleFileUploadClick}
          />
          <p>Hoặc</p>

          <CustomButton
            icon={<MdAddPhotoAlternate size={25} />}
            label="Chọn từ thư viện"
            onClick={handleSelectImageClick}
          />
        </div>
        {showFileUpload && <FileUpload onChange={handleFileChange} />}

        {selectedImages.length > 0 && (
          <div className="my-5 grid grid-cols-3 gap-4">
            {selectedImages.map((image, index) => (
              <div key={image.id} className="relative h-32 w-full">
                <img
                  src={image.imageUrl}
                  alt="Selected"
                  className="h-full w-full rounded object-cover"
                />
                <button
                  onClick={() => {
                    console.log(selectedImages)
                    // Remove the image from the array
                    setSelectedImages((prevImages) =>
                      prevImages.filter((_, i) => i !== index)
                    )
                  }}
                  className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-5">
          <Input
            id="name"
            placeholder=""
            onChange={() => {}}
            label="Tên gói"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="price"
            placeholder=""
            type="number"
            formatPrice
            onChange={() => {}}
            label="Giá"
            validate
            control={control}
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <form className="mb-0 w-full">
            <div className="mb-4 rounded-lg rounded-t-lg border-2 border-neutral-300 bg-white px-4 py-2">
              <label htmlFor="title" className="sr-only">
                Miêu tả
              </label>
              <textarea
                id="title"
                //rows="6"
                className="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0"
                placeholder="Miêu tả ..."
                required
                {...register("description", { required: true })}
              ></textarea>
              {errors.description && (
                <span className="text-red-500">Miêu tả là bắt buộc</span>
              )}
            </div>
          </form>
          <Input
            id="limitAd"
            type="number"
            placeholder=""
            onChange={() => {}}
            label="Giới hạn quảng cáo"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="limitContent"
            type="number"
            placeholder=""
            onChange={() => {}}
            label="Giới hạn nội dung"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="limitImage"
            type="number"
            placeholder=""
            onChange={() => {}}
            label="Giới hạn hình ảnh"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
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
      </div>
      <ImgChoosingModal onSelectImages={handleSelectImages} />
    </div>
  )
}
