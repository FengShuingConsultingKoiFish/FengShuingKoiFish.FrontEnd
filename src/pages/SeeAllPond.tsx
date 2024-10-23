import React, { useEffect, useState } from "react"

import axios from "axios"
import { motion } from "framer-motion"
import { FaEdit, FaTimes } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

import OnclickButton from "@/components/global/atoms/OnclickButton"

interface Pond {
  id: number
  pondName: string
  quantity: number
  description: string
  image: string
}

const PondCard: React.FC<{
  pond: Pond
  onDelete: (id: number) => void
  onUpdate: (updatedPond: Pond) => void
  validateName: (name: string, id: number) => boolean
}> = ({ pond, onDelete, onUpdate, validateName }) => {
  const { pondName, quantity, description, image, id } = pond
  const [isEditing, setIsEditing] = useState(false)
  const [updatedPond, setUpdatedPond] = useState<Pond>(pond)
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

  const handleSave = () => {
    if (
      !updatedPond.pondName ||
      !updatedPond.quantity ||
      !updatedPond.description ||
      !updatedPond.image
    ) {
      setErrorMessage("Các trường không được để trống!")
      return
    }
    if (!validateName(updatedPond.pondName, id)) {
      setErrorMessage("Tên hồ cá đã tồn tại!")
      return
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
    <div className="relative mb-10 flex h-auto items-center overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-shadow duration-300 hover:shadow-2xl">
      <button
        onClick={handleDelete}
        className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white transition-all duration-300 hover:bg-red-400"
      >
        <FaTimes className="text-lg" />
      </button>
      <button
        onClick={handleEdit}
        className="absolute right-4 top-16 rounded-full bg-yellow-500 p-2 text-white transition-all duration-300 hover:bg-yellow-400"
      >
        <FaEdit className="text-lg" />
      </button>

      {isEditing ? (
        <div className="w-full rounded-lg bg-gray-800 p-6">
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-white">Tên hồ cá:</label>
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
              name="image"
              value={updatedPond.image}
              onChange={handleInputChange}
              className="rounded bg-gray-700 p-2 text-white"
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            onClick={handleSave}
            className="self-start rounded bg-blue-500 px-6 py-2 font-semibold text-white transition-all duration-300 hover:bg-blue-400"
          >
            Lưu
          </button>
        </div>
      ) : (
        <>
          <img
            src={image}
            alt={pondName}
            className="absolute h-[300px] w-[300px] rounded-xl border-4 border-gray-700 object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="ml-[160px] flex h-full w-full flex-col justify-center rounded-lg bg-gray-800 p-6 pl-64 shadow-inner">
            <h2 className="mb-3 text-6xl font-bold text-blue-500 transition-colors duration-300 hover:text-blue-300">
              {pondName}
            </h2>
            <p className="mb-2 text-2xl font-medium text-gray-300 transition-transform duration-300 hover:scale-105">
              Số lượng cá: {quantity}
            </p>
            <p className="mb-4 text-2xl text-gray-400 transition-transform duration-300 hover:scale-105">
              Mô tả: {description}
            </p>
            <div className="flex space-x-4">
              <OnclickButton label="Xem chi tiết" onClick={handleViewDetails} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const SeeAllPond: React.FC = () => {
  const [ponds, setPonds] = useState<Pond[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [visiblePonds, setVisiblePonds] = useState<number>(4)
  const [activeButton, setActiveButton] = useState<string>("see-all")
  const navigate = useNavigate()

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
          setPonds(response.data.result)
        } else {
          setError(response.data.message || "Không lấy được danh sách hồ cá")
        }
      } catch {
        setError("Có lỗi xảy ra khi lấy danh sách hồ cá.")
      } finally {
        setLoading(false)
      }
    }

    fetchPonds()
  }, [])

  const handleDeletePond = async (id: number) => {
    const token = sessionStorage.getItem("token")
    try {
      const response = await axios.delete(
        `https://consultingfish.azurewebsites.net/api/UserPond/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.data.isSuccess) {
        setPonds((prevPonds) => prevPonds.filter((pond) => pond.id !== id))
      } else {
        alert("Xóa không thành công!")
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi xóa hồ cá.", error)
    }
  }

  const handleUpdatePond = async (updatedPond: Pond) => {
    const token = sessionStorage.getItem("token")
    try {
      const response = await axios.put(
        `https://consultingfish.azurewebsites.net/api/UserPond/update/${updatedPond.id}`,
        {
          pondName: updatedPond.pondName,
          quantity: updatedPond.quantity,
          description: updatedPond.description,
          image: updatedPond.image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.data.isSuccess) {
        setPonds((prevPonds) =>
          prevPonds.map((pond) =>
            pond.id === updatedPond.id ? updatedPond : pond
          )
        )
      } else {
        alert("Cập nhật không thành công!")
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi cập nhật hồ cá.", error)
    }
  }

  const validateName = (name: string, id: number) => {
    return !ponds.some((pond) => pond.pondName === name && pond.id !== id)
  }

  const handleShowMore = () => {
    setVisiblePonds((prev) => prev + 4)
  }

  const handleNavigation = (page: string) => {
    setActiveButton(page)
    if (page === "create") {
      navigate("/create-pond")
    } else if (page === "see-all") {
      navigate("/see-all-pond")
    }
  }

  if (loading) {
    return <p>Đang tải danh sách hồ cá...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="flex min-h-screen flex-col items-center bg-yellow-50 p-10"
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

      <h1 className="mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-4xl text-5xl font-extrabold text-transparent">
        Danh sách hồ cá
      </h1>

      <div className="w-full">
        {ponds.slice(0, visiblePonds).map((pond) => (
          <PondCard
            key={pond.id}
            pond={pond}
            onDelete={handleDeletePond}
            onUpdate={handleUpdatePond}
            validateName={validateName}
          />
        ))}
      </div>
      {visiblePonds < ponds.length && (
        <button
          onClick={handleShowMore}
          className="mt-6 rounded bg-blue-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-400 hover:shadow-xl"
        >
          Xem thêm
        </button>
      )}
    </motion.div>
  )
}

export default SeeAllPond
