import React, { useCallback, useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import {
  IconAlertTriangleFilled,
  IconSquareRoundedPlusFilled,
  IconTrash,
  IconUpload
} from "@tabler/icons-react"
import toast from "react-hot-toast"
import { MdAddPhotoAlternate } from "react-icons/md"
import { useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import useConfirmModal from "@/hooks/useConfirmModal"

import {
  deleteImagesFromAdvertisementPackage,
  getAdvertisementPackageById
} from "@/lib/api/AdvertisementPkg"

import ConfirmModal from "../components/ConfirmModal"

interface DeleteAdverFormData {
  advertisementPackageId: number
  imageIds: number[]
}

interface Image {
  id: number
  imageUrl: string
}

export const DeleteAdverImg: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const confirmModal = useConfirmModal()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedImagesToDelete, setSelectedImagesToDelete] = useState<
    number[]
  >([])
  const [adverPkg, setAdverPkg] = useState<any>(null)
  const [hideSelectButton, setHideSelectButton] = useState<boolean>(false)

  useEffect(() => {
    window.scrollTo(0, 0)
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

  const handleImageSelection = (imageId: number) => {
    setSelectedImagesToDelete((prevSelected) => {
      if (prevSelected.includes(imageId)) {
        return prevSelected.filter((id) => id !== imageId)
      }
      return [...prevSelected, imageId]
    })
  }

  const handleDeleteImages = async () => {
    try {
      setIsLoading(true)
      const result = await deleteImagesFromAdvertisementPackage({
        advertisementId: Number(id),
        adImageIds: selectedImagesToDelete
      })
      console.log(result)

      if (result.isSuccess) {
        toast.success("Images deleted successfully!")
        setAdverPkg((prevPkg: any) => ({
          ...prevPkg,
          imageViewDTOs: prevPkg.imageViewDTOs.filter(
            (img: any) => !selectedImagesToDelete.includes(img.id)
          )
        }))
        setSelectedImagesToDelete([])
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message || "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = () => {
    confirmModal.onOpen()
  }

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

        <div className="flex items-center justify-start gap-5">
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
      </div>
    </div>
  )
}
