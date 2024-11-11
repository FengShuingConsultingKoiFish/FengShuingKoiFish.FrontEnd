import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

const EditPondZodiac = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const id = query.get("id") // Lấy id từ URL

  const [zodiacData, setZodiacData] = useState({
    zodiacName: "",
    ponds: []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (id) {
      const fetchZodiacData = async () => {
        try {
          const response = await axiosClient.get(
            `/api/Pond/Get-Pond-Zodiac/${id}`
          )
          if (response.data.isSuccess) {
            setZodiacData(response.data.result)
          } else {
            console.error("Error fetching zodiac data:", response.data.message)
          }
        } catch (error) {
          console.error("Error fetching zodiac data:", error)
        }
      }

      fetchZodiacData()
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setZodiacData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleUpdateZodiac = async () => {
    setIsLoading(true)
    try {
      const response = await axiosClient.put(
        `/api/Pond/Update-Pond-Zodiac/${id}`,
        zodiacData
      )
      if (response.data.isSuccess) {
        toast.success("Cập nhật thành công!")
        navigate("/GetAllPondZodiac") // Quay lại trang danh sách sau khi cập nhật thành công
      } else {
        toast.error("Cập nhật thất bại.")
        console.error("Update failed:", response.data.message)
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật.")
      console.error("Error updating pond zodiac:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">Chỉnh sửa Pond Zodiac</h2>

      <label className="font-semibold">Tên Cung Mệnh:</label>
      <input
        type="text"
        name="zodiacName"
        value={zodiacData.zodiacName}
        onChange={handleInputChange}
        className="mb-4 w-full rounded border border-gray-300 p-2"
      />

      <div className="flex gap-4">
        <CustomButton
          label="Cập nhật"
          onClick={handleUpdateZodiac}
          disabled={isLoading}
        />
        <CustomButton
          label="Quay lại"
          onClick={() => navigate("/GetAllPondZodiac")}
        />
      </div>
    </div>
  )
}

export default EditPondZodiac
