import { useEffect, useState } from "react"

import { IconCreditCardPay, IconLogin } from "@tabler/icons-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import useLoginModal from "@/hooks/useLoginModal"

import { getAdvertisementPackageById } from "@/lib/api/AdvertisementPkg"
import { RequestPayment } from "@/lib/api/Payment"
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
  const currentUser = useSelector((state: RootState) => state.users.detailUser)

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
      userId: currentUser.userId,
      packageName: packageDetail.name,
      fullName: currentUser.fullName,
      description: packageDetail.description,
      amount: packageDetail.price,
      createdDate: new Date().toISOString()
    }

    try {
      const response = await RequestPayment(paymentData)
      toast.success("Đang chuyển trang thanh toán VnPay... !")
      console.log("Payment response:", response)
      window.location.href = response.url
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
      title: "Những lợi ích",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            I usually run out of copy, but when I see content this big, I try to
            integrate lorem ipsum.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built. Lorem
            ipsum is for people who are too lazy to write copy. But we are not.
            Here are some more example of beautiful designs I built. Lorem ipsum
            is for people who are too lazy to write copy. But we are not. Here
            are some more example of beautiful designs I built. Lorem ipsum is
            for people who are too lazy to write copy. But we are not. Here are
            some more example of beautiful designs I built. Lorem ipsum is for
            people who are too lazy to write copy. But we are not. Here are some
            more example of beautiful designs I built. Lorem ipsum is for people
            who are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built.
          </p>
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      )
    },
    {
      title: "Chính sách hoàn trả",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Deployed 5 new components on Aceternity today
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Card grid component
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Startup template Aceternity
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Random file upload lol
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Himesh Reshammiya Music CD
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Salman Bhai Fan Club registrations open
            </div>
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built. Lorem
            ipsum is for people who are too lazy to write copy. But we are not.
            Here are some more example of beautiful designs I built. Lorem ipsum
            is for people who are too lazy to write copy. But we are not. Here
            are some more example of beautiful designs I built. Lorem ipsum is
            for people who are too lazy to write copy. But we are not. Here are
            some more example of beautiful designs I built. Lorem ipsum is for
            people who are too lazy to write copy. But we are not. Here are some
            more example of beautiful designs I built. Lorem ipsum is for people
            who are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built.
          </div>
          <div className="grid grid-cols-2 gap-4"></div>
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
              <CustomButton
                icon={<IconCreditCardPay />}
                label="Mua ngay"
                onClick={handlePurchase}
              />
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
