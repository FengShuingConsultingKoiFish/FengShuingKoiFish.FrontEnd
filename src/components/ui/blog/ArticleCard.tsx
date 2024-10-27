import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import {
  IconCaretUpFilled,
  IconMessageCircle,
  IconShare
} from "@tabler/icons-react"

import { getUserAvatarByUserName } from "@/lib/api/User"

import Avatar from "@/components/layout/header/Avatar"

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
  userImg?: string
  commentViewDtos?: CommentViewDto[]
  activeBlogId: number | null
  currentUser: any
  onToggleComment: (blogId: number) => void
  onSubmitComment: (blogId: number, comment: string) => void
  apiMessage?: string
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  img,
  title,
  content,
  userName,
  createdDate,
  commentViewDtos = [],
  activeBlogId,
  currentUser,
  onToggleComment,
  onSubmitComment
}) => {
  const [comment, setComment] = useState("")
  const [avatarUrls, setAvatarUrls] = useState<{ [key: string]: string }>({})
  const [visibleComments, setVisibleComments] = useState(2)

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }

  const handleCommentSubmit = () => {
    onSubmitComment(id, comment)
    setComment("")
  }

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
          <div className="tex-xl inline-flex items-center justify-start gap-3 font-semibold">
            <p className="">Người đăng :</p>
            <div className="font-semibold">{userName}</div>
          </div>

          <div className="tex-xl inline-flex items-center justify-start gap-3 font-semibold">
            <p>Ngày đăng :</p>
            <div className="text-sm text-gray-500">{createdDate}</div>
          </div>
        </div>
      </div>

      {/* Body (Text Content) */}
      <div className="px-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mb-2 text-gray-700">{content}</p>
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

      {/* Footer (Like, Comment, Share) */}
      <div className="flex justify-center space-x-40 border-t p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleComment(id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
          >
            <IconMessageCircle />
            <span>Bình luận</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
            <IconShare />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Only show the comment box if this blog is active */}
      {activeBlogId === id && (
        <div className="mb-0 w-full p-4">
          {currentUser ? (
            <>
              {/* Comment Input Box */}
              <div className="mb-4 inline-flex w-full items-center justify-start gap-4 rounded-lg rounded-t-lg border border-gray-200 bg-white px-4 py-2">
                <textarea
                  placeholder="Thêm bình luận..."
                  value={comment}
                  onChange={handleCommentChange}
                  className="w-full flex-1 rounded-lg border p-2"
                  rows={2}
                />
                <CustomButton
                  icon={<IconCaretUpFilled />}
                  label="Đăng"
                  onClick={handleCommentSubmit}
                />
              </div>

              {/* Display Comments */}
              {commentViewDtos.length > 0 ? (
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
              ) : (
                <div className="text-center text-gray-500">Không có bình luận nào</div>
              )}
            </>
          ) : (
            <div className="font-semibold text-center text-gray-500">
              Bạn phải đăng nhập để xem và bình luận bài viết này !
            </div>
          )}
        </div>
      )}
    </div>
  )
}
