import React from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { AiOutlineCheck } from "react-icons/ai"
import { TiCancel } from "react-icons/ti"

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
  changeStatusToVerify: any
  changeStatusToDeny: any
  imageViewDtos: ImageViewDto[]
  commentViewDtos: []
}

const PostSection: React.FC<BlogSectionProps> = ({
  title,
  content,
  userName,
  createdDate,
  status,
  changeStatusToVerify,
  changeStatusToDeny,
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
    <div className="mb-6 relative rounded-lg border border-gray-200 bg-white shadow-md">
      <div className="items-center px-4 py-3">
        <div className="flex flex-col justify-start gap-3">
          <div className="flex flex-row justify-between">
            <p className="inline-flex items-start gap-3 text-xl font-semibold">
              Người đăng :<span className="text-xl font-medium">{userName}</span>
            </p>
          </div>

          <p className="text-xs text-gray-500">Ngày tạo : {createdDate}</p>

          <span className="inline-flex items-center gap-4">
            <p className="text-xl font-semibold">Trạng thái</p>
            <Status status={status} />
          </span>
        </div>
      </div>
      
      {status !== "Approved" && status !== "Rejected" && (
          <div className="absolute top-4 right-4 flex gap-2">
            <CustomButton
              icon={<AiOutlineCheck />}
              label="Duyệt bài"
              onClick={changeStatusToVerify}
            />
            <CustomButton
              icon={<TiCancel />}
              label="Không duyệt"
              onClick={changeStatusToDeny}
            />
          </div>
        )}

      {/* Post Content */}
      <div className="flex w-full flex-col px-4">
        <p className="mb-2 text-base font-medium">{title}</p>
        <p className="break-words text-sm text-gray-700">{content}</p>
      </div>

      {/* Post Images - Render with LayoutGrid */}
      {imageViewDtos.length > 0 && (
        <div className="">
          <LayoutGrid cards={transformedImages} />
        </div>
      )}
    </div>
  </>
);
};


export default PostSection
