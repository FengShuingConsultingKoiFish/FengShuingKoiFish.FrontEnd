import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import SelectKoiBreed from "./SelectKoiBreed"

interface KoiBreed {
  id: number
  name: string
}

interface Zodiac {
  id: number
  zodiacName: string
}

const CreateKoiZodiac: React.FC = () => {
  const navigate = useNavigate()
  const [zodiacs, setZodiacs] = useState<Zodiac[]>([])
  const [selectedKoiBreeds, setSelectedKoiBreeds] = useState<KoiBreed[]>([])
  const [selectedZodiac, setSelectedZodiac] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isKoiModalVisible, setIsKoiModalVisible] = useState(false)

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

  const handleAddKoiBreed = (koiBreed: KoiBreed) => {
    const koiBreedCount = selectedKoiBreeds.filter(
      (k) => k.id === koiBreed.id
    ).length

    if (koiBreedCount >= 1) {
      toast.error("Bạn đã lựa chọn giống cá Koi này rồi.")
      return
    }

    setSelectedKoiBreeds((prevBreeds) => [...prevBreeds, koiBreed])
    setIsKoiModalVisible(false)
  }

  const handleRemoveKoiBreed = (koiBreedId: number) => {
    setSelectedKoiBreeds((prevBreeds) =>
      prevBreeds.filter((breed) => breed.id !== koiBreedId)
    )
  }

  const checkExistence = async (): Promise<boolean> => {
    try {
      const response = await axiosClient.get(`/api/Koi/Check-Existence`, {
        params: {
          zodiacId: selectedZodiac,
          koiBreeds: selectedKoiBreeds.map((b) => b.id)
        }
      })
      return response.data.isSuccess
    } catch (error) {
      console.error("Error checking existence:", error)
      return false
    }
  }

  const handleSubmit = async () => {
    if (selectedKoiBreeds.length === 0 || selectedZodiac === null) {
      toast.error("Vui lòng chọn ít nhất một giống cá Koi và Cung Hoàng Đạo")
      return
    }

    const exists = await checkExistence()
    if (exists) {
      toast.error(
        "Cung mệnh này đã tồn tại giống cá Koi này trong mối tương hợp."
      )
      return
    }

    setIsLoading(true)
    try {
      const requests = selectedKoiBreeds.map((koiBreed) =>
        axiosClient.post("/api/Koi/Add-Koi-Zodiac", {
          koiBreedId: koiBreed.id,
          zodiacId: selectedZodiac
        })
      )
      await Promise.all(requests)

      toast.success("Thêm mối tương hợp thành công")
      navigate("/admin/quan-li-menh-tuong-thich/all-zodiac-koi")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm mối tương hợp.")
      console.error("Error adding Koi-Zodiac:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative mx-auto flex w-full max-w-lg flex-col rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">
        Thêm Mối Tương Hợp Cá Koi - Cung Hoàng Đạo
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
        <label className="block font-semibold">
          Danh sách Giống Cá Koi đã chọn
        </label>
        {selectedKoiBreeds.length === 0 ? (
          <p className="text-gray-500">Chưa có giống cá Koi nào được chọn.</p>
        ) : (
          <ul className="space-y-2">
            {selectedKoiBreeds.map((koi) => (
              <li
                key={koi.id}
                className="flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <span>{koi.name}</span>
                <button
                  onClick={() => handleRemoveKoiBreed(koi.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        )}
        <CustomButton
          label="Chọn giống cá Koi khác"
          onClick={() => setIsKoiModalVisible(true)}
        />
      </div>

      <CustomButton
        label="Xác nhận"
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={
          isLoading || selectedKoiBreeds.length === 0 || selectedZodiac === null
        }
      />

      {isKoiModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold">Chọn Giống Cá Koi</h3>
            <SelectKoiBreed
              onSelectKoi={(koiBreed) => {
                handleAddKoiBreed(koiBreed)
              }}
            />
            <CustomButton
              label="Đóng"
              onClick={() => setIsKoiModalVisible(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateKoiZodiac
