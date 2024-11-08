import { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import axios from "axios"
import toast from "react-hot-toast"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"
import { useNavigate } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import ConfirmModal from "@/components/global/atoms/ConfirmModal"

interface PondCategory {
  id: number
  name: string
  description: string
}

const GetAllCategoryPond = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<PondCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCategories"
        )
        if (response.data.isSuccess) {
          setCategories(response.data.result)
          setTotalPages(Math.ceil(response.data.result.length / pageSize))
        } else {
          console.error(response.data.message)
        }
      } catch (error) {
        console.error("Error fetching pond categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
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
    navigate(`/admin/quan-li-loai-ca-va-loai-ho/all-pond/edit/${id}`)
  }

  const handleDeleteRequest = (id: number) => {
    setCategoryToDelete(id)
    setIsModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (categoryToDelete !== null) {
      setIsLoading(true)
      try {
        const response = await axiosClient.delete(
          `/api/Pond/${categoryToDelete}`
        )
        if (response.data.isSuccess) {
          setCategories((prev) =>
            prev.filter((category) => category.id !== categoryToDelete)
          )
          setIsModalVisible(false)
          setCategoryToDelete(null)
          toast.success("Xóa loại hồ thành công")
        } else {
          console.error(response.data.message)
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error("Không thể xóa loại hồ này vì đang được sử dụng.")
        } else {
          toast.error("Có lỗi xảy ra khi xóa loại hồ.")
        }
        console.error("Error deleting pond category:", error)
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
      ) : categories.length === 0 ? (
        <p>Không có loại hồ nào</p>
      ) : (
        <ul className="space-y-4 font-semibold">
          {categories
            .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
            .map((category) => (
              <li
                key={category.id}
                className="relative mb-6 rounded-lg border border-gray-200 bg-white shadow-md"
              >
                <div className="items-center px-4 py-3">
                  <div className="flex flex-col justify-start gap-3">
                    <div className="flex flex-row justify-between">
                      <p className="inline-flex items-start gap-3 text-xl font-semibold">
                        Tên loại :
                        <span className="text-xl font-medium">
                          {category.name}
                        </span>
                      </p>
                    </div>
                    <p className="inline-flex items-center gap-2 text-gray-500">
                      Mô tả: {category.description}
                    </p>
                  </div>
                </div>

                <div className="absolute right-4 top-4 flex gap-2">
                  <CustomButton
                    label="Chỉnh sửa"
                    onClick={() => handleEditDetail(category.id)}
                  />
                  <CustomButton
                    label="Xóa"
                    onClick={() => handleDeleteRequest(category.id)}
                  />
                </div>
              </li>
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

export default GetAllCategoryPond
