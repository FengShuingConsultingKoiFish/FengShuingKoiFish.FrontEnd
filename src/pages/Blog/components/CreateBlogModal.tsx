import { useCallback, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { MdAddPhotoAlternate } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import * as yup from "yup"

import useBlogModal from "@/hooks/useBlogModel"
import useImgChoosingModal from "@/hooks/useChooseImgModal"

import { createUpdateBlog } from "@/lib/api/Blog"
import { AppDispatch, RootState } from "@/lib/redux/store"

import Avatar from "@/components/layout/header/Avatar"
import { FileUpload } from "@/components/ui/FileUpload"

import BlogModal from "./BlogModal"
import ImgChoosingModal from "./ImgChoosingModal"
import { uploadImage } from "@/lib/api/Image"

// Define the schema with yup
const schema = yup.object().shape({
  email: yup.string().required("Vui lòng nhập tên hoặc email của bạn"),
  password: yup.string().required("Mật khẩu là bắt buộc")
})

interface CreateBlogFormData {
  title: string
  content: string
  imageIds: number[]
}

interface Image {
  id: number
  imageUrl: string
}

const CreateBlogModal = () => {
  const imgChoosingModal = useImgChoosingModal()
  const blogModal = useBlogModal()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const defaultAvatar =
    "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const currentUser = useSelector((state: RootState) => state.users.currentUser);
  const userProfile = useSelector((state: RootState) => state.users.detailUser)
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<Image[]>([])
  const [hideUploadButton, setHideUploadButton] = useState<boolean>(false)
  const [hideSelectButton, setHideSelectButton] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateBlogFormData>({
    defaultValues: {
      title: "",
      content: "",
      imageIds: []
    }
    //resolver: yupResolver(schema)
  })
  const handleSelectImages = (images: Image[]) => {
    setSelectedImages(images)
  }

  const handleFileUploadClick = () => {
    setShowFileUpload(true)
    setHideSelectButton(true)
  }

  const handleSelectImageClick = () => {
    imgChoosingModal.onOpen()
    setHideUploadButton(true)
  }

  const handleFileChange = (files: File[]) => {
    console.log("Selected file:", files[0]);
    setUploadedFile(files[0]);
  };
  

  const handleFileUpload = async (file: File): Promise<number> => {
    try {
      console.log("Uploading file:", file); 
      const uploadedImageId = await uploadImage(file);
      console.log("Uploaded image ID:", uploadedImageId);
      return uploadedImageId;
    } catch (error) {
      toast.error("Failed to upload image");
      throw error;
    }
  };


  const onSubmit: SubmitHandler<CreateBlogFormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true)

        let imageIds = selectedImages.map((image) => image.id)

        if (uploadedFile) {
          const uploadedImageId = await handleFileUpload(uploadedFile)
          console.log("New image ID to be added:", uploadedImageId);
          imageIds.push(uploadedImageId)
        }

        // Prepare the payload for the API call
        const blogPayload = {
          id: 0, 
          title: data.title,
          content: data.content,
          imageIds: imageIds
        }

        console.log(blogPayload)
        console.log(uploadedFile)

        console.log("Final Blog Payload:", blogPayload);
        const result = await createUpdateBlog(blogPayload)

        setIsLoading(false)

        if (result.isSuccess) {
          toast.success("Tạo blog thành công")
          reset()
          setSelectedImages([]) 
          setHideUploadButton(false)
          setHideSelectButton(false) 
          setShowFileUpload(false) 
          blogModal.onClose() 
        
        }
      } catch (error: any) {
        setIsLoading(false)
        toast.error(error.message || "An unknown error occurred.")
      }
    },
    [selectedImages, uploadedFile]
  )

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
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedImages.map((image) => (
              <div key={image.id} className="w-1/4">
                <img
                  src={image.imageUrl}
                  alt="selected"
                  className="h-32 w-full object-cover"
                />
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
              //rows="6"
              className="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0"
              placeholder="Tiêu đề ..."
              required
              {...register("title", { required: true })}
            ></textarea>
            {errors.title&& (
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
              //rows="6"
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
          {!hideUploadButton && (
            <CustomButton
              icon={<MdAddPhotoAlternate size={25} />}
              label="Tải ảnh lên"
              onClick={handleFileUploadClick}
            />
          )}

          {!hideSelectButton && (
            <>
              <p>hoặc</p>
              <CustomButton
                icon={<MdAddPhotoAlternate size={25} />}
                label="Chọn ảnh từ thư viện của bạn"
                onClick={handleSelectImageClick}
              />
            </>
          )}
        </div>
        {showFileUpload && <FileUpload onChange={handleFileChange}/>}
      </div>
    </div>
  )

  return (
    <>
      <BlogModal
        disabled={isLoading}
        isOpen={blogModal.isOpen}
        title="Tạo bài"
        actionLabel={
          isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Đăng"
        }
        onClose={blogModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        currentUser={currentUser}
        //footer={""}
      />

      <ImgChoosingModal onSelectImages={handleSelectImages} />
    </>
  )
}

export default CreateBlogModal
