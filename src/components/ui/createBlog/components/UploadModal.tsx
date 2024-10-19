import React, { useCallback, useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"

import { getImagesForMember } from "@/lib/api/Image"

interface Image {
  id: number
  imageUrl: string
  thumbnailUrl: string
}

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectImages: (selectedImages: Image[]) => void
  onSubmit: () => void
  disabled?: boolean
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSelectImages,
  disabled
}) => {
  const [images, setImages] = useState<Image[]>([])
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [showModal, setShowModal] = useState(isOpen)

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  const handleClose = useCallback(() => {
    if (disabled) {
      return
    }

    setShowModal(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }, [disabled, onClose])


  if (!isOpen) {
    return null
  }
  
  useEffect(() => {
    if (isOpen) {
      const fetchImages = async () => {
        try {
          const requestData = {
            pageIndex: 1,
            pageSize: 10,
            name: "",
            orderDate: 1
          }
          const response = await getImagesForMember(requestData)
          setImages(response.result.images)
        } catch (error) {
          console.error("Error fetching images", error)
        }
      }

      fetchImages()
    }
  }, [isOpen])

  const toggleImageSelection = (image: Image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id))
    } else {
      setSelectedImages([...selectedImages, image])
    }
  }

  const handleOk = () => {
    onSelectImages(selectedImages)
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="h-[70%] w-[80%] overflow-auto rounded-lg bg-white p-5">
            <h2 className="mb-4 text-xl font-bold">Select Images</h2>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`border p-2 ${selectedImages.includes(image) ? "border-blue-500" : "border-gray-300"}`}
                  onClick={() => toggleImageSelection(image)}
                >
                  <img
                    src={image.thumbnailUrl}
                    alt="thumbnail"
                    className="h-32 w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <CustomButton label="Cancel" onClick={onClose} />
              <CustomButton label="OK" onClick={handleOk} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UploadModal
