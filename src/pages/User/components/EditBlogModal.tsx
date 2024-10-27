import { useCallback, useEffect, useState } from "react"

import ConfirmModal from "@/pages/Admin/components/ConfirmModal"
import BlogModal from "@/pages/Blog/components/BlogModal"
import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { MdAddPhotoAlternate } from "react-icons/md"
import { useSelector } from "react-redux"
import { ClipLoader } from "react-spinners"

import useConfirmModal from "@/hooks/useConfirmModal"
import useEditBlogModal from "@/hooks/useEditBlogModal"
import useEditImgChoosingModal from "@/hooks/useEditImgChoosingModal"

import { addImagesToBlog, createUpdateBlog } from "@/lib/api/Blog"
import { deleteImagesFromBlog } from "@/lib/api/Blog"
import { uploadImage } from "@/lib/api/Image"
import { RootState } from "@/lib/redux/store"

import Avatar from "@/components/layout/header/Avatar"
import { FileUpload } from "@/components/ui/FileUpload"

import EditImgChoosingModal from "./EditImgChoosingModal"

interface EditBlogFormData {
  imageViewDtos: any
  id: number
  title: string
  content: string
  imageIds?: number[]
}

interface Image {
  id: number
  imageUrl: string
}

const EditBlogModal = ({ onSuccess }: { onSuccess: () => void }) => {
  const editImgChoosingModal = useEditImgChoosingModal()
  const detailBlog = useSelector(
    (state: RootState) => state.userBlogs.detailBlog
  )
  const editBlogModal = useEditBlogModal()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const currentUser = useSelector((state: RootState) => state.users.currentUser)
  const userProfile = useSelector((state: RootState) => state.users.detailUser)
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [, setNewlySelectedImages] = useState<Image[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const defaultAvatar =
    "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"

  const [selectedImagesToDelete, setSelectedImagesToDelete] = useState<
    number[]
  >([])
  const [existingImages, setExistingImages] = useState<Image[]>([])
  const confirmModal = useConfirmModal()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditBlogFormData>({
    defaultValues: {
      title: "",
      content: "",
      imageIds: []
    }
  })

  useEffect(() => {
    if (detailBlog) {
      const blogImages = detailBlog.imageViewDtos.map((image) => ({
        id: image.id,
        imageUrl: image.filePath
      }))

      setExistingImages(blogImages)
      setSelectedImages(blogImages)
      reset({
        title: detailBlog.title,
        content: detailBlog.content,
        imageIds: blogImages.map((image) => image.id)
      })
    }
  }, [detailBlog, reset])

  const handleRemoveNewImage = (imageId: number) => {
    setNewlySelectedImages((prevNewImages) =>
      prevNewImages.filter((img) => img.id !== imageId)
    )
    setSelectedImages((prevImages) =>
      prevImages.filter((img) => img.id !== imageId)
    )
  }

  const handleSelectImages = (newImages: Image[]) => {
    console.log("Selected images:", newImages)
    const uniqueImages = [
      ...selectedImages,
      ...newImages.filter(
        (newImage) => !selectedImages.some((img) => img.id === newImage.id)
      )
    ]

    setNewlySelectedImages(newImages)
    setSelectedImages(uniqueImages)
  }

  const handleFileUploadClick = () => {
    setShowFileUpload(true)
    setUploadedFile(null)
  }

  const handleSelectImageClick = () => {
    setShowFileUpload(false)
    setUploadedFile(null)
    editImgChoosingModal.onOpen()
  }

  const handleFileChange = (files: File[]) => {
    console.log("Selected file:", files[0])
    setUploadedFile(files[0])
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

  const bodyConfirm = (
    <div className="mt-4 flex flex-col justify-start">
      <div className="inline-flex items-center justify-center gap-4 overflow-y-auto">
        <IconAlertTriangleFilled size={40} />
        <p>Bạn có chắc chắn muốn xóa những hình ảnh này không?</p>
      </div>
    </div>
  )

  //xoa anh
  const handleDeleteImages = async () => {
    try {
      if (selectedImagesToDelete.length === 0) {
        toast.error("No images selected for deletion")
        return
      }

      console.log("Images to delete: ", selectedImagesToDelete)

      setIsLoading(true)

      const deletePayload = {
        blogId: detailBlog?.id,
        imageIds: selectedImagesToDelete
      }
      console.log(deletePayload)
      const result = await deleteImagesFromBlog(deletePayload)
      console.log(result)

      if (result.isSuccess) {
        toast.success("Xóa hình ảnh thành công !")
        setSelectedImages((prevImages) =>
          prevImages.filter((img) => !selectedImagesToDelete.includes(img.id))
        )
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

  const onSubmit: SubmitHandler<EditBlogFormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
  
        const blogPayload = {
          id: detailBlog?.id ?? 0,
          title: data.title,
          content: data.content,
          imageIds: selectedImages.map((image) => image.id),
        };
  
        console.log("Update Blog Payload:", blogPayload);
        const updateResult = await createUpdateBlog(blogPayload);
  
        if (updateResult.isSuccess) {
          toast.success("Cập nhật blog thành công");
        } else {
          toast.error(updateResult.message || "Failed to update the blog.");
          setIsLoading(false);
          return;
        }
  
        const newImageIds = selectedImages
          .map((image) => image.id)
          .filter((imageId) => !existingImages.some((img) => img.id === imageId)); 
  
        if (newImageIds.length > 0 || uploadedFile) {
          let uploadedImageId = null;
  
          if (uploadedFile) {
            uploadedImageId = await handleFileUpload(uploadedFile);
            newImageIds.push(uploadedImageId);
          }
  
          const addImagesPayload = {
            blogId: detailBlog?.id,
            imagesId: newImageIds,
          };
  
          console.log("Add Images Payload:", addImagesPayload);
          const addImagesResponse = await addImagesToBlog(addImagesPayload);
  
          if (addImagesResponse.isSuccess) {
            toast.success("Đã thêm ảnh thành công!");
          } else {
            toast.error(addImagesResponse.message || "Failed to add images.");
          }
        }
  
        setIsLoading(false);
        reset(); 
        setSelectedImages([]); 
        setShowFileUpload(false);
        editBlogModal.onClose(); 
        onSuccess();
  
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message || "An unknown error occurred.");
      }
    },
    [selectedImages, uploadedFile, detailBlog, reset, editBlogModal]
  );

  const bodyContent = (
    <div className="mt-4 flex flex-col justify-start">
      <div className="overflow-y-auto">
        <div className="mb-3 flex flex-row items-center">
          <Avatar
            userImg={
              userProfile && userProfile.avatar
                ? userProfile.avatar
                : defaultAvatar
            }
            w="40px"
            h="40px"
          />
          <div className="ml-3">
            <p className="text-xl font-semibold">
              {userProfile?.fullName || ""}
            </p>
            <button className="rounded-md bg-gray-200 px-2 py-1 text-sm text-gray-700">
              Mọi người
            </button>
          </div>
        </div>
        {selectedImages.length > 0 && (
          <div className="mb-4 grid w-full grid-cols-4 gap-2">
            {selectedImages.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.imageUrl}
                  alt="selected"
                  className="h-32 w-full object-cover"
                />
                {existingImages.some((img) => img.id === image.id) ? (
                  <input
                    type="checkbox"
                    onChange={() => handleImageSelection(image.id)}
                    checked={selectedImagesToDelete.includes(image.id)}
                    className="absolute right-2 top-2 h-4 w-4"
                  />
                ) : (
                  <button
                    onClick={() => handleRemoveNewImage(image.id)}
                    className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-xs text-white"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <form className="mb-0 max-w-3xl">
          <div className="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white px-4 py-2">
            <label htmlFor="title" className="sr-only">
              Tiêu đề
            </label>
            <textarea
              id="title"
              className="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0"
              placeholder="Tiêu đề ..."
              required
              {...register("title", { required: true })}
            ></textarea>
            {errors.title && (
              <span className="text-red-500">Tiêu đề là bắt buộc</span>
            )}
          </div>
        </form>

        <form className="mb-0 max-w-3xl">
          <div className="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white px-4 py-2">
            <label htmlFor="content" className="sr-only">
              Nội dung
            </label>
            <textarea
              id="content"
              className="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0"
              placeholder="Bạn đang nghĩ gì ?..."
              required
              {...register("content", { required: true })}
            ></textarea>
            {errors.content && (
              <span className="text-red-500">Nội dung là bắt buộc</span>
            )}
          </div>
        </form>
        <div className="flex max-h-12 flex-row items-center gap-5">
          <CustomButton
            icon={<MdAddPhotoAlternate size={25} />}
            label="Tải ảnh lên"
            onClick={handleFileUploadClick}
          />

          <>
            <p>hoặc</p>
            <CustomButton
              icon={<MdAddPhotoAlternate size={25} />}
              label="Chọn ảnh từ thư viện của bạn"
              onClick={handleSelectImageClick}
            />
          </>
        </div>
        {showFileUpload && <FileUpload onChange={handleFileChange} />}
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
            body={bodyConfirm}
          />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <BlogModal
        disabled={isLoading || selectedImagesToDelete.length > 0} 
        isOpen={editBlogModal.isOpen}
        title="Chỉnh sửa bài"
        actionLabel={isLoading ? "Loading..." : "Cập nhật"}
        onClose={editBlogModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        currentUser={currentUser}
      />

      <EditImgChoosingModal onSelectImages={handleSelectImages} />
    </>
  )
}

export default EditBlogModal
