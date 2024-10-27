import React, { useEffect, useState } from "react"

import axios from "axios"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"

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
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    const token = sessionStorage.getItem("token")

    // Check if the token exists; if not, redirect to the login page
    if (!token) {
      navigate("/") // Redirects to login or home page if not authenticated
      return
    }

    const fetchKoiBreeds = async () => {
      try {
        const response = await axios.get(
          "https://consultingfish.azurewebsites.net/api/Koi/Get-All-KoiBreeds",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userPondId) {
      setError("UserPond ID không hợp lệ.")
      return
    }

    if (selectedKoiId === null) {
      setError("Vui lòng chọn một giống Koi trước khi thêm.")
      return
    }

    const token = sessionStorage.getItem("token")
    const payload = {
      pondId: parseInt(userPondId), // Ensure pondId is an integer
      koiDetails: [{ koiBreedId: selectedKoiId }]
    }

    try {
      const response = await axios.post(
        "https://consultingfish.azurewebsites.net/api/UserPond/adddetails",
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
        console.error("Chi tiết lỗi từ API:", err.response.data)
        setError(err.response.data.message || "Có lỗi xảy ra khi thêm Koi.")
      } else {
        console.error("Lỗi không xác định:", err)
        setError("Có lỗi xảy ra khi thêm Koi.")
      }
    }
  }

  // Filter Koi list based on search term
  const filteredKoiBreeds = koiBreeds.filter((koi) =>
    koi.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative mb-4 p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/pond-details/${userPondId}`)}
        className="absolute left-4 top-4 text-gray-600 hover:text-gray-800"
      >
        <FaArrowLeft className="text-2xl" />
      </button>

      {/* Title */}
      <h2 className="mb-6 text-center text-2xl font-semibold">Danh sách Koi</h2>
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Tìm kiếm giống Koi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add Button */}
      <button
        type="button"
        className="absolute right-4 top-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleSubmit}
      >
        Thêm
      </button>

      {/* Koi Breeds List */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredKoiBreeds.map((koi) => (
          <div
            key={koi.id}
            className={`cursor-pointer rounded border p-4 ${
              selectedKoiId === koi.id ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedKoiId(koi.id)}
          >
            <img
              src={koi.image}
              alt={koi.name}
              className="h-32 w-full rounded object-cover"
            />
            <h3 className="text-lg font-bold">{koi.name}</h3>
            <p>Màu sắc: {koi.colors}</p>
            <p>Hoa văn: {koi.pattern}</p>
            <p>Mô tả: {koi.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddKoi
