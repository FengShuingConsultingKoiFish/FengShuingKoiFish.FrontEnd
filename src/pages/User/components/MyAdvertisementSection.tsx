import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { Link } from "react-router-dom"

import { CardBody, CardContainer, CardItem } from "@/components/ui/3dCard"
import { Button, MovingBorder } from "@/components/ui/MovingBorder"
import Status from "@/components/ui/Status"

interface ImageViewDtos {
  id: number
  filePath: string
  altText?: string | null
  userId: string
  userName: string
  createdDate: string
}

interface CommentViewDtos {
    id: number
    content: string
}


interface AdvertisementProps {
  id: number
  userName: string
  title: string
  description: string
  createdDate: string
  status: string
  imageViewDtos: ImageViewDtos[]
  onClick: () => void
}

export function MyAdvertisementSection({
  id,
  userName,
  title,
  description,
  createdDate,
  status,
  imageViewDtos,
  onClick
}: AdvertisementProps) {
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
          <img alt={userName} src={imageUrl} className="h-96 w-full object-cover" />
        </CardItem>
        <CardItem className="mb-2 flex-grow" translateZ={40}>
          <h3 className="text-xl font-bold">Tiêu đề :{title}</h3>
        </CardItem>
        <CardItem className="mb-2 flex-grow" translateZ={40}>
          <Status status={status} />
        </CardItem>

        <CardItem translateZ={30}>
          <p className="card-item-description flex-grow text-gray-600">
            Miêu tả : {description}
          </p>
        </CardItem>
        <CardItem translateZ={30}>
          <p className="card-item-description flex-grow text-gray-600">
            Ngày tạo: {createdDate}
          </p>
        </CardItem>
        <div className="mt-4 flex flex-row items-center gap-4">
          <div className="flex flex-row items-center justify-between gap-6">
            {/* <CustomButton label="Xem chi tiết" onClick={onClick} /> */}
          </div>
        </div>
      </CardBody>
    </CardContainer>
  )
}
