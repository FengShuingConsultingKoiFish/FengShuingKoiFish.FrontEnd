import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import SelectPond from "./SelectPond"

interface PondCharacteristic {
  id: number
  name: string
}

interface Zodiac {
  id: number
  zodiacName: string
}

const CreatePondZodiac: React.FC = () => {
  const navigate = useNavigate()
  const [zodiacs, setZodiacs] = useState<Zodiac[]>([])
  const [selectedPonds, setSelectedPonds] = useState<PondCharacteristic[]>([])
  const [selectedZodiac, setSelectedZodiac] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPondModalVisible, setIsPondModalVisible] = useState(false)

  useEffect(() => {
    const fetchZodiacs = async () => {
      try {
        const response = await axiosClient.get("/api/Zodiac/Get-All-Zodiac")
        if (response.data.isSuccess) {
          setZodiacs(response.data.result)
        }
      } catch (error) {
        console.error("Error fetching zodiacs:", error)
      }
    }
    fetchZodiacs()
  }, [])

  const handleAddPond = (pond: PondCharacteristic) => {
    const pondCount = selectedPonds.filter((p) => p.id === pond.id).length

    if (pondCount >= 1) {
      toast.error("Bạn đã lựa chọn hồ này rồi.")
      return
    }

    setSelectedPonds((prevPonds) => [...prevPonds, pond])
    setIsPondModalVisible(false)
  }

  const handleRemovePond = (pondId: number) => {
    setSelectedPonds((prevPonds) =>
      prevPonds.filter((pond) => pond.id !== pondId)
    )
  }

  const handleSubmit = async () => {
    if (selectedPonds.length === 0 || selectedZodiac === null) {
      toast.error("Vui lòng chọn ít nhất một Hồ và Cung Hoàng Đạo")
      return
    }

    setIsLoading(true)
    try {
      const requests = selectedPonds.map((pond) =>
        axiosClient.post("/api/Pond/Add-Pond-Zodiac", {
          pondId: pond.id,
          zodiacId: selectedZodiac
        })
      )
      await Promise.all(requests)

      toast.success("Thêm mối tương hợp thành công")
      navigate("/admin/quan-li-menh-tuong-thich/all-zodiac-pond")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm mối tương hợp.")
      console.error("Error adding Pond-Zodiac:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative mx-auto flex w-full max-w-lg flex-col rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">
        Thêm Mối Tương Hợp Hồ - Cung Hoàng Đạo
      </h2>

      <div className="mb-4">
        <label htmlFor="zodiacId" className="block font-semibold">
          Chọn Cung Hoàng Đạo
        </label>
        <select
          id="zodiacId"
          value={selectedZodiac || ""}
          onChange={(e) => setSelectedZodiac(Number(e.target.value))}
          className="w-full rounded-md border border-neutral-300 p-2"
        >
          <option value="">-- Chọn Cung Hoàng Đạo --</option>
          {zodiacs.map((zodiac) => (
            <option key={zodiac.id} value={zodiac.id}>
              {zodiac.zodiacName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Danh sách Hồ đã chọn</label>
        {selectedPonds.length === 0 ? (
          <p className="text-gray-500">Chưa có hồ nào được chọn.</p>
        ) : (
          <ul className="space-y-2">
            {selectedPonds.map((pond) => (
              <li
                key={pond.id}
                className="flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <span>{pond.name}</span>
                <button
                  onClick={() => handleRemovePond(pond.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        )}
        <CustomButton
          label="Chọn hồ khác"
          onClick={() => setIsPondModalVisible(true)}
        />
      </div>

      <CustomButton
        label="Xác nhận"
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={
          isLoading || selectedPonds.length === 0 || selectedZodiac === null
        }
      />

      {isPondModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold">Chọn Hồ</h3>
            <SelectPond
              onSelectPond={(pond) => {
                handleAddPond(pond)
              }}
            />
            <CustomButton
              label="Đóng"
              onClick={() => setIsPondModalVisible(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatePondZodiac
