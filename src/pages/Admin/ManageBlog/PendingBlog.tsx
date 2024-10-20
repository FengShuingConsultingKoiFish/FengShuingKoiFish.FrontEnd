import React, { useEffect, useState } from "react"

import toast from "react-hot-toast"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"

import { getAllBlogsForAdmin, updateBlogStatus } from "@/lib/api/Blog"

import CustomButton from "../../Setting/Components/CustomBtn"
import PostSection from "../components/BlogSection"

interface ImageViewDto {
  id: number
  filePath: string
  altText: string | null
  userId: string
  userName: string
  createdDate: string
}

interface Blog {
  id: number
  title: string
  content: string
  userName: string
  createdDate: string
  status: string
  imageViewDtos: ImageViewDto[]
  commentViewDtos?: []
}

export const PendingPosts: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [pageIndex])

  const fetchBlogs = async () => {
    setIsLoading(true)
    try {
      const requestData = {
        pageIndex,
        pageSize,
        title: "",
        blogStatus: 1,
        orderBlog: null,
        orderComment: null,
        orderImage: null
      }
      const response = await getAllBlogsForAdmin(requestData)
      if (response.isSuccess) {
        setBlogs(response.result.datas)
        setTotalPages(response.result.totalPages)
      } else {
        console.error(response.message)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex((prev) => prev + 1)
    }
  }

  const handleVerify = async (id: number) => {
    try {
      await updateBlogStatus({ id, status: 2 })
      toast.success("Duyệt bài thành công !")
      fetchBlogs()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleDeny = async (id: number) => {
    try {
      await updateBlogStatus({ id, status: 3 })
      toast.success("Đã hủy bài thành công")
      fetchBlogs()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  return (
    <div className="relative flex w-full flex-col">
      <div className="">
        <h2 className="mb-4 text-2xl font-semibold">Các Blog đang đợi</h2>

        {isLoading ? (
          <p>Đang tải...</p>
        ) : (
          <div>
            {blogs.length === 0 ? (
              <p>Không có blog nào đang chờ xử lý.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {blogs.map((blog) => (
                  <PostSection
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    content={blog.content}
                    userName={blog.userName}
                    createdDate={blog.createdDate}
                    status={blog.status}
                    changeStatusToVerify={() => handleVerify(blog.id)}
                    changeStatusToDeny={() => handleDeny(blog.id)}
                    imageViewDtos={blog.imageViewDtos}
                    commentViewDtos={blog.commentViewDtos || []}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="fixed bottom-0 mt-6 inline-flex translate-x-[45rem] items-center">
          <CustomButton
            icon={<IoIosArrowDropleftCircle />}
            label="Trang trước"
            onClick={handlePreviousPage}
            disabled={pageIndex === 1 || isLoading}
          />
          <span className="inline-flex items-center px-4">{`Trang ${pageIndex} trên ${totalPages}`}</span>
          <CustomButton
            icon={<IoIosArrowDroprightCircle />}
            label="Trang sau"
            onClick={handleNextPage}
            disabled={pageIndex === totalPages || isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default PendingPosts
