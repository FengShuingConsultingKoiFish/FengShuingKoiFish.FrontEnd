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
  const [pageSize] = useState(6)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pondToDelete, setPondToDelete] = useState<number | null>(null)

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

  return (
    <div className="relative flex w-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Danh sách các loại hồ</h2>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : ponds.length === 0 ? (
        <p>Không có loại hồ nào</p>
      ) : (
        <ul className="space-y-4 font-semibold">
          {ponds
            .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
            .map((pond) => (
              <div
                key={pond.id}
                className="relative mb-6 rounded-lg border border-gray-200 bg-white shadow-md"
              >
                <div className="items-center px-4 py-3">
                  <div className="flex flex-col justify-start gap-3">
                    <div className="flex flex-row justify-between">
                      <p className="inline-flex items-start gap-3 text-xl font-semibold">
                        Tên hồ:{" "}
                        <span className="text-xl font-medium">{pond.name}</span>
                      </p>
                    </div>
                    <p className="inline-flex items-center gap-2 text-gray-500">
                      Loại hồ:{" "}
                      <span>{getCategoryNameById(pond.pondCategoryId)}</span>
                    </p>
                  </div>
                </div>

                <div className="absolute right-4 top-4 flex gap-2">
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

                <div className="flex w-full flex-col justify-start gap-2 px-4">
                  <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
                    <span className="">Mô tả:</span> {pond.description}
                  </p>
                </div>

                {pond.image && (
                  <div className="p-4">
                    <img
                      src={pond.image}
                      alt={pond.name}
                      className="h-32 w-full rounded object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
        </ul>
      )}

      <div className="fixed bottom-0 mt-6 inline-flex translate-x-[50rem] items-center sm:translate-x-[40rem] md:translate-x-[30rem]">
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
