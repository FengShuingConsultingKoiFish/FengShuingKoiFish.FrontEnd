import { useEffect, useState } from "react"

import { IconPencilPlus } from "@tabler/icons-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import { extendPackage } from "@/lib/api/Payment"
import { getPurchasedPackageById } from "@/lib/api/PurchasedPkg"
import { setUserPackageDetail } from "@/lib/redux/reducers/userPackageSlice"

import { PinContainer } from "@/components/ui/3dPin"
import { AuroraBackground } from "@/components/ui/AuroraBg"
import { ArticleReading } from "@/components/ui/blog/ArticleReading"

import CustomButton from "../Setting/Components/CustomBtn"

interface UserPruchasedPkgDetail {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  durationsInDays: number
  advertisementPackageId: number
  mornitoredQuantity: number
  userId: number
  userName: string
  status: number
  createdDate: string
}

export const UserPackageDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [packageDetail, setPackageDetail] =
    useState<UserPruchasedPkgDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchPackageDetail = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await getPurchasedPackageById(Number(id))
        console.log(response)
        const packageDetailData = response.result
        // @ts-ignore
        dispatch(setUserPackageDetail(packageDetailData))
        // @ts-ignore
        setPackageDetail(packageDetailData)
        console.log("packageDetailData", packageDetailData)

        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching package:", err)
        setError("Failed to load package details")
        setIsLoading(false)
      }
    }

    fetchPackageDetail()
  }, [id])

  const handleExtendPackage = async () => {
    if (!packageDetail) return

    try {
      const response = await extendPackage(packageDetail.id)
      toast.success("Đang chuyển trang thanh toán VnPay... !")
      console.log("Đang chuyển tiếp ...:", response)
      window.location.href = response.result
    } catch (error) {
      console.error("Error extending package:", error)
      setError("Failed to extend package")
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

  const handleClickToCreateAdver = () => {
    navigate("/tao-goi-quang-cao")
  }

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
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-20 md:px-8 lg:px-10">
              <h2 className="text-shadow mb-4 max-w-4xl text-lg font-bold text-black md:text-4xl">
                {packageDetail?.name || "Package Details"}
              </h2>
              <p className="inline-flex max-w-sm items-center justify-start gap-2 text-sm font-semibold text-black md:text-base">
                <p className="text-base">Ngày tạo :</p>

                {packageDetail?.createdDate || "0"}
              </p>
              <p className="inline-flex w-full items-center justify-start gap-2 text-sm font-semibold text-black md:text-base">
                <p className="text-base">Số lượng quảng cáo đã đăng :</p>
                {packageDetail?.mornitoredQuantity || "0"} quảng cáo
              </p>
              <p className="inline-flex w-full items-center justify-start gap-2 text-sm font-semibold text-black md:text-base">
                <p className="text-base">Thời hạn còn lại :</p>

                {packageDetail?.durationsInDays &&
                packageDetail.durationsInDays > 0 ? (
                  <span>{packageDetail.durationsInDays} ngày</span>
                ) : (
                  <span className="font-semibold">Gói của bạn đã hết hạn</span>
                )}
              </p>
              <p className="inline-flex max-w-sm items-center justify-start gap-4 text-sm font-semibold text-black md:text-base">
                <span className="text-xl">Giá :</span>
                {packageDetail?.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND"
                })}
              </p>
              <ArticleReading data={data} />
            </div>
          )}
          <div className="flex flex-col items-center justify-center gap-5">
            <CustomButton
              icon={<IconPencilPlus />}
              label="Tạo quảng cáo của bạn ngay"
              onClick={handleClickToCreateAdver}
              disabled={
                !packageDetail?.durationsInDays ||
                packageDetail.durationsInDays <= 0
              }
            />
            {packageDetail?.durationsInDays !== undefined &&
              packageDetail.durationsInDays <= 0 && (
                <>
                  <p className="mb-4 flex text-lg text-black md:text-4xl">
                    NẾU BẠN CẢM THẤY HÀI LÒNG VỀ GÓI CỦA CHÚNG TÔI
                  </p>
                  <div className="flex h-[30rem] w-full items-center justify-center">
                    <PinContainer
                      title="Gia hạn ngay"
                      onClick={handleExtendPackage}
                    >
                      <div className="flex h-[20rem] w-[20rem] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2">
                        <h3 className="!m-0 max-w-xs text-pretty !pb-2 text-2xl font-bold text-white">
                          {packageDetail?.name || "Package Details"}
                        </h3>
                        <div className="!m-0 !p-0 text-base font-normal">
                          <span className="text-white">
                            Giá :
                            {packageDetail?.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND"
                            })}
                          </span>
                        </div>
                      </div>
                    </PinContainer>
                  </div>
                </>
              )}
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  )
}
