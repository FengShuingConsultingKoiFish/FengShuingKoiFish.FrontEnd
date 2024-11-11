import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import toast from "react-hot-toast"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"
import { useNavigate } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import ConfirmModal from "@/components/global/atoms/ConfirmModal"

interface KoiBreed {
  id: number
  name: string
  colors: string
  pattern: string
  description: string
  image: string
  koiCategoryId: number
}

interface KoiCategory {
  id: number
  name: string
}

const GetAllKoi: React.FC = () => {
  const navigate = useNavigate()
  const [koiBreeds, setKoiBreeds] = useState<KoiBreed[]>([])
  const [koiCategories, setKoiCategories] = useState<KoiCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(4)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [koiToDelete, setKoiToDelete] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | "">("")

  useEffect(() => {
    const fetchKoiCategories = async () => {
      try {
        const response = await axiosClient.get(`/api/Koi/Get-All-KoiCategories`)
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
        const response = await axiosClient.get(`/api/Koi/Get-All-KoiBreeds`)
        if (response.data.isSuccess) {
          setKoiBreeds(response.data.result)
          setTotalPages(Math.ceil(response.data.result.length / pageSize))
        }
      } catch (error) {
        console.error("Error fetching koi breeds:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchKoiCategories()
    fetchKoiBreeds()
  }, [pageIndex])

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex((prev) => prev + 1)
    }
  }

  const handleEditDetail = (id: number) => {
    navigate(`/admin/quan-li-ca-va-ho/all-koi/edit/${id}`)
  }

  const handleDeleteRequest = (id: number) => {
    setKoiToDelete(id)
    setIsModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (koiToDelete !== null) {
      setIsLoading(true)
      try {
        const response = await axiosClient.delete(
          `/api/Koi/${koiToDelete}/KoiBreed`
        )
        if (response.data.isSuccess) {
          setKoiBreeds((prev) => prev.filter((koi) => koi.id !== koiToDelete))
          setIsModalVisible(false)
          setKoiToDelete(null)
          toast.success("Xóa giống cá Koi thành công")
        } else {
          console.error(response.data.message)
        }
      } catch {
        toast.error("Có lỗi xảy ra khi xóa giống cá Koi.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getCategoryNameById = (categoryId: number) => {
    const category = koiCategories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  // Filtered koi breeds based on search term and selected category
  const filteredKoiBreeds = koiBreeds.filter((koi) => {
    const matchesSearch = koi.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "" || koi.koiCategoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="relative flex w-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Tất cả các giống cá Koi</h2>

      {/* Search and Filter Section */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm tên cá Koi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-40 rounded border border-gray-300 p-2"
        />
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value ? Number(e.target.value) : "")
          }
          className="w-40 rounded border border-gray-300 p-2"
        >
          <option value="">Tất cả loại cá Koi</option>
          {koiCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : filteredKoiBreeds.length === 0 ? (
        <p>Không có giống cá nào</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filteredKoiBreeds
            .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
            .map((koi) => (
              <div
                key={koi.id}
                className="flex rounded-lg border border-gray-200 bg-white shadow-md"
              >
                {/* Left Side Image */}
                <div className="h-48 w-1/4 overflow-hidden rounded-l-lg">
                  <img
                    src={koi.image || "https://via.placeholder.com/150"}
                    alt={koi.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Right Side Content */}
                <div className="relative flex w-3/4 flex-col p-4">
                  <div className="flex-grow overflow-hidden">
                    <h3 className="break-words text-xl font-semibold">
                      Tên giống cá Koi:{" "}
                      <span className="font-normal uppercase">{koi.name}</span>
                    </h3>
                    <p className="font-semibold text-gray-500">
                      Loại cá Koi:{" "}
                      <span className="font-normal">
                        {getCategoryNameById(koi.koiCategoryId)}
                      </span>
                    </p>
                    <p className="font-semibold text-gray-500">
                      Màu sắc: <span className="font-normal">{koi.colors}</span>
                    </p>
                    <p className="font-semibold text-gray-500">
                      Hoa văn:{" "}
                      <span className="font-normal">{koi.pattern}</span>
                    </p>
                    <p className="mt-2 break-words text-sm font-semibold text-gray-700">
                      Mô tả:{" "}
                      <span className="font-normal">{koi.description}</span>
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <CustomButton
                      label="Chỉnh sửa"
                      onClick={() => handleEditDetail(koi.id)}
                    />
                    <CustomButton
                      label="Xóa"
                      onClick={() => handleDeleteRequest(koi.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Pagination */}
      <div className="fixed bottom-0 mt-6 inline-flex w-full items-center justify-center">
        <CustomButton
          icon={<IoIosArrowDropleftCircle />}
          label="Trang trước"
          onClick={handlePreviousPage}
          disabled={pageIndex === 1 || isLoading}
        />
        <span className="inline-flex items-center px-4">{`Trang ${pageIndex} trên ${totalPages}`}</span>
        <CustomButton
          icon={<IoIosArrowDroprightCircle />}
          label="Trang sau"
          onClick={handleNextPage}
          disabled={pageIndex === totalPages || isLoading}
        />
      </div>

      <ConfirmModal
        isVisible={isModalVisible}
        message="Bạn có chắc chắn muốn xóa giống cá Koi này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  )
}

export default GetAllKoi
