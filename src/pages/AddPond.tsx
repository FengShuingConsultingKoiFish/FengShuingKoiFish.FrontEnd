import React, { useEffect, useRef, useState } from "react"

import toast from "react-hot-toast"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import OnclickButton from "@/components/global/atoms/OnclickButton"

interface PondCharacteristic {
  id: number
  pondCategoryId: number
  name: string
  description: string
  image: string
}

interface PondCategory {
  id: number
  name: string
}

const AddPond: React.FC = () => {
  const { userPondId } = useParams<{ userPondId: string }>()
  const navigate = useNavigate()

  const [pondCharacteristics, setPondCharacteristics] = useState<
    PondCharacteristic[]
  >([])
  const [pondCategories, setPondCategories] = useState<PondCategory[]>([])
  const [selectedPondId, setSelectedPondId] = useState<number | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [visibleItems, setVisibleItems] = useState<number>(6)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const fetchPondCharacteristics = async () => {
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCharacteristics"
        )
        if (response.data.isSuccess) {
          setPondCharacteristics(response.data.result)
        } else {
          setError("Không thể tải danh sách hồ.")
        }
      } catch (err) {
        console.error(err)
        setError("Có lỗi xảy ra khi tải danh sách hồ.")
      }
    }

    const fetchPondCategories = async () => {
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCategories"
        )
        if (response.data.isSuccess) {
          setPondCategories(response.data.result)
        } else {
          setError("Không thể tải danh sách loại hồ.")
        }
      } catch (err) {
        console.error(err)
        setError("Có lỗi xảy ra khi tải danh sách loại hồ.")
      }
    }

    fetchPondCharacteristics()
    fetchPondCategories()
  }, [navigate])

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectedPondId !== null &&
      cardRefs.current[selectedPondId] &&
      !cardRefs.current[selectedPondId]?.contains(event.target as Node)
    ) {
      setSelectedPondId(null)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedPondId])

  const handleSubmit = async (pondId: number) => {
    if (!userPondId) {
      setError("UserPond ID không hợp lệ.")
      return
    }
    setLoading(true)
    const payload = {
      pondId: parseInt(userPondId),
      pondDetails: [{ pondId }]
    }

    try {
      const response = await axiosClient.post(
        "/api/UserPond/adddetails",
        payload
      )
      if (response.data.isSuccess) {
        toast.success("Thêm loại Hồ thành công!")
        navigate(`/pond-details/${userPondId}`)
      } else {
        setError(response.data.message || "Có lỗi xảy ra.")
      }
    } catch (err) {
      console.error("Error while adding pond details:", err)
      setError("Có lỗi xảy ra khi thêm hồ.")
    } finally {
      setLoading(false)
    }
  }

  const filteredPondCharacteristics = pondCharacteristics
    .filter((pond) =>
      pond.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (pond) =>
        !selectedCategoryId || pond.pondCategoryId === selectedCategoryId
    )

  const visiblePonds = filteredPondCharacteristics.slice(0, visibleItems)

  const handleShowMore = () => {
    setVisibleItems((prev) => prev + 6)
  }

  const getPondCategoryName = (pondCategoryId: number) => {
    const category = pondCategories.find((cat) => cat.id === pondCategoryId)
    return category ? category.name : "Không xác định"
  }

  return (
    <div className="relative mb-4 p-4">
      <button
        onClick={() => navigate(`/pond-details/${userPondId}`)}
        className="absolute left-4 top-4 text-gray-600 hover:text-gray-800"
      >
        <FaArrowLeft className="text-2xl" />
      </button>

      <h2 className="mb-6 text-center text-2xl font-semibold">Danh sách Hồ</h2>
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mb-4 flex justify-center space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm loại hồ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedCategoryId || ""}
          onChange={(e) =>
            setSelectedCategoryId(
              e.target.value ? parseInt(e.target.value) : null
            )
          }
          className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả loại hồ</option>
          {pondCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {filteredPondCharacteristics.length === 0 ? (
        <p className="text-center text-gray-500">Không có hồ nào.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {visiblePonds.map((pond) => (
            <div
              key={pond.id}
              ref={(el) => (cardRefs.current[pond.id] = el)}
              className={`relative flex cursor-pointer rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg ${
                selectedPondId === pond.id
                  ? "scale-105 border-blue-500 shadow-lg"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedPondId(pond.id)} // Khi click vào card sẽ thay đổi selectedPondId
            >
              {/* Khi card được chọn, hiển thị lớp phủ màu xám */}
              {selectedPondId === pond.id && (
                <div className="absolute inset-0 rounded-lg bg-black bg-opacity-30"></div>
              )}

              {/* Left Side Image */}
              <div className="h-48 w-1/4 overflow-hidden rounded-l-lg">
                <img
                  src={pond.image || "https://via.placeholder.com/150"}
                  alt={pond.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Right Side Content */}
              <div className="relative flex w-3/4 flex-col p-4">
                <div className="flex-grow overflow-hidden">
                  <h3 className="text-xl font-semibold">{pond.name}</h3>
                  <p className="text-gray-500">
                    Loại Hồ: {getPondCategoryName(pond.pondCategoryId)}
                  </p>
                  <p className="mt-2 break-words text-sm text-gray-700">
                    Mô tả: {pond.description}
                  </p>
                </div>

                {/* Add button (only shows when card is selected) */}
                {selectedPondId === pond.id && (
                  <div className="absolute bottom-4 right-4 flex justify-center">
                    <OnclickButton
                      label={loading ? "Đang xử lý..." : "Thêm"}
                      onClick={() => handleSubmit(pond.id)}
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleItems < filteredPondCharacteristics.length && (
        <div className="flex justify-center">
          <OnclickButton label="Xem Thêm" onClick={handleShowMore} />
        </div>
      )}
    </div>
  )
}

export default AddPond
