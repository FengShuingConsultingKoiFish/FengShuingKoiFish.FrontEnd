import React from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { TiCancel } from "react-icons/ti"

import Avatar from "@/components/layout/header/Avatar"

interface UserSectionProps {
  userId: string
  userName: string
  fullName: string
  identityCard: string
  dateOfBirth: string
  gender: string
  avatar: string
  createdDate: string
}

const UserSection: React.FC<UserSectionProps> = ({
  userId,
  userName,
  fullName,
  identityCard,
  dateOfBirth,
  gender,
  avatar,
  createdDate,
}) => {

  const defaultAvatar =
    "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"


  return (
    <>
      <div className="relative mb-6 rounded-lg border border-gray-200 bg-white p-3 shadow-md">
        <div className="items-center px-4 py-3">
          <div className="flex flex-col justify-start gap-3">
            <div className="flex flex-row justify-between">
              <p className="inline-flex gap-3 text-xl font-semibold items-center">
                <Avatar w="40px" h="40px" userImg={avatar || defaultAvatar} />

                <span className="text-xl font-medium">{userName}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-start gap-2 px-4">
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p className=""> Họ và tên :</p>
            {fullName}
          </p>
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p>Mã CMND / CCCD :</p>
            {identityCard}
          </p>
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p>Ngày sinh:</p>
            {dateOfBirth}
          </p>
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p>Giới tính :</p>
            {gender}
          </p>
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p>Ngày tạo tài khoản :</p>
            {createdDate}
          </p>
        </div>
      </div>
    </>
  )
}

export default UserSection
