import React, { useEffect, useState } from "react"

import axios from "axios"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"

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
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Fetch pond characteristics and validate token
  useEffect(() => {
    const token = sessionStorage.getItem("token")

    // Redirect to login if token is missing
    if (!token) {
      navigate("/") // Redirects to login page
      return
    }

    const fetchPondCharacteristics = async () => {
      try {
        const response = await axios.get(
          "https://consultingfish.azurewebsites.net/api/Pond/Get-All-PondCharacteristics",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userPondId) {
      setError("UserPond ID không hợp lệ.")
      return
    }

    if (selectedPondId === null) {
      setError("Vui lòng chọn một loại hồ trước khi thêm.")
      return
    }

    const token = sessionStorage.getItem("token")
    const payload = {
      pondId: parseInt(userPondId),
      pondDetails: [{ pondId: selectedPondId }]
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
        setError(err.response.data.message || "Có lỗi xảy ra khi thêm hồ.")
      } else {
        setError("Có lỗi xảy ra khi thêm hồ.")
      }
    }
  }

  // Filter pond characteristics based on search term
  const filteredPondCharacteristics = pondCharacteristics.filter((pond) =>
    pond.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <h2 className="mb-6 text-center text-2xl font-semibold">Thêm Hồ</h2>
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Tìm kiếm loại hồ..."
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

      {/* Pond Characteristics List */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPondCharacteristics.map((pond) => (
          <div
            key={pond.id}
            className={`cursor-pointer rounded border p-4 ${
              selectedPondId === pond.id ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedPondId(pond.id)}
          >
            <img
              src={pond.image}
              alt={pond.name}
              className="h-32 w-full rounded object-cover"
            />
            <h3 className="text-lg font-bold">{pond.name}</h3>
            <p>Mô tả: {pond.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddPond
