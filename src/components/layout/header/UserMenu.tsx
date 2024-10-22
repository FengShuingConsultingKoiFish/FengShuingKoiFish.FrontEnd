import { useCallback, useEffect, useState } from "react"

import toast from "react-hot-toast"
import { CgProfile } from "react-icons/cg"
import { FaHistory } from "react-icons/fa"
import { HiOutlineLogin } from "react-icons/hi"
import { IoMdArrowDropdown } from "react-icons/io"
import { IoIosSettings, IoMdNotifications } from "react-icons/io"
import { MdDashboard } from "react-icons/md"
import { PiPackageFill } from "react-icons/pi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { GetUserProfile } from "@/lib/api/User"
import { AppDispatch, RootState } from "@/lib/redux/store"

import {
  clearCurrentUser,
  setCurrentUser
} from "../../../lib/redux/reducers/userSlice"
import Avatar from "./Avatar"
import { HoverBorderGradient } from "./HoverBorder"
import MenuItem from "./MenuItem"

interface User {
  Id: string
  Name: string
  Email: string
  Role: string // Assuming Role can be "Admin", "Staff", or something else
}

interface UserMenuProps {
  currentUser: User | null // currentUser can be null or a valid user object
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  //const [userProfile, setUserProfile] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const defaultAvatar =
    "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"

  const ToggleOpen = useCallback(() => {
    setIsOpen((value) => !value)
  }, [])

  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    // Check if user is stored in sessionStorage and set it in Redux
    const user = sessionStorage.getItem("user")
    if (user) {
      dispatch(setCurrentUser(JSON.parse(user)))
    }
  }, [dispatch])

  useEffect(() => {
    GetUserProfile(dispatch)
  }, [dispatch])

  const userProfile = useSelector((state: RootState) => state.users.detailUser)

  const handleLogout = useCallback(() => {
    // Clear user from Redux store
    dispatch(clearCurrentUser())
    setIsOpen(false)
    toast.success("Đăng xuất thành công!")
    navigate("/")
  }, [dispatch, navigate])

  const handleMyProfile = useCallback(() => {
    if (currentUser) {
      navigate(`/Profile/${currentUser.Name}`)
    }
  }, [currentUser, navigate])

  return (
    <div className="relative">
      <div
        onClick={ToggleOpen}
        className="flex flex-row items-center justify-between gap-3"
      >
        <span>Chào mừng</span>
        <HoverBorderGradient>
          {currentUser?.Name}
          <Avatar
            userImg={
              userProfile && userProfile.avatar
                ? userProfile.avatar
                : defaultAvatar
            }
            w="32px"
            h="32px"
            //onClick={()=> {}}
          />
          <IoMdArrowDropdown size={25} />
        </HoverBorderGradient>
      </div>

      {isOpen && (
        <div className="md:w-3/1 absolute right-0 top-12 z-10 w-[12vw] overflow-hidden rounded-xl bg-white text-sm shadow-md">
          <div className="flex cursor-pointer flex-col">
            {currentUser ? (
              currentUser.Role === "Staff" ? (
                <>
                  <MenuItem
                    onClick={() => {}}
                    closeMenu={closeMenu}
                    label="Dashboard"
                    icon={<MdDashboard size={20} />}
                  />
                  <MenuItem
                    onClick={() => {}}
                    closeMenu={closeMenu}
                    label="Thông báo"
                    icon={<IoMdNotifications size={20} />}
                  />
                  <MenuItem
                    onClick={handleLogout}
                    closeMenu={closeMenu}
                    label="Đăng xuất"
                    icon={<HiOutlineLogin size={20} />}
                  />
                </>
              ) : currentUser.Name === "Admin" ? (
                <>
                  <MenuItem
                    onClick={handleMyProfile}
                    closeMenu={closeMenu}
                    label="Hồ sơ của tôi"
                    icon={<CgProfile size={20} />}
                  />
                  <MenuItem
                    onClick={() => {}}
                    closeMenu={closeMenu}
                    label="Dashboard"
                    icon={<MdDashboard size={20} />}
                  />
                  <MenuItem
                    onClick={handleLogout}
                    closeMenu={closeMenu}
                    label="Đăng xuất"
                    icon={<HiOutlineLogin size={20} />}
                  />
                </>
              ) : (
                <>
                  <MenuItem
                    onClick={handleMyProfile}
                    closeMenu={closeMenu}
                    label="Hồ sơ của tôi"
                    icon={<CgProfile size={20} />}
                  />
                  <MenuItem
                    onClick={() => {}}
                    closeMenu={closeMenu}
                    label="Lịch sử"
                    icon={<FaHistory size={20} />}
                  />
                  <MenuItem
                    onClick={() => {}}
                    closeMenu={closeMenu}
                    label="Gói hội viên của tôi"
                    icon={<PiPackageFill size={20} />}
                  />
                  <MenuItem
                    onClick={() => {}}
                    closeMenu={closeMenu}
                    label="Thông báo"
                    icon={<IoMdNotifications size={20} />}
                  />
                  <MenuItem
                    onClick={() => {}}
                    closeMenu={closeMenu}
                    label="Cài đặt"
                    icon={<IoIosSettings size={20} />}
                  />
                  <MenuItem
                    onClick={handleLogout}
                    closeMenu={closeMenu}
                    label="Đăng xuất"
                    icon={<HiOutlineLogin size={20} />}
                  />
                </>
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
