import React, { useEffect, useRef, useState } from "react"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from "@headlessui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { IconDeviceFloppy } from "@tabler/icons-react"
import clsx from "clsx"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FaCalendar } from "react-icons/fa"
import { MdAddPhotoAlternate, MdEdit } from "react-icons/md"
import { RiArrowDropDownLine } from "react-icons/ri"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import * as yup from "yup"

import useProfileImgModal from "@/hooks/useProfileImgModal"

import { uploadImage } from "@/lib/api/Image"
import { updateUserAvatar } from "@/lib/api/Image"
import { CreateOrUpdateUserProfile, GetUserProfile } from "@/lib/api/User"
import { setDetailUser } from "@/lib/redux/reducers/userSlice"

import Avatar from "@/components/layout/header/Avatar"
import Input from "@/components/ui/Input"

import CustomButton from "./CustomBtn"
import ProfileImgChoosingModal from "./ProfileImgChoosing"

interface AccountDetailProps {
  fullName: string
  identityCard: string
  dateOfBirth: Date | null
  gender: string
  imageId: any
  avatar: any
}

// Utility function to convert "DD/MM/YYYY" string to a Date object
const formatDate = (date: Date) => {
  const offset = date.getTimezoneOffset()
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000) // Adjust for time zone
  return adjustedDate.toISOString().split("T")[0] // Return "YYYY-MM-DD" only
}

