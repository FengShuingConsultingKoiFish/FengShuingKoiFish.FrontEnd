import React from "react"

import { LayoutGrid } from "./LayoutImg"

interface ImageViewDto {
  id: number
  filePath: string
  userId: string
  userName: string
  createdDate: string
}

interface AdvertisementPkgView {
  id: number
  name: string
  createdBy: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  imageViewDTOs: ImageViewDto[]
}

interface PaymentSectionProps {
  id: number
  userName: string
  transactionId: number
  content: string
  amount: number
  createdDate: string
  advertisementPackageViewDTO: AdvertisementPkgView
  packageName: string
}

const AllPaymentSection: React.FC<PaymentSectionProps> = ({
  userName,
  transactionId,
  content,
  amount,
  createdDate,
  advertisementPackageViewDTO,
  packageName
}) => {
  const transformedImages = advertisementPackageViewDTO.imageViewDTOs.map(
    (image) => ({
      id: image.id,
      thumbnail: image.filePath,
      content: (
        <div>
          <p className="text-sm text-white">
            Được đăng bởi : {advertisementPackageViewDTO.createdBy}
          </p>
        </div>
      ),
      className: "relative bg-white rounded-xl h-80 w-full"
    })
  )

  return (
    <>
      <div className="relative mb-6 rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="items-center px-4 py-3">
          <div className="flex flex-col justify-start gap-3">
            <div className="flex flex-col justify-between space-y-3">
              <p className="inline-flex items-start gap-3 text-xl font-semibold">
                Mã giao dịch :
                <span className="text-xl font-medium">{transactionId}</span>
              </p>
              <p className="inline-flex items-start gap-3 text-xl font-semibold">
                Tài khoản người mua :
                <span className="text-xl font-medium">{userName}</span>
              </p>
              <p className="inline-flex items-start gap-3 text-xl font-semibold">
                Tên gói quảng cáo :
                <span className="text-xl font-medium">{packageName}</span>
              </p>
            </div>

            <p className="inline-flex items-center gap-2 text-gray-500">
              <p>Số tiền :</p>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
              }).format(amount)}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col justify-start gap-2 px-4">
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p className=""> Nội dung giao dịch :</p>
            {content}
          </p>
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p>Ngày thực hiện giao dịch :</p>
            {createdDate}
          </p>
        </div>

        {advertisementPackageViewDTO.imageViewDTOs.length > 0 && (
          <div className="">
            <LayoutGrid cards={transformedImages} />
          </div>
        )}
      </div>
    </>
  )
}

export default AllPaymentSection
