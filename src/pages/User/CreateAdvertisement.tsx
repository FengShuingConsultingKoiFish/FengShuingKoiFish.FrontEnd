import React, { useCallback, useEffect, useState } from "react"

import ImgChoosingModal from "@/pages/Blog/components/ImgChoosingModal"
import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { yupResolver } from "@hookform/resolvers/yup"
import { IconSquareRoundedPlusFilled, IconUpload } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { MdAddPhotoAlternate } from "react-icons/md"
import { ClipLoader } from "react-spinners"
import useImgChoosingModal from "@/hooks/useChooseImgModal"
import { uploadImage } from "@/lib/api/Image"

import { AuroraBackground } from "@/components/ui/AuroraBg"
import { FileUpload } from "@/components/ui/FileUpload"
import Input from "@/components/ui/Input"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { createUpdateAdvertisement } from "@/lib/api/Advertisement"

interface UserCreateAdverFormData {
  purchasedPackageId: number
  title: string
  description: string
  price: number
  imageIds: number[]
}

interface Image {
  id: number
  imageUrl: string
}

export const UserCreateAdver: React.FC = () => {
  const imgChoosingModal = useImgChoosingModal()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedImages, setSelectedImages] = useState<Image[]>([])

  const currentPakage = useSelector((state: RootState) => state.userPackages.packageDetail);

  useEffect(() => {
    window.scrollTo(0, 0)
  })

  const handleSelectImages = (images: Image[]) => {
    setSelectedImages(images)
  }

  const handleFileUploadClick = () => {
    setShowFileUpload(true)
    setUploadedFile(null)
    
  }

  const handleFileChange = (files: File[]) => {
    console.log("Selected file:", files[0])
    setUploadedFile(files[0])
  }

  const handleSelectImageClick = () => {
    setShowFileUpload(false)
    setUploadedFile(null)
    imgChoosingModal.onOpen()
    
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
  } = useForm<UserCreateAdverFormData>({
    //resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      imageIds: []
    }
  })

  const onSubmit: SubmitHandler<UserCreateAdverFormData> = useCallback(
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
        const UserCreateAdverPayload = {
          purchasedPackageId: currentPakage?.id || 0,
          title: data.title,
          description: data.description,
          price: data.price,
          imageIds: imageIds
        }

        console.log(UserCreateAdverPayload)

        console.log(uploadedFile)

        console.log("Final AdverPkg Payload:", UserCreateAdverPayload)
        const result = await createUpdateAdvertisement(UserCreateAdverPayload);

        setIsLoading(false)

        if (result.isSuccess) {
          toast.success(result.result.message || "Tạo quảng cáo thành công");
          reset();
          setSelectedImages([]);
          setShowFileUpload(false);
        } else {
          toast.error(result.message || "Đã xảy ra lỗi.");
        }
      } catch (error: any) {
        setIsLoading(false);
        const errorMessage =
          error?.response?.data?.result?.message ||
          error.message ||
          "An unknown error occurred.";
        toast.error(errorMessage);
      }
    },
    [selectedImages, uploadedFile]
  );

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="relative flex w-full max-w-[1000px] flex-col items-center justify-start gap-4 px-4 py-10"
      >
        <div className="w-full">
          <h2 className="mb-4 text-2xl font-semibold">Bạn đang thực hiện tạo quảng cáo theo gói : {currentPakage?.name}</h2>
          <h2 className="mb-4 text-sm font-semibold"> Số lượng quảng cáo còn lại : {currentPakage?.limitAd}</h2>
          <h2 className="mb-4 text-sm font-semibold"> Số lượng nội dung còn lại : {currentPakage?.limitContent}</h2>
          <h2 className="mb-4 text-sm font-semibold"> Số lượng ảnh còn lại : {currentPakage?.limitImage}</h2>
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
              id="title"
              placeholder=""
              onChange={() => {}}
              label="Tiêu đề quảng cáo"
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
                  placeholder="Miêu tả..."
                  required
                  {...register("description", { required: true })}
                ></textarea>
                {errors.description && (
                  <span className="text-red-500">Miêu tả là bắt buộc</span>
                )}
              </div>
            </form>
          </div>
          <CustomButton
            icon={
              isLoading ? (
                <ClipLoader size={20} color={"#fff"} />
              ) : (
                <IconSquareRoundedPlusFilled />
              )
            }
            label={isLoading ? "" : "Tạo quảng cáo"}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
        </div>
        <ImgChoosingModal onSelectImages={handleSelectImages} />
      </motion.div>
    </AuroraBackground>
  )
}
