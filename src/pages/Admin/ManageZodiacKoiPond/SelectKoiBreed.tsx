import React, { useEffect, useState } from "react"

import { axiosClient } from "@/lib/api/config/axios-client"

interface KoiBreed {
  id: number
  name: string
  description: string
  image: string
  koiCategoryId: number
}

interface KoiCategory {
  id: number
  name: string
}

interface SelectKoiBreedProps {
  onSelectKoi: (koiBreed: KoiBreed) => void
}

const SelectKoiBreed: React.FC<SelectKoiBreedProps> = ({ onSelectKoi }) => {
  const [koiBreeds, setKoiBreeds] = useState<KoiBreed[]>([])
  const [koiCategories, setKoiCategories] = useState<KoiCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchKoiCategories = async () => {
      try {
        const response = await axiosClient.get("/api/Koi/Get-All-KoiCategories")
        if (response.data.isSuccess) {
          setKoiCategories(response.data.result)
        }
      } catch (error) {
        console.error("Error fetching koi categories:", error)
      }
    }

    const fetchKoiBreeds = async () => {
      setIsLoading(true)
      try {
        const response = await axiosClient.get("/api/Koi/Get-All-KoiBreeds")
        if (response.data.isSuccess) {
          setKoiBreeds(response.data.result)
        }
      } catch (error) {
        console.error("Error fetching koi breeds:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchKoiCategories()
    fetchKoiBreeds()
  }, [])

  const filteredKoiBreeds = koiBreeds.filter((koi) => {
    const matchesCategory = selectedCategory
      ? koi.koiCategoryId === selectedCategory
      : true
    const matchesSearch = koi.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <select
          className="w-1/3 rounded-md border border-gray-300 p-2"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
        >
          <option value="">-- Tất cả các loại cá Koi --</option>
          {koiCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tìm theo tên cá Koi"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-2/3 rounded-md border border-gray-300 p-2"
        />
      </div>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : filteredKoiBreeds.length === 0 ? (
        <p>Không có giống cá nào</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filteredKoiBreeds.map((koi) => (
            <div
              key={koi.id}
              className="relative transform cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-transform hover:scale-105"
              onClick={() => onSelectKoi(koi)}
            >
              <p className="text-xl font-semibold">{koi.name}</p>
              <p className="text-gray-600">Loại: {koi.koiCategoryId}</p>
              {koi.image && (
                <img
                  src={koi.image}
                  alt={koi.name}
                  className="mt-2 h-32 w-full rounded object-cover"
                />
              )}
              <p className="text-gray-500">{koi.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectKoiBreed
