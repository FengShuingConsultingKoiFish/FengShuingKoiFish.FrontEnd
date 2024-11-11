import React, { useEffect, useRef, useState } from "react"

import axios from "axios"
import toast from "react-hot-toast"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import OnclickButton from "@/components/global/atoms/OnclickButton"

interface KoiBreed {
  id: number
  name: string
  colors: string
  pattern: string
  description: string
  image: string
  koiCategoryId: number
}

interface KoiCategory {
  id: number
  name: string
}

const AddKoi: React.FC = () => {
  const { userPondId } = useParams<{ userPondId: string }>()
  const navigate = useNavigate()

  const [koiBreeds, setKoiBreeds] = useState<KoiBreed[]>([])
  const [koiCategories, setKoiCategories] = useState<KoiCategory[]>([])
  const [selectedKoiId, setSelectedKoiId] = useState<number | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [visibleItems, setVisibleItems] = useState<number>(6)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const fetchKoiBreeds = async () => {
      try {
        const response = await axiosClient.get("/api/Koi/Get-All-KoiBreeds")
        if (response.data.isSuccess) {
          setKoiBreeds(response.data.result)
        } else {
          setError("Không thể tải danh sách cá.")
        }
      } catch (err) {
        console.error(err)
        setError("Có lỗi xảy ra khi tải danh sách cá.")
      }
    }

    const fetchKoiCategories = async () => {
      try {
        const response = await axiosClient.get("/api/Koi/Get-All-KoiCategories")
        if (response.data.isSuccess) {
          setKoiCategories(response.data.result)
        } else {
          setError("Không thể tải danh sách loại cá.")
        }
      } catch (err) {
        console.error(err)
        setError("Có lỗi xảy ra khi tải danh sách loại cá.")
      }
    }

    fetchKoiBreeds()
    fetchKoiCategories()
  }, [navigate])

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectedKoiId !== null &&
      cardRefs.current[selectedKoiId] &&
      !cardRefs.current[selectedKoiId]?.contains(event.target as Node)
    ) {
      setSelectedKoiId(null)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedKoiId])

  const handleSubmit = async (koiBreedId: number) => {
    if (!userPondId) {
      setError("UserPond ID không hợp lệ.")
      return
    }
    setLoading(true)
    const payload = {
      pondId: parseInt(userPondId),
      koiDetails: [{ koiBreedId }]
    }

    try {
      const response = await axiosClient.post(
        "/api/UserPond/adddetails",
        payload
      )
      if (response.data.isSuccess) {
        toast.success("Thêm Koi thành công!")
        navigate(`/pond-details/${userPondId}`)
      } else {
        setError(response.data.message || "Có lỗi xảy ra.")
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("Chi tiết lỗi từ API:", err.response.data)
        setError(err.response.data.message || "Có lỗi xảy ra khi thêm Koi.")
      } else {
        setError("Có lỗi xảy ra khi thêm Koi.")
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredKoiBreeds = koiBreeds
    .filter((koi) => koi.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(
      (koi) => !selectedCategoryId || koi.koiCategoryId === selectedCategoryId
    )
    .slice(0, visibleItems)

  const handleShowMore = () => {
    setVisibleItems((prev) => prev + 6)
  }

  const getCategoryName = (categoryId: number) => {
    const category = koiCategories.find((cat) => cat.id === categoryId)
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

      <h2 className="mb-6 text-center text-2xl font-semibold">Danh sách Koi</h2>
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mb-4 flex justify-center space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm giống Koi..."
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
          <option value="">Tất cả loại Koi</option>
          {koiCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filteredKoiBreeds.map((koi) => (
          <div
            key={koi.id}
            ref={(el) => (cardRefs.current[koi.id] = el)}
            className={`relative flex rounded-lg border border-gray-200 bg-white shadow-md transition-all ${
              selectedKoiId === koi.id
                ? "scale-105 border-blue-500 shadow-lg"
                : "border-gray-300"
            } cursor-pointer hover:scale-105 hover:shadow-lg`}
            onClick={() => setSelectedKoiId(koi.id)} // Khi click vào card sẽ thay đổi selectedKoiId
          >
            {/* Khi card được chọn, hiển thị lớp phủ màu xám */}
            {selectedKoiId === koi.id && (
              <div className="absolute inset-0 rounded-lg bg-black bg-opacity-30"></div>
            )}

            {/* Left Side Image */}
            <div className="h-48 w-1/4 overflow-hidden rounded-l-lg">
              <img
                src={koi.image || "https://via.placeholder.com/150"}
                alt={koi.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Right Side Content */}
            <div className="relative flex w-3/4 flex-col p-4">
              <div className="flex-grow overflow-hidden">
                <h3 className="break-words text-xl font-semibold">
                  {koi.name}
                </h3>
                <p className="text-gray-500">
                  Loại Koi: {getCategoryName(koi.koiCategoryId)}
                </p>
                <p className="text-gray-500">Màu sắc: {koi.colors}</p>
                <p className="text-gray-500">Hoa văn: {koi.pattern}</p>
                <p className="mt-2 break-words text-sm text-gray-700">
                  Mô tả: {koi.description}
                </p>
              </div>

              {/* Add button (only shows when card is selected) */}
              {selectedKoiId === koi.id && (
                <div className="absolute bottom-4 right-4 flex justify-center">
                  <OnclickButton
                    label={loading ? "Đang thêm..." : "Thêm"}
                    onClick={() => handleSubmit(koi.id)}
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleItems < koiBreeds.length && (
        <div className="flex justify-center">
          <OnclickButton label="Xem Thêm" onClick={handleShowMore} />
        </div>
      )}
    </div>
  )
}

export default AddKoi
