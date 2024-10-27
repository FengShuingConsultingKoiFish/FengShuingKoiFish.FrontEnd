import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { AuroraBackground } from "@/components/ui/AuroraBg"
import CustomButton from "../Setting/Components/CustomBtn"
import { MyAdvertisementSection } from "./components/MyAdvertisementSection"
import { getAllAdvertisementsForUser } from "@/lib/api/Advertisement"

interface ImageViewDTO {
  id: number
  filePath: string
  altText?: string | null
  userId: string
  userName: string
  createdDate: string
}

interface CommentViewDTO {
    id: number;
    content: string;
  }


interface Advertisement {
  id: number;
  userName: string;
  title: string;
  description: string;
  price?: number;
  createdDate: string;
  status: string;
  imageViewDtos: ImageViewDTO[];
  commentViewDTOs?: CommentViewDTO[];
}

export function MyAdvertisementPage() {
  const [pageIndex, setPageIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [advertisements, setAdvertisements] = useState<
    Advertisement[]
  >([])

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchAdvertisement()
  }, [pageIndex])

  const fetchAdvertisement = async () => {
    setIsLoading(true)
    const requestData = {
      pageIndex: pageIndex,
      pageSize: 8,
      status: null,
      orderImage: null,
      orderDate: null
    }

    try {
      const response = await getAllAdvertisementsForUser(requestData);
      console.log(response)

      setAdvertisements(response.result.datas);
      setTotalPages(response.result.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      setIsLoading(false);
    }
  };

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

  const handleAdvertisementClick = (id: number) => {
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
          Quản lý quảng cáo của bạn
        </div>
        <div className="text-center text-2xl font-bold dark:text-white md:text-2xl">
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <ClipLoader size={40} color="#000" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
             {advertisements.map((ad) => (
              <MyAdvertisementSection
                key={ad.id}
                id={ad.id}
                userName={ad.userName}
                title={ad.title}
                description={ad.description}
                createdDate={ad.createdDate}
                status={ad.status}
                imageViewDtos={ad.imageViewDtos}
                onClick={() => handleAdvertisementClick(ad.id)}
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
