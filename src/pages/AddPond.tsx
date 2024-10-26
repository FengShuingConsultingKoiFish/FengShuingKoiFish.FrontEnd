import React, { useEffect, useState } from "react"

import axios from "axios"
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

  // Gọi API để lấy danh sách các loại hồ
  useEffect(() => {
    const fetchPondCharacteristics = async () => {
      const token = sessionStorage.getItem("token")

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
  }, [])

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
      pondId: parseInt(userPondId), // Kiểm tra kỹ trường này trong API
      pondDetails: [{ pondId: selectedPondId }]
    }

    try {
      console.log("Payload gửi đi:", payload) // Debug payload

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
        console.error("Lỗi từ API:", response.data)
        setError(response.data.message || "Có lỗi xảy ra.")
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("Chi tiết lỗi từ API:", err.response.data)
        setError(err.response.data.message || "Có lỗi xảy ra khi thêm hồ.")
      } else {
        console.error("Lỗi không xác định:", err)
        setError("Có lỗi xảy ra khi thêm hồ.")
      }
    }
  }

  return (
    <div className="mb-4">
      <h2 className="mb-2 text-xl font-semibold">Thêm Hồ</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pondCharacteristics.map((pond) => (
          <div
            key={pond.id}
            className={`cursor-pointer rounded border p-4 ${selectedPondId === pond.id ? "border-blue-500" : "border-gray-300"}`}
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

      <button
        type="button"
        className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleSubmit}
      >
        Thêm
      </button>
    </div>
  )
}

export default AddPond
