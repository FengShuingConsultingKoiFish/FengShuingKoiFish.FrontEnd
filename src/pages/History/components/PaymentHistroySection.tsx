import React from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { IconListDetails } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

interface PaymentProps {
  transactionId: number
  orderId: number
  userName: string
  amount: number
  createdDate: string
  content: string
  advertisementPackageViewDTO: {
    id: number
    name: string
    price: number
    description: string
    limitAd: number
    limitContent: number
    limitImage: number
    createdDate: string
  }
}

const Content: React.FC<PaymentProps> = ({
  transactionId,
  amount,
  createdDate,
  content,
  advertisementPackageViewDTO,
  userName,
  orderId
}) => {
  const navigate = useNavigate()

  const handelClickDetail = () => {
    navigate(`/chi-tiet-giao-dich/${orderId}`)
  }

  return (
    <div className="flex justify-between gap-14">
      <div className="text-dark font-semibold">
        <h3 className="mb-1 flex items-center text-lg font-semibold">
          Mã đơn hàng : {transactionId}
        </h3>
        <time className="mb-2 block text-sm font-semibold leading-none tracking-wider">
          Ngày thực hiện giao dịch : {createdDate}
        </time>
        <p className="mb-4 text-base font-normal">Nội dung : {content}</p>
        <p className="inline-flex items-center gap-1 text-base text-gray-600">
          <p>Giá :</p>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
          }).format(amount)}
        </p>
        <div className="flex gap-1 mt-4" >
          <p>Tên gói :</p>
          <div className="">{advertisementPackageViewDTO.name}</div>
        </div>
      </div>
      <div className="flex w-52 items-start">
        <CustomButton
          icon={<IconListDetails />}
          label="Xem chi tiết giao dịch"
          onClick={handelClickDetail}
        />
      </div>
    </div>
  )
}

export default Content
