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
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [koiToDelete, setKoiToDelete] = useState<number | null>(null)

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

  return (
    <div className="relative flex w-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Tất cả các giống cá Koi</h2>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : koiBreeds.length === 0 ? (
        <p>Không có giống cá nào</p>
      ) : (
        <ul className="space-y-4 font-semibold">
          {koiBreeds
            .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
            .map((koi) => (
              <li
                key={koi.id}
                className="relative mb-6 rounded-lg border border-gray-200 bg-white shadow-md"
              >
                <div className="items-center px-4 py-3">
                  <div className="flex flex-col justify-start gap-3">
                    <div className="flex flex-row justify-between">
                      <p className="inline-flex items-start gap-3 text-xl font-semibold">
                        Tên giống cá:{" "}
                        <span className="text-xl font-medium">{koi.name}</span>
                      </p>
                    </div>
                    <p className="inline-flex items-center gap-2 text-gray-500">
                      Loại cá Koi:{" "}
                      <span>{getCategoryNameById(koi.koiCategoryId)}</span>
                    </p>
                    <p className="inline-flex items-center gap-2 text-gray-500">
                      Màu sắc: <span>{koi.colors}</span>
                    </p>
                    <p className="inline-flex items-center gap-2 text-gray-500">
                      Hoa văn: <span>{koi.pattern}</span>
                    </p>
                  </div>
                </div>

                <div className="absolute right-4 top-4 flex gap-2">
                  <CustomButton
                    label="Chỉnh sửa"
                    onClick={() => handleEditDetail(koi.id)}
                  />
                  <CustomButton
                    label="Xóa"
                    onClick={() => handleDeleteRequest(koi.id)}
                  />
                </div>

                <div className="flex w-full flex-col justify-start gap-2 px-4">
                  <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
                    <span className=""> Mô tả:</span>
                    {koi.description}
                  </p>
                </div>

                {koi.image && (
                  <div className="p-4">
                    <img
                      src={koi.image}
                      alt={koi.name}
                      className="h-80 w-full rounded object-cover"
                    />
                  </div>
                )}
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
        message="Bạn có chắc chắn muốn xóa giống cá Koi này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  )
}

export default GetAllKoi
