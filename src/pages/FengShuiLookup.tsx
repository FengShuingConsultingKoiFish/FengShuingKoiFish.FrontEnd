import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import InputField from "@/components/global/atoms/InputField"
import SubmitButton from "@/components/global/atoms/SubmitButton"
import ToggleSwitch from "@/components/global/atoms/ToggleSwitch"

import "../styles/fengshui.css"

const FengShuiLookup: React.FC = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("TRẦN HOÀNG QUỐC VIỆT")
  const [gender, setGender] = useState("Nam")
  const [year, setYear] = useState("1999")
  const [month, setMonth] = useState("02")
  const [day, setDay] = useState("4")
  const [isToggled, setIsToggled] = useState(false)

  const handleToggle = () => {
    setIsToggled(!isToggled)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/ket-qua", {
      state: {
        name,
        gender,
        birthDate: `${day}/${month}/${year} (DL)`
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
          width: "1600px",
          height: "822px",
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Họ Và Tên"
              value={name}
              onChange={setName}
              id="name"
            />
            <div className="flex space-x-4">
              <InputField
                label="Giới tính"
                value={gender}
                onChange={setGender}
                id="gender"
                type="select"
                options={["Nam", "Nữ"]}
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
              />
            </div>
            <div className="flex space-x-4">
              <InputField
                label="Tháng sinh"
                value={month}
                onChange={setMonth}
                id="month"
                type="select"
                options={Array.from(
                  { length: 12 },
                  (_, index) => `Tháng ${index + 1}`
                )}
              />
              <InputField
                label="Ngày sinh"
                value={day}
                onChange={setDay}
                id="day"
                type="select"
                options={Array.from(
                  { length: 31 },
                  (_, index) => `${index + 1}`
                )}
              />
            </div>
            <ToggleSwitch
              isToggled={isToggled}
              onToggle={handleToggle}
              labelOn="Nhập thông tin mới"
              labelOff="Sử dụng từ tài khoản đăng nhập"
            />
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