const AccountDetail: React.FC<AccountDetailProps> = ({
  fullName: defaultname,
  identityCard: defaultIdentity,
  dateOfBirth,
  gender,
  imageId,
  avatar
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState(defaultname)
  const [identityCard, setIdentityCard] = useState(defaultIdentity)
  const [isEditingFullName, setIsEditingFullName] = useState(false)
  const [isEditingIdentityCard, setIsEditingIdentityCard] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState<Date | null>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGender, setSelectedGender] = useState(gender || "Nam")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const profileImgChoosingModal = useProfileImgModal()

  useEffect(() => {
    console.log("value of dob:", dateOfBirth)
    if (dateOfBirth) {
      const parsedDate = new Date(dateOfBirth)
      if (!isNaN(parsedDate.getTime())) {
        setStartDate(parsedDate)
      } else {
        setStartDate(null)
      }
    }
  }, [dateOfBirth])

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click() // Trigger file input click
    }
  }
  const handleSelectImageClick = () => {
    profileImgChoosingModal.onOpen()
  }

  const handleSelectImage = (image: { id: number; imageUrl: string }) => {
    setSelectedImageUrl(image.imageUrl)
    setSelectedImageId(image.id)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setUploadedFile(file)
      console.log(file)

      const imageUrl = URL.createObjectURL(file)
      console.log("Temporary Image URL:", imageUrl)
      setSelectedImageUrl(imageUrl)
    } else {
      toast.error("Vui lòng chọn đúng loại ảnh")
    }
  }

  //----------------------------------------------------------------------------//
  const handleEditFullName = () => {
    setIsEditingFullName(true)
    setIsEditingIdentityCard(false)
  }

  const handleEditIdentityCard = () => {
    setIsEditingIdentityCard(true)
    setIsEditingFullName(false)
  }
  // Forms
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      fullName: fullName,
      identityCard: identityCard,
      dateOfBirth: dateOfBirth,
      gender: gender,
      imageId: imageId,
      avatar: avatar
      //
    }
    //resolver: yupResolver(schema),
  })

  const handleSaveFullName = () => {
    setIsEditingFullName(false)
  }

  // Save identityCard changes
  const handleSaveIdentityCard = () => {
    setIsEditingIdentityCard(false)
  }

  //----------------------------------Logic onSubmit---------------------------------//

  // API call to update the user profile
  const onSubmit = async () => {
    setIsLoading(true)
    try {
      let imageIdToUpload: number | null = selectedImageId

      if (uploadedFile) {
        console.log("Uploading file:", uploadedFile)
        imageIdToUpload = await uploadImage(uploadedFile)
        console.log("Image ID after upload:", imageIdToUpload)
      }

      const profileData = {
        fullName,
        identityCard,
        dateOfBirth: startDate ? formatDate(startDate) : null,
        gender: selectedGender,
        imageId: imageIdToUpload || imageId
      }

      console.log("Profile data to update:", profileData)

      const response = await CreateOrUpdateUserProfile(profileData, dispatch)
      if (response && response.isSuccess) {
        if (imageIdToUpload) {
          const updateAvatarResponse = await updateUserAvatar(imageIdToUpload)
          console.log("Avatar updated successfully", updateAvatarResponse)
        }
        const updatedProfile = await GetUserProfile(dispatch)
        if (updatedProfile?.result) {
          dispatch(setDetailUser(updatedProfile.result)) // Update Redux store with new profile
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Đã có lỗi xảy ra khi cập nhật thông tin cá nhân.")
    } finally {
      setIsLoading(false)
    }
  }

  const people = [
    { id: 1, name: "Nam" },
    { id: 2, name: "Nữ" }
    //{ id: 3, name: "Khác" }
  ]

  return (
    <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2">
      {/* Avatar Section */}
      <div className="flex flex-col items-center justify-start">
        <h2 className="mb-4 text-lg font-semibold">Ảnh cá nhân</h2>
        <div className="relative cursor-pointer" onClick={handleAvatarClick}>
          <Avatar w="200px" h="200px" userImg={selectedImageUrl || avatar} />
          {/* Edit overlay */}
          <div className="absolute bottom-2 left-0 inline-flex items-center gap-1 rounded bg-black bg-opacity-50 p-1 text-sm text-white">
            <MdEdit size={25} />
            Chỉnh sửa
          </div>
        </div>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="image/png, image/jpeg"
        />
        <CustomButton
          icon={<MdAddPhotoAlternate size={25} />}
          label="Chọn ảnh từ thư viện của bạn"
          onClick={handleSelectImageClick}
        />
      </div>

      {/* Detail Section */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold">Tài khoản</h2>

        {/* Full Name */}
        <div className="mb-6">
          <label className="my-3 block font-bold text-gray-700">
            Họ và tên
          </label>
          {isEditingFullName ? (
            <Input
              id="fullName"
              label=""
              register={register}
              errors={errors}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
              placeholder="Tên của bạn"
            />
          ) : (
            <span className="my-2 block text-black">
              {fullName || "Vui lòng điền tên"}
            </span>
          )}
          {isEditingFullName ? (
            <div className="flex flex-row gap-5">
              <CustomButton
                label="Lưu"
                onClick={handleSubmit(handleSaveFullName)}
                disabled={isLoading}
              />
            </div>
          ) : (
            <div
              onClick={handleEditFullName}
              className="cursor-pointer font-semibold text-blue-500 hover:text-blue-700"
            >
              Chỉnh sửa
            </div>
          )}
        </div>

        {/* Identity Card */}
        <div className="mb-6">
          <label className="my-3 block font-bold text-gray-700">
            Mã định danh
          </label>
          {isEditingIdentityCard ? (
            <Input
              id="identityCard"
              label=""
              register={register}
              errors={errors}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIdentityCard(e.target.value)
              }
              placeholder="Số CMND/CCCD"
            />
          ) : (
            <span className="my-2 block text-black">
              {identityCard || "Vui lòng điền cccd"}
            </span>
          )}
          {isEditingIdentityCard ? (
            <div className="flex flex-row gap-5">
              <CustomButton
                label="Lưu"
                onClick={handleSubmit(handleSaveIdentityCard)}
                disabled={isLoading}
              />
              {errors.identityCard && (
                <p className="text-red-500">{errors.identityCard.message}</p>
              )}
            </div>
          ) : (
            <div
              onClick={handleEditIdentityCard}
              className="cursor-pointer font-semibold text-blue-500 hover:text-blue-700"
            >
              {identityCard ? "Chỉnh sửa" : "Thêm"}
            </div>
          )}
        </div>
        {/* Date Picker */}
        <div className="mb-6">
          <label className="my-3 block font-bold text-black">Ngày sinh</label>
          <div className="relative flex max-w-sm flex-row items-center justify-start gap-5">
            <div className="flex items-center">
              <FaCalendar size={25} />
            </div>
            <DatePicker
              icon={<FaCalendar />}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholderText="Chọn ngày"
              dateFormat="dd/MM/yyyy"
              isClearable
            />
          </div>
        </div>
        {/* Gender Picker*/}
        <div className="h-[100px] w-52">
          <label className="my-3 block font-bold text-black">Giới tính</label>
          <Listbox value={gender} onChange={setSelectedGender}>
            <ListboxButton
              className={clsx(
                "relative block w-full rounded-lg bg-gray-100 py-1.5 pl-3 pr-8 text-left text-sm/6 text-black",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
              )}
            >
              {selectedGender}
              <RiArrowDropDownLine
                size={20}
                className="group pointer-events-none absolute right-2.5 top-2.5 size-4 fill-black"
                aria-hidden="true"
              />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              transition
              className={clsx(
                "mt-1 w-[var(--button-width)] rounded-xl border border-black bg-black p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
                "z-50 transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
              )}
            >
              {people.map((person) => (
                <ListboxOption
                  key={person.name}
                  value={person.name}
                  className="group flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
                >
                  <div className="text-sm/6 text-white">{person.name}</div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
        <CustomButton
          icon={
            isLoading ? (
              <ClipLoader size={20} color={"#fff"} />
            ) : (
              <IconDeviceFloppy />
            )
          }
          label={isLoading ? "" : "Lưu thay đổi"}
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </div>
      <ProfileImgChoosingModal onSelectImage={handleSelectImage} />
    </div>
  )
}

export default AccountDetail
