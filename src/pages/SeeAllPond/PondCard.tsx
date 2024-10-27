import React, { useState } from "react"

import axios from "axios"
import { useNavigate } from "react-router-dom"

import OnclickButton from "@/components/global/atoms/OnclickButton"

interface Pond {
  id: number
  pondName: string
  quantity: number
  description: string
  image: string
  score: number
}

interface PondCardProps {
  pond: Pond
  onDelete: (id: number) => void
  onUpdate: (updatedPond: Pond) => void
  validateName: (name: string, id: number) => boolean
}

const PondCard: React.FC<PondCardProps> = ({
  pond,
  onDelete,
  onUpdate,
  validateName
}) => {
  const { pondName, quantity, description, image, id, score } = pond
  const [isEditing, setIsEditing] = useState(false)
  const [updatedPond, setUpdatedPond] = useState<Pond>(pond)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/pond-details/${pond.id}`, { state: { quantity: pond.quantity } })
  }

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ cá này?")) {
      onDelete(id)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setUpdatedPond(pond)
    setSelectedFile(null)
    setErrorMessage(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSave = async () => {
    if (
      !updatedPond.pondName ||
      !updatedPond.quantity ||
      !updatedPond.description
    ) {
      setErrorMessage("Các trường không được để trống!")
      return
    }

    if (!validateName(updatedPond.pondName, id)) {
      setErrorMessage("Tên hồ cá đã tồn tại!")
      return
    }

    if (selectedFile) {
      const formData = new FormData()
      formData.append("File", selectedFile)
      try {
        const token = sessionStorage.getItem("token")
        const uploadResponse = await axios.post(
          "https://consultingfish.azurewebsites.net/api/Images/upload-image",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        )

        if (uploadResponse.data.isSuccess) {
          updatedPond.image = uploadResponse.data.result.filePath
        } else {
          setErrorMessage("Tải lên ảnh không thành công.")
          return
        }
      } catch (error) {
        console.error("Lỗi khi tải lên ảnh:", error)
        setErrorMessage("Có lỗi xảy ra khi tải lên ảnh.")
        return
      }
    }

    setErrorMessage(null)
    onUpdate(updatedPond)
    setIsEditing(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUpdatedPond({ ...updatedPond, [e.target.name]: e.target.value })
  }

  return (
    <div
      className="relative mx-auto mb-10 flex h-auto items-center overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl"
      style={{
        width: "80%",
        height: "500px",
        backgroundColor: "#90cdf4",
        borderRadius: "30% 40% 20% 40% / 40% 60% 40% 40%",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        border: "20px solid #CE7446"
      }}
    >
      {isEditing ? (
        <div className="w-full p-64">
          <div className="mb-4 flex flex-col">
            <label className="#4F4F4F mb-1">Tên hồ cá:</label>
            <input
              name="pondName"
              value={updatedPond.pondName}
              onChange={handleInputChange}
              className="rounded bg-gray-700 p-2 text-white"
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-white">Số lượng cá:</label>
            <input
              name="quantity"
              type="number"
              value={updatedPond.quantity}
              onChange={handleInputChange}
              className="rounded bg-gray-700 p-2 text-white"
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-white">Mô tả:</label>
            <textarea
              name="description"
              value={updatedPond.description}
              onChange={handleInputChange}
              className="rounded bg-gray-700 p-2 text-white"
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-white">Hình ảnh:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="rounded bg-gray-700 p-2 text-white"
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="rounded bg-blue-500 px-6 py-2 font-semibold text-white transition-all duration-300 hover:bg-blue-400"
            >
              Lưu
            </button>
            <button
              onClick={handleCancelEdit}
              className="rounded bg-gray-500 px-6 py-2 font-semibold text-white transition-all duration-300 hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <>
          <img
            src={image}
            alt={pondName}
            className="absolute ml-16 h-[300px] w-[300px] rounded-full border-4 border-gray-700 object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute top-10 w-full text-center">
            <h2 className="text-6xl font-bold italic text-white transition-colors duration-300 hover:text-[#FFAB76]">
              {pondName}
            </h2>
          </div>
          <div className="ml-[160px] mt-32 flex h-full w-full flex-col justify-center p-6 pl-64 shadow-inner">
            <p className="mb-2 text-xl font-medium text-gray-100 transition-transform duration-300 hover:scale-105">
              Số lượng cá: {quantity}
            </p>
            <p className="mb-4 text-xl text-gray-200 transition-transform duration-300 hover:scale-105">
              Mô tả: {description}
            </p>
            <p className="mb-4 text-xl text-yellow-300 transition-transform duration-300 hover:scale-105">
              Điểm số:{" "}
              {score === 0 ? "Chưa có điểm (Hãy cập nhật hồ cá)" : score}
            </p>
            {/* Hàng nút */}
            <div className="mt-4 flex items-center space-x-4">
              <OnclickButton label="Xem chi tiết" onClick={handleViewDetails} />
              <button
                onClick={handleEdit}
                className="rounded bg-yellow-500 px-4 py-2 font-semibold text-white transition-all duration-300 hover:bg-yellow-400"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-red-500 px-4 py-2 font-semibold text-white transition-all duration-300 hover:bg-red-400"
              >
                Xóa
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PondCard
