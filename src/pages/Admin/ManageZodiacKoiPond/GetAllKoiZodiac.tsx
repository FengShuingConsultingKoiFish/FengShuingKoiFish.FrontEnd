import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import toast from "react-hot-toast"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"

import { axiosClient } from "@/lib/api/config/axios-client"

import ConfirmModal from "@/components/global/atoms/ConfirmModal"

interface KoiZodiac {
  id: number
  koiBreedId: number
  zodiacId: number
}

interface Zodiac {
  id: number
  zodiacName: string
}

interface KoiBreed {
  id: number
  koiCategoryId: number
  name: string
  colors: string
  pattern: string
  description: string
  image: string
}

interface GroupedKoiZodiac {
  zodiacId: number
  zodiacName: string
  koiBreeds: KoiBreed[]
}

const GetAllKoiZodiac = () => {
  const [koiZodiacs, setKoiZodiacs] = useState<GroupedKoiZodiac[]>([])
  const [zodiacs, setZodiacs] = useState<Zodiac[]>([])
  const [koiBreeds, setKoiBreeds] = useState<KoiBreed[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [zodiacToDelete, setZodiacToDelete] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zodiacRes, koiBreedsRes] = await Promise.all([
          axiosClient.get("/api/Zodiac/Get-All-Zodiac"),
          axiosClient.get("/api/Koi/Get-All-KoiBreeds")
        ])

        if (zodiacRes.data.isSuccess) {
          setZodiacs(zodiacRes.data.result)
        }

        if (koiBreedsRes.data.isSuccess) {
          setKoiBreeds(koiBreedsRes.data.result)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchKoiZodiacs = async () => {
      if (zodiacs.length > 0 && koiBreeds.length > 0) {
        setIsLoading(true)
        try {
          const response = await axiosClient.get("/api/Koi/Get-All-Koi-Zodiac")
          if (response.data.isSuccess) {
            const groupedData = response.data.result.reduce(
              (acc: GroupedKoiZodiac[], current: KoiZodiac) => {
                const existingGroup = acc.find(
                  (group) => group.zodiacId === current.zodiacId
                )
                const koiBreedDetails =
                  koiBreeds.find((breed) => breed.id === current.koiBreedId) ||
                  null

                if (existingGroup && koiBreedDetails) {
                  existingGroup.koiBreeds.push(koiBreedDetails)
                } else if (koiBreedDetails) {
                  const zodiacName =
                    zodiacs.find((zodiac) => zodiac.id === current.zodiacId)
                      ?.zodiacName || "Unknown"
                  acc.push({
                    zodiacId: current.zodiacId,
                    zodiacName: zodiacName,
                    koiBreeds: [koiBreedDetails]
                  })
                }
                return acc
              },
              []
            )

            setKoiZodiacs(groupedData)
            setTotalPages(Math.ceil(groupedData.length / pageSize))
          } else {
            console.error("Error fetching koi zodiacs:", response.data.message)
          }
        } catch (error) {
          console.error("Error fetching koi zodiacs:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchKoiZodiacs()
  }, [zodiacs, koiBreeds])

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

  const handleDeleteRequest = (zodiacId: number) => {
    setZodiacToDelete(zodiacId)
    setIsModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (zodiacToDelete !== null) {
      setIsLoading(true)
      try {
        const response = await axiosClient.get("/api/Koi/Get-All-Koi-Zodiac")
        const koiZodiacIdsToDelete = response.data.result
          .filter((item: KoiZodiac) => item.zodiacId === zodiacToDelete)
          .map((item: KoiZodiac) => item.id)

        await Promise.all(
          koiZodiacIdsToDelete.map(async (id: number) => {
            return axiosClient.delete(`/api/Koi/Delete-Koi-Zodiac/${id}`)
          })
        )

        setKoiZodiacs((prev) =>
          prev.filter((zodiac) => zodiac.zodiacId !== zodiacToDelete)
        )

        setIsModalVisible(false)
        setZodiacToDelete(null)
        toast.success(
          "Đã xóa thành công toàn bộ giống cá Koi liên quan đến Cung Mệnh"
        )
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa.")
        console.error("Error deleting koi breeds:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="relative flex w-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Danh sách Koi Zodiac</h2>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : koiZodiacs.length === 0 ? (
        <p>Không có dữ liệu Koi Zodiac</p>
      ) : (
        <ul className="space-y-4 font-semibold">
          {koiZodiacs
            .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
            .map((zodiac) => (
              <li
                key={zodiac.zodiacId}
                className="relative mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-xl font-semibold">
                    Cung Mệnh:{" "}
                    <span className="text-xl font-medium">
                      {zodiac.zodiacName}
                    </span>
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {zodiac.koiBreeds.map((breed, index) => (
                      <div
                        key={`${zodiac.zodiacId}-${breed.id}-${index}`}
                        className="flex flex-col items-center rounded-md border p-4 shadow-sm"
                      >
                        <p className="font-semibold">
                          Tên giống cá Koi: {breed.name}
                        </p>
                        <p>Màu sắc: {breed.colors}</p>
                        <p>Hoa văn: {breed.pattern}</p>
                        <p>Mô tả: {breed.description}</p>
                        {breed.image && (
                          <img
                            src={breed.image}
                            alt={breed.name}
                            className="mt-2 h-24 w-24 rounded object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <CustomButton
                      label="Xóa Cung Mệnh"
                      onClick={() => handleDeleteRequest(zodiac.zodiacId)}
                    />
                  </div>
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
        message="Bạn có chắc chắn muốn xóa toàn bộ giống cá Koi liên quan đến Cung Mệnh này không?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  )
}

export default GetAllKoiZodiac
