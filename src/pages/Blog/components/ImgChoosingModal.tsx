import { useEffect, useState } from "react"

import { ClipLoader } from "react-spinners"

import useImgChoosingModal from "@/hooks/useChooseImgModal"

import { getImagesForMember } from "@/lib/api/Image"

import BlogModal from "./BlogModal"

interface Image {
  id: number
  imageUrl: string
}

interface ImgChoosingModalProps {
  onSelectImages: (selectedImages: Image[]) => void
}

const ImgChoosingModal: React.FC<ImgChoosingModalProps> = ({
  onSelectImages
}) => {
  const [images, setImages] = useState<Image[]>([])
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const imgChoosingModal = useImgChoosingModal()


  useEffect(() => {
    console.log("ImgChoosingModal open status:", imgChoosingModal.isOpen)
    if (imgChoosingModal.isOpen) {
      const fetchImages = async () => {
        try {
          console.log("Fetching images...")
          const requestData = {
            pageIndex: 1,
            pageSize: 10,
            name: "",
            orderDate: null
          }
          console.log(requestData)
          const response = await getImagesForMember(requestData)
          console.log("Images fetched:", response.result.datas)
          if (response.result && Array.isArray(response.result.datas)) {
            // Map the response to match the Image type with imageUrl
            const mappedImages = response.result.datas.map((image) => ({
              id: image.id,
              imageUrl: image.filePath // Use filePath as imageUrl
            }))
            setImages(mappedImages)
          } else {
            console.error("Error: No images found.")
          }
        } catch (error) {
          console.error("Error fetching images:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchImages()
    }
  }, [imgChoosingModal.isOpen])
  // Handle image selection
  const toggleImageSelection = (image: Image) => {
    if (selectedImages.some((img) => img.id === image.id)) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id))
    } else {
      setSelectedImages([...selectedImages, image])
    }
  }

  const handleSave = () => {
    onSelectImages(selectedImages)
    imgChoosingModal.onClose()
  }

  if (!imgChoosingModal.isOpen) return null

  const bodyContent =
    images.length > 0 ? (
      <div className="grid grid-cols-3 gap-4 cursor-pointer">
        {images.map((image) => (
          <div
            key={image.id}
            className={`border p-2 ${
              selectedImages.some((img) => img.id === image.id)
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              toggleImageSelection(image)
            }}
          >
            <img
              src={image.imageUrl}
              alt="selected"
              className="h-32 w-full object-cover"
            />
          </div>
        ))}
      </div>
    ) : (
      <p>No images found or error fetching images.</p>
    )

  return (
    
      <BlogModal
        disabled={isLoading}
        isOpen={imgChoosingModal.isOpen}
        title="Chọn ảnh"
        actionLabel={
          isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Lưu"
        }
        onClose={imgChoosingModal.onClose}
        onSubmit={handleSave}
        body={bodyContent}
      />
    
  )
}

export default ImgChoosingModal
