import { useEffect, useState } from "react"

import BlogModal from "@/pages/Blog/components/BlogModal"
import toast from "react-hot-toast"
import { IoIosArrowDroprightCircle } from "react-icons/io"
import { IoIosArrowDropleftCircle } from "react-icons/io"
import { ClipLoader } from "react-spinners"

import useProfileImgModal from "@/hooks/useProfileImgModal"

import { getImagesForMember } from "@/lib/api/Image"

import CustomButton from "./CustomBtn"

interface Image {
  id: number
  imageUrl: string
}

interface ProfileImgChoosingModalProps {
  onSelectImage: (selectedImage: Image) => void
}

const ProfileImgChoosingModal: React.FC<ProfileImgChoosingModalProps> = ({
  onSelectImage
}) => {
  const [images, setImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const profileImgModal = useProfileImgModal()

  useEffect(() => {
    console.log("ImgChoosingModal open status:", profileImgModal.isOpen)
    if (profileImgModal.isOpen) {
      const fetchImages = async () => {
        try {
          setIsLoading(true)
          console.log("Fetching images...")
          const requestData = {
            pageIndex: pageIndex,
            pageSize: 6,
            name: "",
            orderDate: null
          }
          const response = await getImagesForMember(requestData)
          console.log("Images fetched:", response.result.datas)
          if (response.result && Array.isArray(response.result.datas)) {
            const mappedImages = response.result.datas.map((image) => ({
              id: image.id,
              imageUrl: image.filePath
            }))
            setImages(mappedImages)
            setTotalPages(response.result.totalPages); 
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
  }, [profileImgModal.isOpen, pageIndex])

  // Handle image selection
  const handleImageSelection = (image: Image) => {
    setSelectedImage(image)
  }

  const handleSave = () => {
    if (selectedImage) {
      onSelectImage(selectedImage)
      profileImgModal.onClose()
    } else {
      toast.error("Vui lòng chọn 1 ảnh.")
    }
  }

  const handleNextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex((prev) => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex((prev) => prev - 1)
    }
  }

  if (!profileImgModal.isOpen) return null

  const bodyContent =
    images.length > 0 ? (
      <div className="grid cursor-pointer grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={`border p-2 ${
              selectedImage?.id === image.id
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => handleImageSelection(image)}
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
      <p>Hiện tại chưa có ảnh nào trong thư viện của bạn </p>
    )

  const paginationControls = (
    <div className="mt-4 flex justify-between">
      <CustomButton
        icon={<IoIosArrowDropleftCircle />}
        label="Trang trước"
        onClick={handlePreviousPage}
        disabled={pageIndex === 1 || isLoading}
      />
      <span className="inline-flex items-center px-4">{`Trang ${pageIndex} trên ${totalPages}`}</span>
      <CustomButton
        icon={<IoIosArrowDroprightCircle />}
        label="Trang sau"
        onClick={handleNextPage}
        disabled={pageIndex === totalPages || isLoading}
      />
    </div>
  )

  return (
    <BlogModal
      disabled={isLoading}
      isOpen={profileImgModal.isOpen}
      title="Chọn ảnh"
      actionLabel={isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Lưu"}
      onClose={profileImgModal.onClose}
      onSubmit={handleSave}
      body={
        <>
          {bodyContent}
          {paginationControls}
        </>
      }
      currentUser
    />
  )
}

export default ProfileImgChoosingModal
