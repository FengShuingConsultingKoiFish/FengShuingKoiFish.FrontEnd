import { useEffect, useState } from "react"

// Import the API call function
import { IconChevronDown } from "@tabler/icons-react"
import { motion } from "framer-motion"
import nProgress from "nprogress"
import "nprogress/nprogress.css"
import { FaArrowLeft, FaRegCalendarAlt } from "react-icons/fa"
import { Link } from "react-router-dom"

import { getAllPaymentsForMember } from "@/lib/api/Payment"

import { AuroraBackground } from "@/components/ui/AuroraBg"

import Container from "../../components/ui/Container"
import CustomButton from "../Setting/Components/CustomBtn"
import Content from "./components/PaymentHistroySection"

interface AdvertisementPackageView {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  createdDate: string
}

interface UserHistory {
  transactionId: number
  id: number
  userName: string
  amount: number
  createdDate: string
  content: string
  advertisementPackageViewDTO: AdvertisementPackageView
}

const HistoryView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [userHistory, setUserHistory] = useState<UserHistory[]>([])
  const [itemsToShow, setItemsToShow] = useState(4)
  const [showMoreButton, setShowMoreButton] = useState(false)

  useEffect(() => {
    window.scrollTo(0,0)
    fetchUserPaymentHistory()
  }, [])

  const fetchUserPaymentHistory = async () => {
    nProgress.start()
    try {
      const requestData = {
        pageIndex: 1,
        pageSize: 10,
        orderDate: 1,
        transactionId: null,
        orderImage: null
      }
      const response = await getAllPaymentsForMember(requestData)
      console.log(response)
      if (response.isSuccess) {
        setUserHistory(response.result.datas)
        setShowMoreButton(response.result.datas.length > itemsToShow)
      } else {
        console.error("Failed to fetch payment history:", response.message)
      }
    } catch (error) {
      console.error("Error fetching payment history:", error)
    } finally {
      nProgress.done()
      setIsLoading(false)
    }
  }

  const handleShowMore = () => {
    const newItemsToShow = itemsToShow + 5
    setItemsToShow(newItemsToShow)
    if (newItemsToShow >= userHistory.length) {
      setShowMoreButton(false)
    }
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
        <Container>
          <div className="min-h-screen pt-32 font-semibold">
            <div className="container mx-auto rounded-lg bg-transparent">
              <Link to="/">
                <button className="mb-20 inline-flex transform items-center rounded-full bg-gray-500 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-600 hover:shadow-lg">
                  <FaArrowLeft />
                  Trở về
                </button>
              </Link>
              <h1 className="mb-20 text-3xl">Lịch sử giao dịch của bạn </h1>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <ol className="relative border-s">
                    {userHistory.slice(0, itemsToShow).map((item, index) => (
                      <li key={index} className="mb-10 ms-6">
                        <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900">
                          <FaRegCalendarAlt />
                        </span>
                        <Content
                          transactionId={item.transactionId}
                          createdDate={item.createdDate}
                          content={item.content}
                          amount={item.amount}
                          advertisementPackageViewDTO={
                            item.advertisementPackageViewDTO
                          }
                          userName={item.userName}
                          orderId={item.id}
                        />
                      </li>
                    ))}
                  </ol>
                  {showMoreButton && (
                    <div className="mt-6 text-center">
                      <CustomButton
                        icon={<IconChevronDown />}
                        label="Xem thêm"
                        onClick={handleShowMore}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </motion.div>
    </AuroraBackground>
  )
}

export default HistoryView
