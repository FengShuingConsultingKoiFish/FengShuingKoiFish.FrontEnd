import React, { useCallback, useEffect, useState } from "react"

import ImgChoosingModal from "@/pages/Blog/components/ImgChoosingModal"
import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { IconSquareRoundedPlusFilled, IconUpload } from "@tabler/icons-react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { MdAddPhotoAlternate } from "react-icons/md"
import { useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import useImgChoosingModal from "@/hooks/useChooseImgModal"

import {
  addImagesToAdvertisementPackage,
  getAdvertisementPackageById
} from "@/lib/api/AdvertisementPkg"
import { uploadImage } from "@/lib/api/Image"

import { FileUpload } from "@/components/ui/FileUpload"

interface AddAdverFormData {
  advertisementPackageId: number
  imageIds: number[]
}

interface Image {
  id: number
  imageUrl: string
}

export const AddAdverImg: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const imgChoosingModal = useImgChoosingModal()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [adverPkg, setAdverPkg] = useState<any>(null)
  const [hideUploadButton, setHideUploadButton] = useState<boolean>(false)
  const [hideSelectButton, setHideSelectButton] = useState<boolean>(false)

  useEffect(() => {
    window.scrollTo(0,0)
    const fetchAdverPkg = async () => {
      try {
        setIsLoading(true)
        const response = await getAdvertisementPackageById(Number(id))
        console.log(response)
        if (response.isSuccess) {
          setAdverPkg(response.result)
        } else {
          toast.error(response.message)
        }
      } catch (error) {
        console.error("Error fetching adverPkg:", error)
        toast.error("Failed to load advertisement package data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdverPkg()
  }, [id])

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
  } = useForm<AddAdverFormData>({
    //resolver: yupResolver(schema),
    defaultValues: {
      advertisementPackageId: Number(id),
      imageIds: []
    }
  })

  const onSubmit: SubmitHandler<AddAdverFormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true)

        let imageIds = selectedImages.map((image) => image.id)

        if (uploadedFile) {
          const uploadedImageId = await handleFileUpload(uploadedFile)
          console.log("New image ID to be added:", uploadedImageId)
          imageIds.push(uploadedImageId)
        }
        const adverPayload = {
          advertisementPackageId: Number(id),
          imagesId: imageIds
        }

        console.log("Final AdverPkg Payload:", adverPayload)
        const result = await addImagesToAdvertisementPackage(adverPayload)

        setIsLoading(false)

        if (result.isSuccess) {
          toast.success(
            "Thêm ảnh vào gói thành công !"
          )

          const newImages = selectedImages.map((img) => ({
            id: img.id,
            filePath: img.imageUrl, 
          }));

          setAdverPkg((prevPkg: any) => ({
            ...prevPkg,
            imageViewDTOs: [...prevPkg.imageViewDTOs, ...newImages], 
          }));
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
    [selectedImages, uploadedFile, id]
  )
  return (
    <div className="relative flex w-full flex-col">
      <div className="w-full">
        <h2 className="mb-4 text-2xl font-semibold">Thêm ảnh </h2>
        {adverPkg ? (
          <div className="mb-4">
            <p className="inline-flex items-center justify-start gap-2">
              <strong>Tên gói:</strong> {adverPkg.name}
            </p>
            <p>
              <strong>Giá:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
              }).format(adverPkg.price)}
            </p>
            <div className="flex flex-col">
              <p className="inline-flex items-center justify-start gap-2">
                <strong>Mô tả:</strong>
                <p> {adverPkg.description}</p>
              </p>
              <p className="inline-flex items-center justify-start gap-2">
                <strong>Hạn mức quảng cáo:</strong>
                <p>{adverPkg.limitAd}</p>
              </p>
              <p className="inline-flex items-center justify-start gap-2">
                <strong>Hạn mức nội dung:</strong>
                <p>{adverPkg.limitContent}</p>
              </p>
              <p className="inline-flex items-center justify-start gap-2">
                <strong>Hạn mức hình ảnh:</strong>
                <p>{adverPkg.limitImage}</p>
              </p>
              <h4 className="mt-4">Hình ảnh hiện tại của gói:</h4>
              {adverPkg.imageViewDTOs && adverPkg.imageViewDTOs.length > 0 ? (
                <div className="my-4 grid grid-cols-3 gap-4">
                  {adverPkg.imageViewDTOs.map((image: any) => (
                    <div key={image.id} className="relative h-full w-full">
                      <img
                        src={image.filePath}
                        alt="Advertisement"
                        className="h-full w-full rounded object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>Không có hình ảnh nào</p>
              )}
            </div>
          </div>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : (
          <p>Không tìm thấy gói quảng cáo</p>
        )}

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
              <div key={image.id} className="relative h-full w-full">
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
        <CustomButton
          icon={
            isLoading ? (
              <ClipLoader size={20} color={"#fff"} />
            ) : (
              <IconSquareRoundedPlusFilled />
            )
          }
          label={isLoading ? "" : "Thêm ảnh"}
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </div>
      <ImgChoosingModal onSelectImages={handleSelectImages} />
    </div>
  )
}
