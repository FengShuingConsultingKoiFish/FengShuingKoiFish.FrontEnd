import { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import toast from "react-hot-toast"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"
import { useNavigate } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import ConfirmModal from "@/components/global/atoms/ConfirmModal"

interface PondZodiac {
  id: number
  pondId: number
  zodiacId: number
}

interface Zodiac {
  id: number
  zodiacName: string
}

interface Pond {
  id: number
  pondCategoryId: number
  name: string
  description: string
  image: string
}

interface GroupedPondZodiac {
  zodiacId: number
  zodiacName: string
  ponds: Pond[]
}

const GetAllPondZodiac = () => {
  const [pondZodiacs, setPondZodiacs] = useState<GroupedPondZodiac[]>([])
  const [zodiacs, setZodiacs] = useState<Zodiac[]>([])
  const [ponds, setPonds] = useState<Pond[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [zodiacToDelete, setZodiacToDelete] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zodiacRes, pondRes] = await Promise.all([
          axiosClient.get("/api/Zodiac/Get-All-Zodiac"),
          axiosClient.get("/api/Pond/Get-All-PondCharacteristics")
        ])

        if (zodiacRes.data.isSuccess) {
          setZodiacs(zodiacRes.data.result)
        }

        if (pondRes.data.isSuccess) {
          setPonds(pondRes.data.result)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchPondZodiacs = async () => {
      if (zodiacs.length > 0 && ponds.length > 0) {
        setIsLoading(true)
        try {
          const response = await axiosClient.get(
            "/api/Pond/Get-All-Pond-Zodiac"
          )
          if (response.data.isSuccess) {
            const groupedData = response.data.result.reduce(
              (acc: GroupedPondZodiac[], current: PondZodiac) => {
                const existingGroup = acc.find(
                  (group) => group.zodiacId === current.zodiacId
                )
                const pondDetails =
                  ponds.find((pond) => pond.id === current.pondId) || null

                if (existingGroup && pondDetails) {
                  existingGroup.ponds.push(pondDetails)
                } else if (pondDetails) {
                  const zodiacName =
                    zodiacs.find((zodiac) => zodiac.id === current.zodiacId)
                      ?.zodiacName || "Unknown"
                  acc.push({
                    zodiacId: current.zodiacId,
                    zodiacName: zodiacName,
                    ponds: [pondDetails]
                  })
                }
                return acc
              },
              []
            )

            setPondZodiacs(groupedData)
            setTotalPages(Math.ceil(groupedData.length / pageSize))
          } else {
            console.error("Error fetching pond zodiacs:", response.data.message)
          }
        } catch (error) {
          console.error("Error fetching pond zodiacs:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchPondZodiacs()
  }, [zodiacs, ponds])

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
        const response = await axiosClient.delete(`/api/Pond/${zodiacToDelete}`)
        if (response.data.isSuccess) {
          setPondZodiacs((prev) =>
            prev.filter((zodiac) => zodiac.zodiacId !== zodiacToDelete)
          )
          setIsModalVisible(false)
          setZodiacToDelete(null)
          toast.success("Xóa thành công")
        } else {
          console.error(response.data.message)
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa.")
        console.error("Error deleting pond zodiac:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="relative flex w-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Danh sách Pond Zodiac</h2>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : pondZodiacs.length === 0 ? (
        <p>Không có dữ liệu Pond Zodiac</p>
      ) : (
        <ul className="space-y-4 font-semibold">
          {pondZodiacs
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
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {zodiac.ponds.map((pond) => (
                      <div
                        key={pond.id}
                        className="flex flex-col items-center rounded-md border p-4 shadow-sm"
                      >
                        <p className="w-full max-w-full break-words font-semibold">
                          Tên hồ:{" "}
                          <span className="font-normal uppercase">
                            {pond.name}
                          </span>
                        </p>
                        <p className="w-full break-words text-sm font-semibold text-gray-700">
                          Mô tả:{" "}
                          <span className="font-normal">
                            {pond.description}
                          </span>
                        </p>
                        {pond.image && (
                          <img
                            src={pond.image}
                            alt={pond.name}
                            className="mt-2 h-24 w-24 rounded object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <CustomButton
                      label="Xóa Tương Thích"
                      onClick={() => handleDeleteRequest(zodiac.zodiacId)}
                    />
                    <CustomButton
                      label="Chỉnh sửa"
                      onClick={() =>
                        navigate(`/edit-koi-zodiac/${zodiac.zodiacId}`)
                      }
                    />
                  </div>
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
        message="Bạn có chắc chắn muốn xóa Pond Zodiac này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  )
}

export default GetAllPondZodiac
