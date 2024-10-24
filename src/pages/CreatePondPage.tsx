import React, { useEffect, useState } from "react"

import axios from "axios"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

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
  const [pondImage, setPondImage] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [activeButton, setActiveButton] = useState<string>("create")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [existingPonds, setExistingPonds] = useState<Pond[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = sessionStorage.getItem("token")

    if (!token) {
      toast.error("Vui lòng đăng nhập để tạo hồ cá.")
      navigate("/")
      return
    }

    const fetchPonds = async () => {
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
  }, [navigate])

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("File", file)

    try {
      const token = sessionStorage.getItem("token")

      const response = await axios.post(
        "https://consultingfish.azurewebsites.net/api/Images/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      if (response.data.isSuccess) {
        return response.data.result.filePath
      } else {
        setErrorMessage("Tải lên ảnh không thành công, vui lòng thử lại.")
        return null
      }
    } catch (error) {
      console.error("Lỗi khi tải lên ảnh:", error)
      setErrorMessage("Có lỗi xảy ra khi tải lên ảnh.")
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pondName || !quantity || !description || !pondImage) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin và chọn ảnh.")
      return
    }

    const isNameDuplicate = existingPonds.some(
      (pond) => pond.pondName === pondName
    )
    if (isNameDuplicate) {
      setErrorMessage("Tên hồ cá đã tồn tại, vui lòng chọn tên khác.")
      return
    }

    const token = sessionStorage.getItem("token")

    try {
      const uploadedImageUrl = await handleImageUpload(pondImage)
      if (!uploadedImageUrl) {
        return
      }

      const response = await axios.post(
        "https://consultingfish.azurewebsites.net/api/UserPond/add",
        {
          pondName,
          quantity: Number(quantity),
          image: uploadedImageUrl,
          description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        setSuccessMessage("Hồ cá đã được tạo thành công!")
        setErrorMessage(null)

        setPondName("")
        setQuantity("")
        setPondImage(null)
        setDescription("")

        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      }
    } catch (error) {
      console.error("Có lỗi xảy ra: ", error)
      setErrorMessage("Có lỗi xảy ra khi tạo hồ cá, vui lòng thử lại.")
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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-10 max-w-3xl rounded-lg bg-yellow-50 p-10 shadow-lg"
    >
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
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                setPondImage(e.target.files[0])
              }
            }}
            className="w-full rounded-lg border border-gray-300 p-3 shadow-inner"
            accept="image/*"
            required
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

        {errorMessage && (
          <div className="text-center font-semibold text-red-500">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-center font-semibold text-green-600">
            {successMessage}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <div className="rounded-lg">
            <SubmitButton label="Tạo hồ cá" />
          </div>
        </div>
      </form>
    </motion.div>
  )
}

export default CreatePondPage
