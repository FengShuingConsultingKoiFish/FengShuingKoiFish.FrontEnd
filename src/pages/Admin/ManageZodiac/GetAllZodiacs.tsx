import { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import axios from "axios"
import toast from "react-hot-toast"
// Đảm bảo đường dẫn chính xác
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"
import { useNavigate } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import ConfirmModal from "@/components/global/atoms/ConfirmModal"

interface Zodiac {
  id: number
  zodiacName: string
}

export const AllZodiac = () => {
  const navigate = useNavigate()
  const [zodiacs, setZodiacs] = useState<Zodiac[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [zodiacToDelete, setZodiacToDelete] = useState<number | null>(null)

  useEffect(() => {
    const fetchZodiacs = async () => {
      setIsLoading(true)
      try {
        const response = await axiosClient.get("/api/Zodiac/Get-All-Zodiac")
        if (response.data.isSuccess) {
          setZodiacs(response.data.result)
          setTotalPages(Math.ceil(response.data.result.length / pageSize))
        } else {
          console.error(response.data.message)
        }
      } catch (error) {
        console.error("Error fetching zodiacs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchZodiacs()
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
    navigate(`/admin/quan-li-menh/edit/${id}`)
  }

  const handleDeleteRequest = (id: number) => {
    setZodiacToDelete(id)
    setIsModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (zodiacToDelete !== null) {
      setIsLoading(true)
      try {
        const response = await axiosClient.delete(
          `/api/Zodiac/${zodiacToDelete}`
        )
        if (response.data.isSuccess) {
          setZodiacs((prev) =>
            prev.filter((zodiac) => zodiac.id !== zodiacToDelete)
          )
          setIsModalVisible(false)
          setZodiacToDelete(null)
          toast.success("Xóa mệnh thành công")
        } else {
          console.error(response.data.message)
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error("Không thể xóa mệnh này vì đang được sử dụng.")
        } else {
          toast.error("Có lỗi xảy ra khi xóa mệnh.")
        }
        console.error("Error deleting zodiac:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }
  return (
    <div className="relative flex w-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Tất cả các mệnh</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : zodiacs.length === 0 ? (
        <p>Không có mệnh nào</p>
      ) : (
        <ul className="space-y-4 font-semibold">
          {zodiacs
            .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
            .map((zodiac) => (
              <li
                key={zodiac.id}
                className="flex justify-between rounded-md border border-neutral-200 p-4"
              >
                <div>
                  <p className="text-lg font-semibold">{zodiac.zodiacName}</p>
                </div>
                <div className="flex gap-4">
                  <CustomButton
                    label="Chỉnh sửa"
                    onClick={() => handleEditDetail(zodiac.id)}
                  />
                  <CustomButton
                    label="Xóa"
                    onClick={() => handleDeleteRequest(zodiac.id)}
                  />
                </div>
              </li>
            ))}
        </ul>
      )}
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
        message="Bạn có chắc chắn muốn xóa mệnh này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  )
}
