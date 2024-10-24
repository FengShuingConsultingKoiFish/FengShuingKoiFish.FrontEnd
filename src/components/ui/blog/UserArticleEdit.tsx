import React from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { IconEdit, IconMessageCircle, IconShare } from "@tabler/icons-react"

interface ArticleCardProps {
  id: number
  img: string[]
  title: string
  content: string
  userName: string
  createdDate: string
  userImg?: string
  onEdit: () => void;
}

export const UserArticle: React.FC<ArticleCardProps> = ({
  id,
  img,
  title,
  content,
  userName,
  createdDate,
  onEdit
}) => {
  // const maxContentLength = 150;
  // const truncatedContent =
  //   content.length > maxContentLength ? `${content.slice(0, maxContentLength)}...` : content;

  return (
    <div className="my-5 flex flex-col rounded-lg border bg-white shadow-2xl">
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="tex-xl inline-flex items-center justify-start gap-3 font-semibold"></div>

          <div className="tex-xl inline-flex items-center justify-between gap-3 font-semibold">
            <div className="inline-flex items-center gap-2">
              <p>Ngày đăng :</p>
              <div className="text-sm text-gray-500">{createdDate}</div>
            </div>

            <div>
              <CustomButton
                icon={<IconEdit />}
                label="Chỉnh sửa bài"
                onClick={onEdit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body (Text Content) */}
      <div className="px-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mb-2 text-gray-700 break-words">{content}</p>
      </div>

      {/* Image Gallery */}
      {Array.isArray(img) && img.length > 0 && (
        <div className="flex flex-wrap gap-1 p-4">
          {img.length === 1 ? (
            <img
              src={img[0]}
              alt="Post"
              className="h-auto w-full rounded-lg object-cover"
            />
          ) : (
            img.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`flex-1 ${index === 3 ? "relative" : ""}`}
              >
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="h-80 w-full rounded-lg object-cover"
                />
                {index === 3 && img.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 text-2xl font-semibold text-white">
                    +{img.length - 4}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
