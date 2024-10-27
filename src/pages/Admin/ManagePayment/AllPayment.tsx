import { useEffect, useState } from "react"
import CustomButton from "@/pages/Setting/Components/CustomBtn"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"
import { getAllPaymentsForAdmin } from "@/lib/api/Payment"
import AllPaymentSection from "../components/AllPaymentSection"

interface ImageViewDto {
  id: number
  filePath: string
  altText: string | null
  userId: string
  userName: string
  createdDate: string
}

interface advertisementPackageView {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  isActive: boolean
  createdDate: string
  createdBy: string
  imageViewDTOs: ImageViewDto[]
}

interface AllPayment {
  id: number
  userName: string
  transactionId: number
  content: string
  amount: number
  createdDate: string
  advertisementPackageViewDTO: advertisementPackageView
}

export const AllPayment = () => {
  const [payments, setPayments] = useState<AllPayment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true)
      try {
        const response = await getAllPaymentsForAdmin({
          pageIndex: pageIndex,
          pageSize: pageSize,
          orderDate: 1,
          transactionId: null,
          orderImage: null
        })
        console.log(response)
        if (response.isSuccess) {
          setPayments(response.result.datas)
          setTotalPages(response.result.totalPages)
        } else {
          console.error(response.message)
        }
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
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

  return (
    <div className="relative flex w-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">
        Tất cả các giao dịch thanh toán
      </h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>Không có giao dịch thanh toán nào</p>
      ) : (
        <ul className="space-y-4 font-semibold">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <AllPaymentSection
                key={payment.id}
                id={payment.id}
                transactionId={payment.transactionId}
                userName={payment.userName}
                amount={payment.amount}
                content={payment.content}
                createdDate={payment.createdDate}
                packageName={payment.advertisementPackageViewDTO.name}
                advertisementPackageViewDTO={
                  payment.advertisementPackageViewDTO
                }
              />
            ))
          ) : (
            <p>Không tìm thấy giao dịch nào</p>
          )}
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
    </div>
  )
}
