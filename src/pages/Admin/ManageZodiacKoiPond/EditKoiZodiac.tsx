import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import axios from "axios"
import toast from "react-hot-toast"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import SelectKoiBreed from "./SelectKoiBreed"

interface KoiBreed {
  id: number
  name: string
}

interface ZodiacGroup {
  zodiacId: number
  koiBreeds: KoiBreed[]
}
interface KoiZodiacItem {
  zodiacId: number
  koiBreedId: number
  koiBreed?: {
    name: string
  }
}

const EditKoiZodiac: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [groupedZodiacData, setGroupedZodiacData] = useState<ZodiacGroup[]>([])
  const [allZodiacs, setAllZodiacs] = useState<number[]>([])
  const [selectedZodiac, setSelectedZodiac] = useState<number | null>(null)
  const [selectedKoiBreeds, setSelectedKoiBreeds] = useState<KoiBreed[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isKoiModalVisible, setIsKoiModalVisible] = useState(false)
  const location = useLocation()
  const { zodiacId } = useParams()
  const { zodiacName, koiBreeds } = location.state || {}

  console.log("Zodiac ID:", zodiacId)
  console.log("Zodiac Name:", zodiacName)
  console.log("Koi Breeds:", koiBreeds)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [zodiacResponse, koiZodiacResponse] = await Promise.all([
          axios.get("/api/Zodiac/Get-All-Zodiac"),
          axios.get("/api/Koi/Get-Koi-Zodiac-All")
        ])

        if (zodiacResponse.data.isSuccess) {
          const allZodiacs = zodiacResponse.data.result.map(
            (z: { id: number }) => z.id
          )
          setAllZodiacs(allZodiacs)
        }

        if (koiZodiacResponse.data.isSuccess) {
          const data: KoiZodiacItem[] = koiZodiacResponse.data.result
          console.log("API data:", data)

          const groupedData: ZodiacGroup[] = []
          data.forEach((item) => {
            const existingGroup = groupedData.find(
              (group) => group.zodiacId === item.zodiacId
            )
            const koiBreed: KoiBreed = {
              id: item.koiBreedId,
              name: item.koiBreed?.name || `Koi ${item.koiBreedId}`
            }

            if (existingGroup) {
              existingGroup.koiBreeds.push(koiBreed)
            } else {
              groupedData.push({
                zodiacId: item.zodiacId,
                koiBreeds: [koiBreed]
              })
            }
          })

          console.log("Grouped Data:", groupedData)
          setGroupedZodiacData(groupedData)

          setSelectedZodiac(Number(id))
          const initialGroup = groupedData.find(
            (group) => group.zodiacId === Number(id)
          )
          setSelectedKoiBreeds(initialGroup ? initialGroup.koiBreeds : [])
          console.log("Initial selected Zodiac and Koi Breeds:", initialGroup)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchInitialData()
  }, [id])

  const handleAddKoiBreed = (koiBreed: KoiBreed) => {
    if (selectedKoiBreeds.some((k) => k.id === koiBreed.id)) {
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

  const handleSubmit = async () => {
    if (!selectedZodiac || selectedKoiBreeds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một giống cá Koi và Cung Hoàng Đạo")
      return
    }

    setIsLoading(true)
    try {
      console.log("Submitting data:", {
        zodiacId: selectedZodiac,
        koiBreeds: selectedKoiBreeds.map((k) => k.id)
      })
      const response = await axios.put(`/api/Koi/Update-Koi-Zodiac/${id}`, {
        zodiacId: selectedZodiac,
        koiBreeds: selectedKoiBreeds.map((k) => k.id)
      })

      if (response.data.isSuccess) {
        toast.success("Cập nhật mối tương hợp thành công")
        navigate("/admin/quan-li-menh-tuong-thich/all-zodiac-koi")
      } else {
        console.error("Error updating Koi-Zodiac:", response.data.message)
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật mối tương hợp.")
      console.error("Error updating Koi-Zodiac:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative mx-auto flex w-full max-w-lg flex-col rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">
        Chỉnh sửa Mối Tương Hợp Cá Koi - Cung Hoàng Đạo
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
          {allZodiacs.map((zodiacId) => (
            <option key={zodiacId} value={zodiacId}>
              Zodiac {zodiacId}
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
        label="Cập nhật"
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={
          isLoading || !selectedZodiac || selectedKoiBreeds.length === 0
        }
      />

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Dữ liệu nhóm:</h3>
        {groupedZodiacData.map((group) => (
          <div key={group.zodiacId} className="mb-4">
            <h4>Zodiac ID: {group.zodiacId}</h4>
            <ul>
              {group.koiBreeds.map((breed) => (
                <li key={breed.id}>{breed.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {isKoiModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold">Chọn Giống Cá Koi</h3>
            <SelectKoiBreed
              onSelectKoi={(koiBreed) => handleAddKoiBreed(koiBreed)}
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

export default EditKoiZodiac
