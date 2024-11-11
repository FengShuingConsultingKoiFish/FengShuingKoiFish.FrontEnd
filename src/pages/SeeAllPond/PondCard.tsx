import React, { useState } from "react"

import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import OnclickButton from "@/components/global/atoms/OnclickButton"

interface Pond {
  id: number
  pondName: string
  quantity: number
  description: string
  image: string
  score: number
  scoreDetail?: string
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
  const [scoreDetail, setScoreDetail] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleViewDetails = () => {
    navigate(`/pond-details/${pond.id}`, { state: { quantity: pond.quantity } })
  }

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ cá này?")) {
      onDelete(id)
    }
    toast.success("Xóa thành công!")
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
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Cập nhật thành công!")
    if (
      !updatedPond.pondName ||
      !updatedPond.quantity ||
      !updatedPond.description
    ) {
      setErrorMessage("Các trường không được để trống!")
      setLoading(false)
      return
    }

    if (!validateName(updatedPond.pondName, id)) {
      setErrorMessage("Tên hồ cá đã tồn tại!")
      setLoading(false)
      return
    }

    if (selectedFile) {
      setLoading(true)
      const formData = new FormData()
      formData.append("File", selectedFile)
      try {
        const token = localStorage.getItem("token")
        const uploadResponse = await axiosClient.post(
          "/api/Images/upload-image",
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
          setLoading(false)
          return
        }
      } catch (error) {
        console.error("Lỗi khi tải lên ảnh:", error)
        setErrorMessage("Có lỗi xảy ra khi tải lên ảnh.")
        setLoading(false)
        return
      } finally {
        setLoading(false)
      }
    }

    setErrorMessage(null)
    onUpdate(updatedPond)
    setIsEditing(false)
    setLoading(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUpdatedPond({ ...updatedPond, [e.target.name]: e.target.value })
  }

  const handleScoreDetail = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axiosClient.get("/api/UserPond/getall", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.isSuccess && response.data.result) {
        const selectedPond = response.data.result.find(
          (p: Pond) => p.id === pond.id
        )
        if (selectedPond) {
          const roundedScoreDetail = selectedPond.scoreDetail
            ? selectedPond.scoreDetail.replace(/\d+\.\d+/g, (match: string) =>
                Math.round(parseFloat(match)).toString()
              )
            : "Không có"
          setScoreDetail(roundedScoreDetail)
          setIsModalOpen(true)
        } else {
          setScoreDetail("Không có chi tiết điểm số cho hồ cá này.")
        }
      } else {
        setScoreDetail("Không thể lấy danh sách hồ cá.")
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết điểm số:", error)
      setScoreDetail("Có lỗi xảy ra khi lấy chi tiết điểm số.")
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div
      className="relative mx-auto mb-10 flex h-auto items-center overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl"
      style={{
        width: "80%",
        height: "500px",
        backgroundImage:
          "url('https://goldensmiletravel.com/uploads/images/2023/04/27/ho-tien-truc-1-1682594687.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "30% 40% 20% 40% / 40% 60% 40% 40%",
        boxShadow:
          "0 4px 8px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.3)",
        border: "20px solid #CE7446"
      }}
    >
      {isEditing ? (
        <div className="w-full p-80">
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
              className="rounded bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-6 py-2 font-semibold text-white transition-all duration-300 hover:bg-blue-400"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}{" "}
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
            <p className="mb-4 max-w-[85%] break-words text-xl text-gray-200 transition-transform duration-300 hover:scale-105">
              Mô tả: {description}
            </p>

            <p className="mb-4 text-xl text-yellow-300 transition-transform duration-300 hover:scale-105">
              Điểm số:{" "}
              {score === 0
                ? "Chưa có điểm (Hãy cập nhật hồ cá)"
                : Math.round(score)}
              <button
                onClick={handleScoreDetail}
                className="ml-4 rounded bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-2 py-1 text-white transition-all duration-300 hover:bg-blue-400"
              >
                Chi tiết
              </button>
            </p>

            {isModalOpen && (
              <div className="absolute left-0 top-0 z-50 flex w-full justify-center bg-black bg-opacity-50">
                <div
                  className="relative mt-10 w-full max-w-md overflow-y-auto rounded-lg bg-white p-8 shadow-lg"
                  style={{
                    maxHeight: "80vh"
                  }}
                >
                  <h3 className="mb-4 text-center text-3xl font-bold text-gray-700">
                    Chi tiết Điểm Số
                  </h3>
                  <div className="flex flex-col items-start space-y-4">
                    <p className="text-lg text-gray-600">
                      <span className="font-semibold text-blue-600">
                        Tên hồ cá:
                      </span>{" "}
                      {pond.pondName}
                    </p>
                    <p className="text-lg text-gray-600">
                      <span className="font-semibold text-blue-600">
                        Số lượng cá:
                      </span>{" "}
                      {pond.quantity}
                    </p>

                    <p className="whitespace-pre-wrap text-lg text-gray-600">
                      <span className="font-semibold text-blue-600">
                        Điểm chi tiết:
                        <br />
                      </span>{" "}
                      {scoreDetail
                        ? scoreDetail.replace(/,/g, ",\n")
                        : "Không có"}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={closeModal}
                      className="rounded bg-red-500 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-red-400"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-2 flex items-center space-x-4">
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
