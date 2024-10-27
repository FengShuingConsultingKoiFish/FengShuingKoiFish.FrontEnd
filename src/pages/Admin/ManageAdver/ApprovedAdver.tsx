import React, { useEffect, useState } from "react"

import toast from "react-hot-toast"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"

import { getAllAdvertisementsForAdmin } from "@/lib/api/Advertisement"
import { updateAdvertisementStatus } from "@/lib/api/Advertisement"

import CustomButton from "../../Setting/Components/CustomBtn"
import PostSection from "../components/BlogSection"

interface ImageViewDto {
  id: number
  filePath: string
  altText: string | null
  userId: string
  userName: string
  createdDate: string
}

interface Advertisement {
  id: number
  title: string
  description: string
  userName: string
  createdDate: string
  status: number | string
  imageViewDtos: ImageViewDto[]
  commentViewDtos?: []
}

export const ApprovedAdver: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAdvertisements()
  }, [pageIndex])

  const fetchAdvertisements = async () => {
    setIsLoading(true)
    try {
      const requestData = {
        pageIndex,
        pageSize,
        title: "",
        advertisementStatus: 2,
        orderAdvertisement: null,
        orderComment: null,
        orderImage: null
      }
      const response = await getAllAdvertisementsForAdmin(requestData)
      if (response.isSuccess) {
        // @ts-ignore
        setAdvertisements(response.result.datas)
        setTotalPages(response.result.totalPages)
      } else {
        console.error(response.message)
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleVerify = async (id: number) => {
    try {
      await updateAdvertisementStatus({ id, status: 2 })
      toast.success("Duyệt quảng cáo thành công !")
      fetchAdvertisements()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleDeny = async (id: number) => {
    try {
      await updateAdvertisementStatus({ id, status: 3 })
      toast.success("Đã hủy quảng cáo thành công")
      fetchAdvertisements()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  return (
    <div className="relative flex w-full flex-col">
      <div className="">
        <h2 className="mb-4 text-2xl font-semibold">Các Quảng Cáo đã duyệt</h2>

        {isLoading ? (
          <p>Đang tải...</p>
        ) : (
          <div>
            {advertisements.length === 0 ? (
              <p>Hiện tại chưa có quảng cáo nào được duyệt.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {advertisements.map((ad) => (
                  <PostSection
                    key={ad.id}
                    id={ad.id}
                    title={ad.title}
                    content={ad.description}
                    userName={ad.userName}
                    createdDate={ad.createdDate}
                    status={ad.status}
                    changeStatusToVerify={() => handleVerify(ad.id)}
                    changeStatusToDeny={() => handleDeny(ad.id)}
                    imageViewDtos={ad.imageViewDtos}
                    commentViewDtos={ad.commentViewDtos || []}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="fixed inset-x-0 bottom-0 flex items-center justify-center mt-6">
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
      </div>
    </div>
  )
}

export default ApprovedAdver
