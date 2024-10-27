import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { IconEdit, IconMessageCircle} from "@tabler/icons-react"

import { getUserAvatarByUserName } from "@/lib/api/User"

import Avatar from "@/components/layout/header/Avatar"

import Status from "../Status"

interface CommentViewDto {
  id: number
  userName: string
  content: string
  createdDate: string
}

interface ArticleCardProps {
  id: number
  img: string[]
  title: string
  content: string
  userName: string
  createdDate: string
  status: string
  userImg?: string
  commentViewDtos?: CommentViewDto[]
  activeBlogId: number | null 
  onToggleViewComment: (blogId: number) => void
  onEdit: () => void
}

export const UserArticle: React.FC<ArticleCardProps> = ({
  id,
  img,
  title,
  content,
  createdDate,
  commentViewDtos = [],
  activeBlogId,
  status,
  onToggleViewComment,
  onEdit
}) => {
  // const maxContentLength = 150;
  // const truncatedContent =
  //   content.length > maxContentLength ? `${content.slice(0, maxContentLength)}...` : content;
  const [avatarUrls, setAvatarUrls] = useState<{ [key: string]: string }>({})
  const [visibleComments, setVisibleComments] = useState(2)

  useEffect(() => {
    const fetchAvatars = async () => {
      const avatars: { [key: string]: string } = {}
      for (const comment of commentViewDtos) {
        if (!avatarUrls[comment.userName]) {
          try {
            const avatarUrl = await getUserAvatarByUserName(comment.userName)
            avatars[comment.userName] = avatarUrl.result
          } catch (error) {
            console.error(
              `Error fetching avatar for ${comment.userName}:`,
              error
            )
          }
        }
      }
      if (Object.keys(avatars).length > 0) {
        setAvatarUrls((prevAvatars) => ({ ...prevAvatars, ...avatars }))
      }
    }

    fetchAvatars()
  }, [commentViewDtos])

  const handleShowMore = () => {
    setVisibleComments((prev) => prev + 2)
  }

  return (
    <div className="my-5 flex flex-col rounded-lg border bg-white shadow-2xl">
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="tex-xl inline-flex items-center justify-start gap-3 font-semibold"></div>

          <div className="tex-xl inline-flex items-center justify-between gap-3 font-semibold">
            <div className="inline-flex items-center gap-2">
              <div className="flex flex-col justify-start gap-5">
                <div>
                  <p>Ngày đăng :</p>
                  <div className="text-sm text-gray-500">{createdDate}</div>
                </div>

                <Status status={status} />
              </div>
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
        <p className="mb-2 break-words text-gray-700">{content}</p>
      </div>

      {/* Image Gallery */}
      {Array.isArray(img) && img.length > 0 && (
        <div className="flex flex-wrap gap-1 p-4">
          {img.length === 1 ? (
            <img
              src={img[0]}
              alt="Post"
              className="h-full w-full rounded-lg object-cover"
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
                  className="h-full w-full rounded-lg object-cover"
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

      <div className="flex justify-center space-x-40 border-t p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleViewComment(id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
          >
            <IconMessageCircle />
            <span>Xem bình luận</span>
          </button>
        </div>
      </div>
      {activeBlogId === id && commentViewDtos.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          Không có bình luận nào
        </div>
      )}
      {/* Display Comments with Show More Logic */}
      {commentViewDtos.length > 0 && (
        <div className="p-4 text-black">
          {commentViewDtos.slice(0, visibleComments).map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col items-start gap-4 border-t py-2"
            >
              <div className="inline-flex items-center">
                <Avatar
                  userImg={avatarUrls[comment.userName]}
                  w="40px"
                  h="40px"
                />
                <div className="flex w-fit flex-col items-start justify-start rounded-full bg-gray-200 px-5 py-1">
                  <p className="font-semibold">{comment.userName}</p>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                </div>
              </div>

              <p className="inline-flex justify-start gap-1 text-xs text-gray-400">
                <span>Đăng vào :</span>
                {comment.createdDate}
              </p>
            </div>
          ))}

          {/* Show More Button */}
          {visibleComments < commentViewDtos.length && (
            <button
              onClick={handleShowMore}
              className="text-blue-500 hover:underline"
            >
              Xem thêm ...
            </button>
          )}
        </div>
      )}
    </div>
  )
}
