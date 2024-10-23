import React, { useEffect, useState } from "react"

import axios from "axios"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

// Sử dụng framer-motion để thêm hiệu ứng chuyển trang
import SubmitButton from "@/components/global/atoms/SubmitButton"

interface Pond {
  pondName: string
  quantity: number
  description: string
  image: string
}

const CreatePondPage: React.FC = () => {
  const [pondName, setPondName] = useState("")
  const [quantity, setQuantity] = useState<number | "">("")
  const [pondImage, setPondImage] = useState("")
  const [description, setDescription] = useState("")
  const [activeButton, setActiveButton] = useState<string>("create")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [existingPonds, setExistingPonds] = useState<Pond[]>([])
  const navigate = useNavigate()

  // Lấy danh sách các hồ cá để kiểm tra tên trùng
  useEffect(() => {
    const fetchPonds = async () => {
      const token = sessionStorage.getItem("token")
      try {
        const response = await axios.get(
          "https://consultingfish.azurewebsites.net/api/UserPond/getall",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (response.data.isSuccess) {
          setExistingPonds(response.data.result)
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hồ cá:", error)
      }
    }

    fetchPonds()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Kiểm tra các trường chưa nhập
    if (!pondName || !quantity || !description || !pondImage) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin.")
      return
    }

    // Kiểm tra tên hồ cá có trùng không
    const isNameDuplicate = existingPonds.some(
      (pond) => pond.pondName === pondName
    )
    if (isNameDuplicate) {
      setErrorMessage("Tên hồ cá đã tồn tại, vui lòng chọn tên khác.")
      return
    }

    const token = sessionStorage.getItem("token")

    try {
      const response = await axios.post(
        "https://consultingfish.azurewebsites.net/api/UserPond/add",
        {
          pondName,
          quantity: Number(quantity),
          image: pondImage,
          description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        // Hiển thị thông báo thành công
        setSuccessMessage("Hồ cá đã được tạo thành công!")
        setErrorMessage(null) // Xóa thông báo lỗi nếu có

        // Reset form
        setPondName("")
        setQuantity("")
        setPondImage("")
        setDescription("")

        // Xóa thông báo sau 3 giây
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      }
    } catch (error) {
      console.error("Có lỗi xảy ra: ", error)
    }
  }

  const handleNavigation = (page: string) => {
    setActiveButton(page)
    if (page === "create") {
      navigate("/create-pond")
    } else if (page === "see-all") {
      navigate("/see-all-pond")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Hiệu ứng khi bắt đầu
      animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi xuất hiện
      exit={{ opacity: 0, y: -50 }} // Hiệu ứng khi thoát
      transition={{ duration: 0.5 }} // Thời gian hiệu ứng chuyển trang
      className="mx-auto mt-10 max-w-3xl rounded-lg bg-yellow-50 p-10 shadow-lg"
    >
      {/* 2 nút điều hướng */}
      <div className="mb-6 flex justify-start space-x-4">
        <button
          onClick={() => handleNavigation("create")}
          className={`rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl ${
            activeButton === "create"
              ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              : "bg-gray-400"
          }`}
        >
          Tạo hồ cá
        </button>
        <button
          onClick={() => handleNavigation("see-all")}
          className={`rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl ${
            activeButton === "see-all"
              ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              : "bg-gray-400"
          }`}
        >
          Xem tất cả hồ cá
        </button>
      </div>

      <h1 className="mb-10 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-center text-5xl font-extrabold text-transparent">
        Tạo Hồ Cá
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 shadow-md">
          <label className="mb-2 block text-xl font-semibold">Tên hồ cá</label>
          <input
            type="text"
            value={pondName}
            onChange={(e) => setPondName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 shadow-inner"
            required
          />
          <span className="absolute right-4 top-2 font-bold text-gray-400">
            1/4
          </span>
        </div>

        <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 shadow-md">
          <label className="mb-2 block text-xl font-semibold">
            Số lượng cá
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 p-3 shadow-inner"
            required
          />
          <span className="absolute right-4 top-2 font-bold text-gray-400">
            2/4
          </span>
        </div>

        <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 shadow-md">
          <label className="mb-2 block text-xl font-semibold">Hình ảnh</label>
          <input
            type="text"
            value={pondImage}
            onChange={(e) => setPondImage(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 shadow-inner"
            placeholder="URL hình ảnh"
          />
          <span className="absolute right-4 top-2 font-bold text-gray-400">
            3/4
          </span>
        </div>

        <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 shadow-md">
          <label className="mb-2 block text-xl font-semibold">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 shadow-inner"
            placeholder="Mô tả về hồ cá"
          />
          <span className="absolute right-4 top-2 font-bold text-gray-400">
            4/4
          </span>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {errorMessage && (
          <div className="text-center font-semibold text-red-500">
            {errorMessage}
          </div>
        )}

        {/* Thông báo thành công khi tạo hồ cá */}
        {successMessage && (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-center font-semibold text-green-600">
            {successMessage}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          {/* Thay thế nút submit bằng SubmitButton */}
          <div className="rounded-lg">
            <SubmitButton label="Tạo hồ cá" />
          </div>
        </div>
      </form>
    </motion.div>
  )
}

export default CreatePondPage
