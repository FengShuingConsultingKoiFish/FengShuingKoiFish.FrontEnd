import React, { useEffect, useState } from "react"

import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { GetUserProfile } from "@/lib/api/User"
import { AppDispatch, RootState } from "@/lib/redux/store"

import ConfirmModal1 from "@/components/global/atoms/ConfirmModal1"
import InputField from "@/components/global/atoms/InputField"
import SubmitButton from "@/components/global/atoms/SubmitButton"
import ToggleSwitch from "@/components/global/atoms/ToggleSwitch"

import "../styles/fengshui.css"

const FengShuiLookup: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [name, setName] = useState("")
  const [gender, setGender] = useState("")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")
  const [isToggled, setIsToggled] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const userProfile = useSelector((state: RootState) => state.users.detailUser)
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  useEffect(() => {
    if (!userProfile && currentUser) {
      GetUserProfile(dispatch)
    }
  }, [dispatch, currentUser, userProfile])

  const handleToggle = () => {
    const newToggleState = !isToggled
    setIsToggled(newToggleState)

    if (newToggleState) {
      if (
        !userProfile?.fullName?.trim() ||
        !userProfile?.dateOfBirth?.trim() ||
        !userProfile?.gender?.trim()
      ) {
        // Hiển thị thông báo khi thiếu thông tin
        setShowModal(true)
      } else {
        setName(userProfile.fullName)
        setGender(userProfile.gender)

        const [day, month, year] = userProfile.dateOfBirth.split("/")
        setDay(day)
        setMonth(month)
        setYear(year)

        setIsReadOnly(true)
      }
    } else {
      setName("")
      setGender("")
      setDay("")
      setMonth("")
      setYear("")
      setIsReadOnly(false)
      setShowModal(false) // Ẩn thông báo khi tắt toggle
    }
  }

  // Hàm chuyển hướng đến trang profile
  const goToProfile = () => {
    setShowModal(false) // Đóng modal
    navigate("/Setting/profile?redirect=fengshui")
  }

  // Hàm đóng modal và reset trạng thái toggle
  const handleCloseModal = () => {
    setShowModal(false)
    setIsToggled(false) // Tắt toggle khi đóng modal
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    navigate("/ket-qua", {
      state: {
        name,
        gender,
        birthDate: `${day}/${month}/${year} (DL)`,
        useAccountInfo: isToggled
      }
    })
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundColor: "#000"
      }}
    >
      <div
        className="relative flex flex-col items-center justify-center text-white"
        style={{
          width: "100%",
          height: "1000px",
          backgroundImage: `url('https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/12/hinh-nen-vu-tru-72.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: `'Roboto', sans-serif`
        }}
      >
        <h1 className="mb-4 text-4xl font-bold">
          TRA CỨU MỆNH PHONG THỦY CÁ KOI
        </h1>
        <p className="mb-8 text-center">
          Mỗi con người sinh ra đều có vận mệnh khác nhau.
        </p>
        <div className="relative w-full max-w-md rounded-lg bg-white bg-opacity-10 p-8">
          <h2 className="mb-4 text-2xl font-bold">GIẢI MÃ CUỘC ĐỜI BẠN</h2>

          <ConfirmModal1
            isOpen={showModal}
            onClose={handleCloseModal} // Đóng modal và tắt toggle
            onConfirm={goToProfile}
            message="Bạn cần cập nhật thông tin trước khi đoán mệnh."
            confirmText="Đi đến cập nhật"
            cancelText="Hủy"
          />

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Họ Và Tên"
              value={name}
              onChange={setName}
              id="name"
              readOnly={isReadOnly}
            />

            <div className="flex space-x-4">
              <InputField
                label="Giới tính"
                value={gender}
                onChange={setGender}
                id="gender"
                type="select"
                options={["", "Nam", "Nữ"]}
                disabled={isReadOnly}
              />
              <InputField
                label="Năm sinh"
                value={year}
                onChange={setYear}
                id="year"
                type="select"
                options={Array.from(
                  { length: 100 },
                  (_, index) => `${2023 - index}`
                )}
                disabled={isReadOnly}
              />
            </div>
            <div className="flex space-x-4">
              <InputField
                label="Tháng sinh"
                value={month}
                onChange={setMonth}
                id="month"
                type="select"
                options={[
                  "",
                  ...Array.from(
                    { length: 12 },
                    (_, index) => `${(index + 1).toString().padStart(2, "0")}`
                  )
                ]}
                disabled={isReadOnly}
              />
              <InputField
                label="Ngày sinh"
                value={day}
                onChange={setDay}
                id="day"
                type="select"
                options={[
                  "",
                  ...Array.from(
                    { length: 31 },
                    (_, index) => `${(index + 1).toString().padStart(2, "0")}`
                  )
                ]}
                disabled={isReadOnly}
              />
            </div>
            {currentUser && (
              <ToggleSwitch
                isToggled={isToggled}
                onToggle={handleToggle}
                labelOn="Nhập thông tin mới"
                labelOff="Sử dụng từ tài khoản đăng nhập"
              />
            )}

            <div className="mt-8 flex justify-center">
              <SubmitButton label="Giải mã" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FengShuiLookup
