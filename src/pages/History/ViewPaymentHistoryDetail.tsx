import { useEffect, useState } from "react"

import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { FaArrowLeft } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import { getPaymentByIdForMember } from "@/lib/api/Payment"

import { AuroraBackground } from "@/components/ui/AuroraBg"
import { ArticleReading } from "@/components/ui/blog/ArticleReading"

interface ImageView {
  id: number
  filePath: string
}

interface AdvertisementPackageView {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  createdDate: string
  createdBy: string
  imageViewDTOs: ImageView[]
}

interface PaymentDetailHistory {
  transactionId: number
  id: number
  userName: string
  amount: number
  createdDate: string
  content: string
  advertisementPackageViewDTO: AdvertisementPackageView
}

export const PaymentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetailHistory>()
  //const currentUser = useSelector((state: RootState) => state.users.detailUser);

  useEffect(() => {
    window.scrollTo(0, 0)
    if (id) {
      fetchPaymentDetail()
    }
  }, [id])

  const fetchPaymentDetail = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await getPaymentByIdForMember(Number(id))
      console.log(response)
      if (response.isSuccess) {
        setPaymentDetail(response.result)
      } else {
        setError(response.message || "Failed to fetch payment details.")
      }
    } catch (error: any) {
      setError(error.message || "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const data = paymentDetail
    ? [
        {
          title: "Chi tiết giao dịch",
          content: (
            <div className="space-y-7">
              <p className="text-xl font-normal text-neutral-800">
                <p className="mb-1 font-semibold">Mã đơn :</p>
                <p>{paymentDetail.content}</p>
              </p>
              <p className="text-xl font-normal text-neutral-800">
                <p className="mb-1 font-semibold">Tài khoản người mua :</p>
                <p>{paymentDetail.userName}</p>
              </p>
              <p className="text-xl font-normal text-neutral-800">
                <p className="font-semibold"> Giá :</p>

                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND"
                }).format(paymentDetail.amount)}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <p className="font-semibold">
                  Ngày thực hiện giao dịch : {paymentDetail.createdDate}
                </p>
              </div>
              <p className="text-xl font-normal text-neutral-800">
                <p className="font-semibold">Tên gói đã mua :</p>
                <p>{paymentDetail.advertisementPackageViewDTO.name}</p>
              </p>
              <p className="text-xl font-normal text-neutral-800">
                <p className="font-semibold">Gói được tạo bởi :</p>
                <p>{paymentDetail.advertisementPackageViewDTO.createdBy}</p>
              </p>
            </div>
          )
        },
        {
          title: "Hình ảnh từ gói",
          content: (
            <div>
              <p className="mb-8 text-xl font-normal text-neutral-800">
                Hình ảnh từ gói dịch vụ
              </p>
              {paymentDetail.advertisementPackageViewDTO.imageViewDTOs.map(
                (image) => (
                  <img key={image.id} src={image.filePath} className="mb-4" />
                )
              )}
            </div>
          )
        },
        {
          title: "Chính sách hoàn trả",
          content: (
            <div>
              <p className="mb-4 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
                Chính sách hoàn trả dành cho khách hàng khi mua gói quảng cáo Cá
                Koi.
              </p>
              <div className="mb-8">
                <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Điều kiện áp dụng hoàn trả:
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
                  <li>
                    Khách hàng có quyền yêu cầu hoàn trả trong vòng 7 ngày kể từ
                    khi mua gói quảng cáo Cá Koi.
                  </li>
                  <li>
                    Chỉ những giao dịch có lỗi kỹ thuật hoặc không thể hiển thị
                    đúng nội dung quảng cáo mới đủ điều kiện hoàn trả.
                  </li>
                  <li>
                    Yêu cầu hoàn trả phải được gửi qua email hoặc liên hệ trực
                    tiếp đến bộ phận chăm sóc khách hàng của chúng tôi.
                  </li>
                </ul>
              </div>
              <div className="mb-8">
                <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Các trường hợp không áp dụng hoàn trả:
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
                  <li>
                    Hoàn trả không áp dụng cho các giao dịch đã được sử dụng hết
                    dung lượng hoặc thời gian quảng cáo.
                  </li>
                  <li>
                    Không hoàn trả trong trường hợp khách hàng thay đổi ý định
                    sau khi mua.
                  </li>
                  <li>
                    Gói quảng cáo đã được hiển thị theo thỏa thuận không thuộc
                    diện được hoàn trả.
                  </li>
                </ul>
              </div>
              <div className="mb-8">
                <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Quy trình hoàn trả:
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
                  <li>
                    Sau khi nhận yêu cầu hoàn trả hợp lệ, chúng tôi sẽ xác minh
                    và tiến hành xử lý hoàn tiền trong vòng 5 - 7 ngày làm việc.
                  </li>
                  <li>
                    Tiền sẽ được hoàn lại theo phương thức thanh toán ban đầu
                    của khách hàng.
                  </li>
                  <li>
                    Mọi thắc mắc về quá trình hoàn trả, vui lòng liên hệ với bộ
                    phận hỗ trợ để được giải đáp.
                  </li>
                </ul>
              </div>
              <p className="text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
                Chúng tôi cam kết cung cấp dịch vụ tốt nhất và đảm bảo quyền lợi
                của khách hàng khi sử dụng gói quảng cáo Cá Koi.
              </p>
            </div>
          )
        }
      ]
    : []

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="relative flex flex-col items-center justify-start gap-4 px-4 py-10"
      >
        <div className="w-full">
          {isLoading ? (
            <div className="flex h-screen items-center justify-center">
              <ClipLoader size={40} color="#000" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
              <Link to="/lich-su-giao-dich">
                <button className="mb-20 inline-flex transform items-center rounded-full bg-gray-500 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-600 hover:shadow-lg">
                  <FaArrowLeft />
                  Trở về
                </button>
              </Link>
              <ArticleReading data={data} />
            </div>
          )}
        </div>
      </motion.div>
    </AuroraBackground>
  )
}
