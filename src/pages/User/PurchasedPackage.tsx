import { useEffect, useState } from "react"

import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"

import { getAllPurchasedPackagesForUser } from "@/lib/api/PurchasedPkg"
import { setPackageList } from "@/lib/redux/reducers/userPackageSlice"

import { AuroraBackground } from "@/components/ui/AuroraBg"

import CustomButton from "../Setting/Components/CustomBtn"
import { PurchasedPkgSection } from "./components/PurchasedPkgSection"

interface ImageViewDTO {
  id: number
  filePath: string
  altText?: string | null
  userId: string
  userName: string
  createdDate: string
}

interface AdvertisementPackageViewDTO {
  id: number
  name?: string
  price?: number
  description?: string
  limitAd: number
  limitContent?: number
  limitImage?: number
  createdDate?: string
  imageViewDTOs: ImageViewDTO[]
}

interface UserPurchasedPkgDetail {
  id: number
  monitoredQuantity: number
  userName: string
  status: number
  createdDate: string
  advertisementPackageViewDTO: AdvertisementPackageViewDTO
}

export function PurchasedPackagePage() {
  const [pageIndex, setPageIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [purchasedPackages, setPurchasedPackages] = useState<
    UserPurchasedPkgDetail[]
  >([])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchPackages()
  }, [pageIndex])

  const fetchPackages = async () => {
    setIsLoading(true)
    const requestData = {
      pageIndex: pageIndex,
      pageSize: 8,
      status: null,
      orderImage: null,
      orderDate: null
    }

    try {
      const response = await getAllPurchasedPackagesForUser(requestData)
      const { result } = response
      console.log(result)

      // @ts-ignore
      setPurchasedPackages(result.datas)
      // @ts-ignore
      dispatch(setPackageList(result.datas))
      setTotalPages(result.totalPages)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch packages:", error)
      setIsLoading(false)
    }
  }

  const handleNextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex(pageIndex + 1)
    }
  }

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1)
    }
  }

  const handlePackageClick = (id: number) => {
    navigate(`/goi-cua-toi/${id}`)
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
        <div className="text-center text-3xl font-bold dark:text-white md:text-5xl">
          Quản lý các gói đã mua
        </div>
        <div className="text-center text-2xl font-bold dark:text-white md:text-2xl">
          Bạn có thể tạo quảng cáo của mình dựa trên gói bạn đã mua tương ứng
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <ClipLoader size={40} color="#000" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
            {purchasedPackages.map((pkg) => (
              <PurchasedPkgSection
                key={pkg.id}
                id={pkg.advertisementPackageViewDTO.id}
                name={pkg.advertisementPackageViewDTO.name || ""}
                price={pkg.advertisementPackageViewDTO.price || 0}
                description={pkg.advertisementPackageViewDTO.description || ""}
                limitAd={pkg.advertisementPackageViewDTO.limitAd || 0}
                limitContent={pkg.advertisementPackageViewDTO.limitContent || 0}
                limitImage={pkg.advertisementPackageViewDTO.limitImage || 0}
                createdDate={pkg.advertisementPackageViewDTO.createdDate || ""}
                imageViewDtos={pkg.advertisementPackageViewDTO.imageViewDTOs}
                status={pkg.status}
                onClick={() => handlePackageClick(pkg.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-20 flex w-full items-center justify-center gap-4">
          <CustomButton
            onClick={handlePreviousPage}
            disabled={pageIndex === 1 || isLoading}
            label="Trang trước"
          />
          <span className="text-lg">
            Trang {pageIndex} trên {totalPages}
          </span>
          <CustomButton
            onClick={handleNextPage}
            disabled={pageIndex === totalPages || isLoading}
            label="Trang sau"
          />
        </div>
      </motion.div>
    </AuroraBackground>
  )
}
