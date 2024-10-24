import React, { useEffect } from "react"

import { RiArrowLeftSFill } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { GetUserProfile } from "@/lib/api/User"
import { RootState } from "@/lib/redux/store"

import Container from "@/components/ui/Container"

import AccountDetail from "./Components/Detail"

interface User {
  fullName: string
  identityCard: string
  dateOfBirth: Date
  gender: string
  imageId: string
}

interface ProfileSettingProps {}

const ProfileSetting: React.FC<ProfileSettingProps> = () => {
  //const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  const userProfile = useSelector((state: RootState) => state.users.detailUser)
  const defaultAvatar =
    "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"

  console.log(userProfile)

  useEffect(() => {
    window.scrollTo(0, 0)
  })
  return (
    <Container>
      <div className="min-h-screen pt-20 font-semibold">
        <div className="container mx-auto rounded-lg bg-white">
          <Link to="/">
            <button className="mb-20 inline-flex transform items-center rounded-full bg-gray-500 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-600 hover:shadow-lg">
              <RiArrowLeftSFill />
              Trở về
            </button>
          </Link>
          <h1 className="mb-10 text-3xl">Cài đặt tài khoản</h1>
          <div className="flex border-t-[2px] pt-10">
            <AccountDetail
              fullName={userProfile?.fullName || ""}
              identityCard={userProfile?.identityCard || ""}
              dateOfBirth={userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth) : null}
              gender={userProfile?.gender || ""}
              imageId=""
              avatar={userProfile?.avatar || defaultAvatar}
            />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProfileSetting
