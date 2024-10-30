import React, { useEffect, useState } from "react"

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
}

const AddKoi: React.FC = () => {
  const { userPondId } = useParams<{ userPondId: string }>()
  const navigate = useNavigate()

  const [koiBreeds, setKoiBreeds] = useState<KoiBreed[]>([])
  const [selectedKoiId, setSelectedKoiId] = useState<number | null>(null)
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

    const fetchKoiBreeds = async () => {
      try {
        const response = await axiosClient.get("/api/Koi/Get-All-KoiBreeds", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

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

    fetchKoiBreeds()
  }, [navigate])

  const handleSubmit = async (koiBreedId: number) => {
    if (!userPondId) {
      setError("UserPond ID không hợp lệ.")
      return
    }
    setLoading(true)
    const token = sessionStorage.getItem("token")
    const payload = {
      pondId: parseInt(userPondId),
      koiDetails: [{ koiBreedId }]
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
    .slice(0, visibleItems)

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

      <h2 className="mb-6 text-center text-2xl font-semibold">Danh sách Koi</h2>
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Tìm kiếm giống Koi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredKoiBreeds.map((koi, index) => (
          <div
            key={koi.id}
            className={`relative transform cursor-pointer rounded border p-4 transition-all hover:scale-105 hover:shadow-lg ${
              selectedKoiId === koi.id
                ? "scale-105 border-blue-500 shadow-lg"
                : "border-gray-300"
            } ${
              index % 3 === 0
                ? "bg-yellow-100"
                : index % 3 === 1
                  ? "bg-green-100"
                  : "bg-blue-100"
            }`}
            onClick={() => setSelectedKoiId(koi.id)}
          >
            {selectedKoiId === koi.id && (
              <div className="pointer-events-none absolute inset-0 rounded bg-black bg-opacity-30"></div>
            )}
            <img
              src={koi.image}
              alt={koi.name}
              className="h-32 w-full rounded object-cover"
            />
            <h3 className="text-lg font-bold">{koi.name}</h3>
            <p>Màu sắc: {koi.colors}</p>
            <p>Hoa văn: {koi.pattern}</p>
            <p>Mô tả: {koi.description}</p>

            {selectedKoiId === koi.id && (
              <div className="mt-2 flex justify-center">
                <OnclickButton
                  label={loading ? "Đang thêm..." : "Thêm"}
                  onClick={() => handleSubmit(koi.id)}
                  disabled={loading}
                />
              </div>
            )}
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
