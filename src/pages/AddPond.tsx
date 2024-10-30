import React, { useEffect, useState } from "react"

import axios from "axios"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import OnclickButton from "@/components/global/atoms/OnclickButton"

// Đảm bảo bạn đã import axiosClient

interface PondCharacteristic {
  id: number
  name: string
  description: string
  image: string
}

const AddPond: React.FC = () => {
  const { userPondId } = useParams<{ userPondId: string }>()
  const navigate = useNavigate()

  const [pondCharacteristics, setPondCharacteristics] = useState<
    PondCharacteristic[]
  >([])
  const [selectedPondId, setSelectedPondId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [visibleItems, setVisibleItems] = useState<number>(6)

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    if (!token) {
      navigate("/")
      return
    }

    const fetchPondCharacteristics = async () => {
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCharacteristics",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
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

    fetchPondCharacteristics()
  }, [navigate])

  const handleSubmit = async (pondId: number) => {
    if (!userPondId) {
      setError("UserPond ID không hợp lệ.")
      return
    }
    setLoading(true)
    const token = sessionStorage.getItem("token")
    const payload = {
      pondId: parseInt(userPondId),
      pondDetails: [{ pondId }]
    }

    try {
      const response = await axiosClient.post(
        "/api/UserPond/adddetails",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (response.data.isSuccess) {
        navigate(`/pond-details/${userPondId}`)
      } else {
        setError(response.data.message || "Có lỗi xảy ra.")
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Có lỗi xảy ra khi thêm hồ.")
      } else {
        setError("Có lỗi xảy ra khi thêm hồ.")
      }
    } finally {
      setLoading(false) // Kết thúc loading
    }
  }

  const filteredPondCharacteristics = pondCharacteristics.filter((pond) =>
    pond.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const visiblePonds = filteredPondCharacteristics.slice(0, visibleItems)

  const handleShowMore = () => {
    setVisibleItems((prev) => prev + 6)
  }

  return (
    <div className="relative mb-4 p-4">
      <button
        onClick={() => navigate(`/pond-details/${userPondId}`)}
        className="absolute left-4 top-4 text-gray-600 hover:text-gray-800"
      >
        <FaArrowLeft className="text-2xl" />
      </button>

      <h2 className="mb-6 text-center text-2xl font-semibold">Thêm Hồ</h2>
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Tìm kiếm loại hồ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visiblePonds.map((pond, index) => (
          <div
            key={pond.id}
            className={`relative transform cursor-pointer rounded border p-4 transition-all hover:scale-105 hover:shadow-lg ${
              selectedPondId === pond.id
                ? "scale-105 border-blue-500 shadow-lg"
                : "border-gray-300"
            } ${
              index % 3 === 0
                ? "bg-yellow-100"
                : index % 3 === 1
                  ? "bg-green-100"
                  : "bg-blue-100"
            }`}
            onClick={() => setSelectedPondId(pond.id)}
          >
            {selectedPondId === pond.id && (
              <div className="pointer-events-none absolute inset-0 rounded bg-black bg-opacity-30"></div>
            )}
            <img
              src={pond.image}
              alt={pond.name}
              className="h-32 w-full rounded object-cover"
            />
            <h3 className="text-lg font-bold">{pond.name}</h3>
            <p>Mô tả: {pond.description}</p>

            {selectedPondId === pond.id && (
              <div className="mt-2 flex justify-center">
                <OnclickButton
                  label={loading ? "Đang xử lý..." : "Thêm"} // Đổi label khi loading
                  onClick={() => handleSubmit(pond.id)}
                  disabled={loading} // Vô hiệu hóa nút khi loading
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {visibleItems < filteredPondCharacteristics.length && (
        <div className="flex justify-center">
          <OnclickButton label="Xem Thêm" onClick={handleShowMore} />
        </div>
      )}
    </div>
  )
}

export default AddPond
