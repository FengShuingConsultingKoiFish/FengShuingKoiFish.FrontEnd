import React from "react"
import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { LayoutGrid } from "./LayoutImg"
import { IconEdit } from "@tabler/icons-react"

interface ImageViewDto {
  id: number
  filePath: string
  userId: string
  userName: string
  createdDate: string
}

interface AdverPkgSectionProps {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  clickToEdit: () => void;
  imageViewDtos: ImageViewDto[]
}

const AdverPkgSection: React.FC<AdverPkgSectionProps> = ({
  id,
  name,
  price,
  description,
  limitAd,
  limitContent,
  limitImage,
  imageViewDtos,
  clickToEdit
}) => {
  const transformedImages = imageViewDtos.map((image) => ({
    id: image.id,
    thumbnail: image.filePath,
    content: (
      <div>
        <p className="text-sm text-white">Uploaded by {name}</p>
      </div>
    ),
    className: "relative bg-white rounded-xl h-80 w-full"
  }))

  return (
    <>
      <div className="relative mb-6 rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="items-center px-4 py-3">
          <div className="flex flex-col justify-start gap-3">
            <div className="flex flex-row justify-between">
              <p className="inline-flex items-start gap-3 text-xl font-semibold">
                Tên gói :<span className="text-xl font-medium">{name}</span>
              </p>
            </div>

            <p className="inline-flex items-center gap-2 text-gray-500">
              <p>Giá :</p>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
              }).format(price)}
            </p>
          </div>
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          <CustomButton
            icon={<IconEdit />}
            label="Chỉnh sửa"
            onClick={clickToEdit}
          />
        </div>

        <div className="flex w-full flex-col px-4 justify-start gap-2">
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p className=""> Miêu tả:</p>
            {description}
          </p>
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p>Giới hạn quảng cáo :</p>
            {limitAd}
          </p>
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p>Giới hạn nội dung :</p>
            {limitContent}
          </p>
          <p className="inline-flex items-center gap-2 break-words text-sm text-gray-700">
            <p>Giới hạn ảnh :</p>
            {limitImage}
          </p>
        </div>

        {imageViewDtos.length > 0 && (
          <div className="">
            <LayoutGrid cards={transformedImages} />
          </div>
        )}
      </div>
    </>
  )
}

export default AdverPkgSection
