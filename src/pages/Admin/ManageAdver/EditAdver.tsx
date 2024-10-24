import React, { useCallback, useEffect, useState } from "react"

import ImgChoosingModal from "@/pages/Blog/components/ImgChoosingModal"
import CustomButton from "@/pages/Setting/Components/CustomBtn"
import {
  IconAlertTriangleFilled,
  IconDeviceFloppy,
  IconTrash,
  IconUpload
} from "@tabler/icons-react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { MdAddPhotoAlternate } from "react-icons/md"
import { useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import useImgChoosingModal from "@/hooks/useChooseImgModal"
import useConfirmModal from "@/hooks/useConfirmModal"

import {
  addImagesToAdvertisementPackage,
  createUpdateAdvertisement,
  deleteImagesFromAdvertisementPackage,
  getAdvertisementPackageById
} from "@/lib/api/AdvertisementPkg"
import { uploadImage } from "@/lib/api/Image"

import { FileUpload } from "@/components/ui/FileUpload"
import Input from "@/components/ui/Input"

import ConfirmModal from "../components/ConfirmModal"

interface EditAdverFormData {
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  advertisementPackageId: number
  imageIds: number[]
}

interface Image {
  id: number
  imageUrl: string
}

export const EditAdver: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const imgChoosingModal = useImgChoosingModal()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [adverPkg, setAdverPkg] = useState<any>(null)
  const [hideUploadButton, setHideUploadButton] = useState<boolean>(false)
  const [hideSelectButton, setHideSelectButton] = useState<boolean>(false)
  const [newImages, setNewImages] = useState<Image[]>([])
  const [selectedImagesToDelete, setSelectedImagesToDelete] = useState<
    number[]
  >([])
  const confirmModal = useConfirmModal()

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchAdverPkg()
  }, [id])

  const fetchAdverPkg = async () => {
    try {
      setIsLoading(true)
      const response = await getAdvertisementPackageById(Number(id))
      if (response.isSuccess) {
        setAdverPkg(response.result)
        reset({
          name: response.result.name,
          price: response.result.price,
          description: response.result.description,
          limitAd: response.result.limitAd,
          limitContent: response.result.limitContent,
          limitImage: response.result.limitImage,
          advertisementPackageId: Number(id),
          imageIds: response.result.imageViewDTOs.map((image: any) => image.id)
        })
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("Failed to load advertisement package data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectImages = (images: Image[]) => {
    setNewImages((prevImages) => [...prevImages, ...images])
  }
  const handleFileUploadClick = () => {
    setShowFileUpload(true)
    setHideSelectButton(true)
  }

  const handleFileChange = async (files: File[]) => {
    const newFile = files[0]
    console.log("Selected file:", newFile)

    try {
      const uploadedImageId = await handleFileUpload(newFile)
      const newImage: Image = {
        id: uploadedImageId,
        imageUrl: URL.createObjectURL(newFile)
      }

      setNewImages((prevImages) => [...prevImages, newImage])

      setUploadedFile(newFile)
    } catch (error) {
      toast.error("Failed to upload image")
    }
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

  const handleImageSelection = (imageId: number) => {
    setSelectedImagesToDelete((prevSelected) => {
      if (prevSelected.includes(imageId)) {
        return prevSelected.filter((id) => id !== imageId)
      }
      return [...prevSelected, imageId]
    })
  }
  const handleConfirmDelete = () => {
    confirmModal.onOpen()
  }

  //Xoa anh
  const handleDeleteImages = async () => {
    try {
      if (selectedImagesToDelete.length === 0) {
        toast.error("No images selected for deletion")
        return
      }

      console.log("Images to delete: ", selectedImagesToDelete)

      setIsLoading(true)
      const result = await deleteImagesFromAdvertisementPackage({
        advertisementPackageId: Number(id),
        imageIds: selectedImagesToDelete
      })
      console.log(result)

      if (result.isSuccess) {
        toast.success("Xóa hình ảnh thành công !")
        setAdverPkg((prevPkg: any) => ({
          ...prevPkg,
          imageViewDTOs: prevPkg.imageViewDTOs.filter(
            (img: any) => !selectedImagesToDelete.includes(img.id)
          )
        }))
        setSelectedImagesToDelete([])
        confirmModal.onClose()
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message || "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<EditAdverFormData>({
    //resolver: yupResolver(schema),
    defaultValues: {
      name: adverPkg?.name,
      price: adverPkg?.price,
      description: adverPkg?.description,
      limitAd: adverPkg?.limitAd,
      limitContent: adverPkg?.limitContent,
      limitImage: adverPkg?.limitImage,
      advertisementPackageId: Number(id),
      imageIds: []
    }
  })

  const onSubmit: SubmitHandler<EditAdverFormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true)

        let imageIds: number[] = adverPkg.imageViewDTOs.map(
          (image: any) => image.id
        )

        if (uploadedFile) {
          const uploadedImageId = await handleFileUpload(uploadedFile)
          console.log("Uploaded image ID:", uploadedImageId)
          imageIds.push(uploadedImageId)
        }

        if (newImages.length > 0) {
          const newImageIds = newImages.map((image) => image.id)
          const addImagesPayload = {
            advertisementPackageId: Number(id),
            imagesId: newImageIds
          }
          console.log("Adding new images:", addImagesPayload)
          const addImagesResult =
            await addImagesToAdvertisementPackage(addImagesPayload)

          if (!addImagesResult.isSuccess) {
            throw new Error(addImagesResult.message)
          }
          imageIds.push(...newImageIds)
        }

        const updateDetailsPayload = {
          id: adverPkg?.id ?? 0,
          name: data.name,
          price: data.price,
          description: data.description,
          limitAd: data.limitAd,
          limitContent: data.limitContent,
          limitImage: data.limitImage,
          imageIds,
          advertisementPackageId: Number(id)
        }
        console.log("Payload for updating advertisement:", updateDetailsPayload)
        const updateDetailsResult =
          await createUpdateAdvertisement(updateDetailsPayload)

        if (!updateDetailsResult.isSuccess) {
          throw new Error(updateDetailsResult.message)
        }
        toast.success("Cập nhật gói thành công !")
        reset()
        setNewImages([])
        fetchAdverPkg()
      } catch (error: any) {
        toast.error(error.message || "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    },
    [id, newImages, uploadedFile, adverPkg]
  )

  const bodyContent = (
    <div className="mt-4 flex flex-col justify-start">
      <div className="inline-flex items-center justify-center gap-4 overflow-y-auto">
        <IconAlertTriangleFilled size={40} />
        <p>Bạn có chắc chắn muốn xóa những hình ảnh này không?</p>
      </div>
    </div>
  )

  return (
    <div className="relative flex w-full flex-col">
      <div className="w-full">
        <h2 className="mb-4 text-2xl font-semibold">
          Chỉnh sửa thông tin gói{" "}
        </h2>
        {adverPkg ? (
          <div className="mb-4">
            <div className="">
              <div className="flex max-w-[500px] flex-col justify-start gap-5">
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
                  <p className="text-gray-600">Miêu tả</p>
                  <div className="rounded-lg rounded-t-lg border-2 border-neutral-300 bg-white px-4 py-2">
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
                  placeholder=""
                  type="number"
                  onChange={() => {}}
                  label="Giới hạn quảng cáo"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
                <Input
                  id="limitContent"
                  placeholder=""
                  type="number"
                  onChange={() => {}}
                  label="Giới hạn nội dung"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
                <Input
                  id="limitImage"
                  placeholder=""
                  type="number"
                  onChange={() => {}}
                  label="Giới hạn hình ảnh"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
              </div>
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

              <h4 className="mt-4 text-2xl font-semibold">
                Hình ảnh hiện tại của gói:
              </h4>
              {adverPkg.imageViewDTOs && adverPkg.imageViewDTOs.length > 0 ? (
                <div className="my-4 grid grid-cols-3 gap-4">
                  {adverPkg.imageViewDTOs.map((image: any) => (
                    <div key={image.id} className="relative h-80 w-full">
                      <img
                        src={image.filePath}
                        alt="Advertisement"
                        className="h-full w-full rounded object-cover"
                      />
                      <input
                        type="checkbox"
                        onChange={() => handleImageSelection(image.id)}
                        checked={selectedImagesToDelete.includes(image.id)}
                        className="absolute right-2 top-2 h-4 w-4"
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
      </div>
      <h4 className="mt-4 text-2xl font-semibold">Ảnh bạn muốn thêm mới:</h4>
      {newImages.length > 0 ? (
        <div className="my-5 grid grid-cols-3 gap-4">
          {newImages.map((image, index) => (
            <div key={image.id} className="relative h-80 w-full">
              <img
                src={image.imageUrl}
                alt="Selected"
                className="h-full w-full rounded object-cover"
              />
              <button
                onClick={() => handleRemoveNewImage(index)}
                className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Chưa có hình ảnh mới nào được chọn</p>
      )}
      <div className="flex items-center justify-center gap-5">
        {selectedImagesToDelete.length > 0 && (
          <CustomButton
            icon={<IconTrash />}
            label="Xóa ảnh đã chọn"
            onClick={handleConfirmDelete}
            disabled={isLoading}
          />
        )}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title="Xóa hình ảnh"
          actionLabel={
            isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Xóa"
          }
          onClose={confirmModal.onClose}
          onSubmit={handleDeleteImages}
          body={bodyContent}
        />
      </div>
      <div className="flex justify-center">
        <CustomButton
          icon={
            isLoading ? (
              <ClipLoader size={20} color={"#fff"} />
            ) : (
              <IconDeviceFloppy />
            )
          }
          label={isLoading ? "" : "Lưu chỉnh sửa"}
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </div>
      <ImgChoosingModal onSelectImages={handleSelectImages} />
    </div>
  )
}
