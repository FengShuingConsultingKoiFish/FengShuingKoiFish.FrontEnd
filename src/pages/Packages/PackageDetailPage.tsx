import { useEffect, useState } from "react"

import { IconCreditCardPay, IconLogin } from "@tabler/icons-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import useLoginModal from "@/hooks/useLoginModal"

import { getAdvertisementPackageById } from "@/lib/api/AdvertisementPkg"
import { PurchasePackage } from "@/lib/api/Payment"
import { RootState } from "@/lib/redux/store"

import { AuroraBackground } from "@/components/ui/AuroraBg"
import { ArticleReading } from "@/components/ui/blog/ArticleReading"

import CustomButton from "../Setting/Components/CustomBtn"

interface AdvertisementPackage {
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
  imageViewDTOs: {
    id: number
    filePath: string
  }[]
}

export const PackageDetailPage = () => {
  const { id } = useParams()
  const loginModal = useLoginModal()
  const [packageDetail, setPackageDetail] =
    useState<AdvertisementPackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const userDetail = useSelector((state: RootState) => state.users.detailUser)
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        const response = await getAdvertisementPackageById(Number(id))
        console.log(response)
        setPackageDetail(response.result)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch package details:", error)
        setError("Failed to load package details")
        setIsLoading(false)
      }
    }

    if (id) {
      fetchPackageDetail()
    }
  }, [id])

  const handlePurchase = async () => {
    if (!packageDetail || !currentUser) {
      toast.error("Missing user or package information.")
      return
    }

    const paymentData = {
      packageId: packageDetail.id,
      name: packageDetail.name,
      price: packageDetail.price
    }

    try {
      const response = await PurchasePackage(paymentData)
      toast.success("Đang chuyển trang thanh toán VnPay... !")
      console.log("Payment response:", response)
      window.location.href = response.result
    } catch (error) {
      toast.error("Failed to make payment request.")
      console.error("Payment error:", error)
    }
  }

  const data = [
    {
      title: "Giới thiệu",
      content: (
        <div>
          <p className="mb-8 text-5xl font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            {packageDetail?.description || "No description available"}
          </p>
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      )
    },
    {
      title: "Hình ảnh từ gói",
      content: (
        <div>
          <p className="mb-8 text-xl font-normal text-neutral-800 dark:text-neutral-200">
            Hình ảnh từ gói dịch vụ
          </p>
          {packageDetail?.imageViewDTOs &&
          packageDetail.imageViewDTOs.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {packageDetail.imageViewDTOs.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.filePath}
                    alt={`Image ${image.id}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>Không có hình ảnh nào để hiển thị.</p>
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
                Khách hàng có quyền yêu cầu hoàn trả trong vòng 7 ngày kể từ khi
                mua gói quảng cáo Cá Koi.
              </li>
              <li>
                Chỉ những giao dịch có lỗi kỹ thuật hoặc không thể hiển thị đúng
                nội dung quảng cáo mới đủ điều kiện hoàn trả.
              </li>
              <li>
                Yêu cầu hoàn trả phải được gửi qua email hoặc liên hệ trực tiếp
                đến bộ phận chăm sóc khách hàng của chúng tôi.
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
                Không hoàn trả trong trường hợp khách hàng thay đổi ý định sau
                khi mua.
              </li>
              <li>
                Gói quảng cáo đã được hiển thị theo thỏa thuận không thuộc diện
                được hoàn trả.
              </li>
            </ul>
          </div>
          <div className="mb-8">
            <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Quy trình hoàn trả:
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              <li>
                Sau khi nhận yêu cầu hoàn trả hợp lệ, chúng tôi sẽ xác minh và
                tiến hành xử lý hoàn tiền trong vòng 5 - 7 ngày làm việc.
              </li>
              <li>
                Tiền sẽ được hoàn lại theo phương thức thanh toán ban đầu của
                khách hàng.
              </li>
              <li>
                Mọi thắc mắc về quá trình hoàn trả, vui lòng liên hệ với bộ phận
                hỗ trợ để được giải đáp.
              </li>
            </ul>
          </div>
          <p className="text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Chúng tôi cam kết cung cấp dịch vụ tốt nhất và đảm bảo quyền lợi của
            khách hàng khi sử dụng gói quảng cáo Cá Koi.
          </p>
        </div>
      )
    }
  ]
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
              <h2 className="mb-4 max-w-4xl text-lg text-black md:text-4xl">
                {packageDetail?.name || "Package Details"}
              </h2>
              <p className="inline-flex max-w-sm items-center justify-start gap-4 text-sm font-semibold text-black md:text-base">
                <p className="text-xl">Giá :</p>

                {packageDetail?.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND"
                })}
              </p>
              <ArticleReading data={data} />
            </div>
          )}
          <div className="flex items-center justify-center">
            {currentUser ? (
              userDetail ? (
                <CustomButton
                  icon={<IconCreditCardPay />}
                  label="Mua ngay"
                  onClick={handlePurchase}
                />
              ) : (
                <p className="text-red-500">
                  Vui lòng cập nhật thông tin của bạn để mua gói
                </p>
              )
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p className="text-red-500">Vui lòng đăng nhập để mua gói</p>
                <CustomButton
                  icon={<IconLogin />}
                  label="Đăng nhập"
                  onClick={() => loginModal.onOpen()}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  )
}
