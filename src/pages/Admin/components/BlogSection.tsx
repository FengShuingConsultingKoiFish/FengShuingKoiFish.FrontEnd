import React from "react"
import Status from "@/components/ui/Status"
import { LayoutGrid } from "./LayoutImg"

interface ImageViewDto {
  id: number
  filePath: string
  userId: string
  userName: string
  createdDate: string
}

interface BlogSectionProps {
  id: number
  title: string
  content: string
  userName: string
  createdDate: string
  status: string
  imageViewDtos: ImageViewDto[]
  commentViewDtos: []
}

const PostSection: React.FC<BlogSectionProps> = ({
  title,
  content,
  userName,
  createdDate,
  status,
  imageViewDtos
}) => {
  const transformedImages = imageViewDtos.map((image) => ({
    id: image.id,
    thumbnail: image.filePath,
    content: (
      <div>
        <p className="text-sm text-white">Uploaded by {userName}</p>
      </div>
    ),
    className: "relative bg-white rounded-xl h-60 w-full"
  }))

  return (
    <>
      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="flex items-center px-4 py-3">
          <div className="flex flex-col justify-start gap-3">
            <p className="inline-flex gap-3 text-xl font-semibold">
              Người đăng :<p className="text-xl font-medium">{userName}</p>
            </p>
            <p className="text-xs text-gray-500">Ngày tạo : {createdDate}</p>
            <span className="inline-flex items-center gap-4">
              <p className="text-xl font-semibold">Trạng thái</p>
              <Status status={status} />
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 flex flex-col w-full">
          <p className="mb-2 text-base font-medium">{title}</p>
          <p className="text-sm text-gray-700 flex ">{content}</p>
        </div>

        {/* Post Images - Render with LayoutGrid */}
        {imageViewDtos.length > 0 && (
          <div className="">
            <LayoutGrid cards={transformedImages} />
          </div>
        )}
      </div>
    </>
  )
}

export default PostSection
