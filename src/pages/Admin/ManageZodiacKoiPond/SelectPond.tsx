import React, { useEffect, useState } from "react"

import { axiosClient } from "@/lib/api/config/axios-client"

interface PondCharacteristic {
  id: number
  name: string
  description: string
  image: string
  pondCategoryId: number
}

interface PondCategory {
  id: number
  name: string
}

interface SelectPondProps {
  onSelectPond: (pond: PondCharacteristic) => void
}

const SelectPond: React.FC<SelectPondProps> = ({ onSelectPond }) => {
  const [ponds, setPonds] = useState<PondCharacteristic[]>([])
  const [pondCategories, setPondCategories] = useState<PondCategory[]>([])
  const [filteredPonds, setFilteredPonds] = useState<PondCharacteristic[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPondCategories = async () => {
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCategories"
        )
        if (response.data.isSuccess) {
          setPondCategories(response.data.result)
        } else {
          console.error("Failed to fetch pond categories.")
        }
      } catch (error) {
        console.error("Error fetching pond categories:", error)
      }
    }

    const fetchPonds = async () => {
      setIsLoading(true)
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCharacteristics"
        )
        if (response.data.isSuccess) {
          setPonds(response.data.result)
          setFilteredPonds(response.data.result)
        } else {
          console.error(response.data.message)
        }
      } catch (error) {
        console.error("Error fetching ponds:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPondCategories()
    fetchPonds()
  }, [])

  useEffect(() => {
    const filtered = ponds.filter((pond) => {
      const matchesCategory = selectedCategory
        ? pond.pondCategoryId === selectedCategory
        : true
      const matchesSearch = pond.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    setFilteredPonds(filtered)
  }, [selectedCategory, searchTerm, ponds])

  const getCategoryNameById = (categoryId: number) => {
    const category = pondCategories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  return (
    <div className="p-4">
      <h3 className="mb-4 text-xl font-bold">Danh sách các loại hồ</h3>

      {/* Bộ lọc theo loại hồ và tìm kiếm */}
      <div className="mb-4 flex gap-4">
        <select
          className="w-1/3 rounded-md border border-gray-300 p-2"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
        >
          <option value="">-- Tất cả các loại hồ --</option>
          {pondCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tìm theo tên hồ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-2/3 rounded-md border border-gray-300 p-2"
        />
      </div>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : filteredPonds.length === 0 ? (
        <p>Không có loại hồ nào</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filteredPonds.map((pond) => (
            <div
              key={pond.id}
              className="relative transform cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-transform hover:scale-105"
              onClick={() => onSelectPond(pond)}
            >
              <div className="flex flex-col gap-3">
                <p className="text-xl font-semibold">Tên hồ: {pond.name}</p>
                <p>Loại hồ: {getCategoryNameById(pond.pondCategoryId)}</p>
                <p>Mô tả: {pond.description}</p>
                {pond.image && (
                  <img
                    src={pond.image}
                    alt={pond.name}
                    className="mt-2 h-32 w-full rounded object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectPond
