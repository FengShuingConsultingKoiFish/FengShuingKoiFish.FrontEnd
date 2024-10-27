import CustomButton from "@/pages/Setting/Components/CustomBtn"

import { CardBody, CardContainer, CardItem } from "@/components/ui/3dCard"
import { Button } from "@/components/ui/MovingBorder"
import Status from "@/components/ui/Status"

interface ImageViewDtos {
  id: number
  filePath: string
  altText?: string | null
  userId: string
  userName: string
  createdDate: string
}

interface PurchasedPkgProps {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  createdDate: string
  imageViewDtos: ImageViewDtos[]
  status: number
  onClick: () => void
}

export function PurchasedPkgSection({
  name,
  price,
  limitAd,
  limitContent,
  limitImage,
  imageViewDtos,
  status,
  onClick
}: PurchasedPkgProps) {
  const imageUrl =
    imageViewDtos.length > 0
      ? imageViewDtos[0].filePath
      : "https://via.placeholder.com/150"

  return (
    <CardContainer
      className="rounded-xl bg-white shadow-2xl"
      containerClassName="max-w-xs"
    >
      <CardBody className="relative p-6">
        <CardItem className="mb-4" translateZ={50}>
          <img alt={name} src={imageUrl} className="h-96 w-full object-cover" />
        </CardItem>
        <CardItem className="mb-2 flex-grow" translateZ={40}>
          <h3 className="text-xl font-bold">{name}</h3>
        </CardItem>
        <CardItem className="mb-2 flex-grow" translateZ={40}>
          <Status status={status} />
        </CardItem>

        <CardItem translateZ={30}>
          <p className="card-item-description flex-grow text-gray-600">
            Giới hạn quảng cáo : {limitAd}
          </p>
        </CardItem>
        <CardItem translateZ={30}>
          <p className="card-item-description flex-grow text-gray-600">
            Giới hạn nội dung : {limitContent}
          </p>
        </CardItem>
        <CardItem translateZ={30}>
          <p className="card-item-description flex-grow text-gray-600">
            Giới hạn hình ảnh : {limitImage}
          </p>
        </CardItem>
        <div className="mt-4 flex flex-row items-center gap-4">
          <div className="flex flex-row items-center justify-between gap-6">
            <Button
              borderRadius="1.75rem"
              className="border-neutral-200 bg-white text-black"
            >
              <span className="mr-1">Giá :</span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
              }).format(price)}
            </Button>
            <CustomButton label="Xem chi tiết" onClick={onClick} />
          </div>
        </div>
      </CardBody>
    </CardContainer>
  )
}
