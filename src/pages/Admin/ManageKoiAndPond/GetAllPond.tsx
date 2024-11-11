import { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import toast from "react-hot-toast"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
  IoIosCreate
} from "react-icons/io"
import { useNavigate } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import ConfirmModal from "@/components/global/atoms/ConfirmModal"

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

const GetAllPond = () => {
  const navigate = useNavigate()
  const [ponds, setPonds] = useState<PondCharacteristic[]>([])
  const [pondCategories, setPondCategories] = useState<PondCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(4) // 4 items per page for a 2x2 layout
  const [totalPages, setTotalPages] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pondToDelete, setPondToDelete] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("") // State for search term
  const [selectedCategory, setSelectedCategory] = useState<number | "">("") // State for filter by category

  useEffect(() => {
    const fetchPondCategories = async () => {
      try {
        const response = await axiosClient.get(
          `/api/Pond/Get-All-PondCategories`
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
          setTotalPages(Math.ceil(response.data.result.length / pageSize))
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

  const getCategoryNameById = (categoryId: number) => {
    const category = pondCategories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  const handleDeleteRequest = (id: number) => {
    setPondToDelete(id)
    setIsModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (pondToDelete !== null) {
      setIsLoading(true)
      try {
        const response = await axiosClient.delete(
          `/api/Pond/${pondToDelete}/PondCharacteristic`
        )
        if (response.data.isSuccess) {
          setPonds((prev) => prev.filter((pond) => pond.id !== pondToDelete))
          setIsModalVisible(false)
          setPondToDelete(null)
          toast.success("Xóa đặc điểm hồ thành công")
        } else {
          toast.error(response.data.message || "Có lỗi xảy ra khi xóa.")
        }
      } catch {
        toast.error("Lỗi khi xóa đặc điểm hồ.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Filter ponds based on search term and selected category
  const filteredPonds = ponds.filter((pond) => {
    const matchesSearch = pond.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "" || pond.pondCategoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="relative flex w-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Danh sách các loại hồ</h2>

      {/* Search and Filter Section */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm tên hồ..."
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
          <option value="">Tất cả loại hồ</option>
          {pondCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : filteredPonds.length === 0 ? (
        <p>Không có loại hồ nào</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filteredPonds
            .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
            .map((pond) => (
              <div
                key={pond.id}
                className="flex rounded-lg border border-gray-200 bg-white shadow-md"
              >
                {/* Left Side Image */}
                <div className="h-48 w-1/4 overflow-hidden rounded-l-lg">
                  <img
                    src={pond.image || "https://via.placeholder.com/150"}
                    alt={pond.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Right Side Content */}
                <div className="relative flex w-3/4 flex-col justify-between p-4">
                  <div>
                    <h3 className="break-words text-xl font-semibold">
                      Tên hồ:{" "}
                      <span className="font-normal uppercase">{pond.name}</span>
                    </h3>
                    <p className="font-semibold text-gray-500">
                      Loại hồ:{" "}
                      <span className="font-normal">
                        {getCategoryNameById(pond.pondCategoryId)}
                      </span>
                    </p>
                    <p className="mt-2 break-words text-sm font-semibold text-gray-700">
                      Mô tả:{" "}
                      <span className="font-normal">{pond.description}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <CustomButton
                      icon={<IoIosCreate />}
                      label="Chỉnh sửa"
                      onClick={() =>
                        navigate(
                          `/admin/quan-li-ca-va-ho/all-pond/edit/${pond.id}`
                        )
                      }
                    />
                    <CustomButton
                      label="Xóa"
                      onClick={() => handleDeleteRequest(pond.id)}
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
        message="Bạn có chắc chắn muốn xóa loại hồ này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  )
}

export default GetAllPond
