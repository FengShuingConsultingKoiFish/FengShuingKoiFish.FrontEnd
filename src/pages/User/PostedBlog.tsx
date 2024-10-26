import { useEffect, useState } from "react"

import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"
import { useDispatch } from "react-redux"
import { ClipLoader } from "react-spinners"

import useBlogModal from "@/hooks/useBlogModel"
import useEditBlogModal from "@/hooks/useEditBlogModal"

import { GetAllBlogsForUser } from "@/lib/api/User"
import { setBlogsList, setDetailBlog } from "@/lib/redux/reducers/userBlogSlice"

import Container from "@/components/ui/Container"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/Select"
import { UserArticle } from "@/components/ui/blog/UserArticleEdit"

import CreateBlogModal from "../Blog/components/CreateBlogModal"
import CustomButton from "../Setting/Components/CustomBtn"
import EditBlogModal from "./components/EditBlogModal"

interface ImageViewDto {
  id: number
  filePath: string
  altText?: string | null
  userId: string
  userName: string
  createdDate: string
}

enum BlogStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3
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
  imageIds?: number[]
}

const PostedBlog = () => {
  const [postedBlogs, setPostedBlogs] = useState<Blog[]>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(7)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [orderBlog, setOrderBlog] = useState<1 | 2>(1)
  const [blogStatus, setBlogStatus] = useState<BlogStatus | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const editBlogModal = useEditBlogModal()
  const dispatch = useDispatch()



  const fetchBlogs = async () => {
    try {
      setIsLoading(true)
      const requestData = {
        pageIndex,
        pageSize,
        title: "",
        blogStatus,
        orderBlog,
        orderComment: null,
        orderImage: null
      }
      const response = await GetAllBlogsForUser(requestData)
      console.log(response.result.datas)
      setPostedBlogs(response.result.datas)
      setTotalPages(response.result.totalPages)
      dispatch(setBlogsList(response.result.datas))
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0,0)
    fetchBlogs()
  }, [pageIndex, orderBlog, blogStatus])

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

  const handleOrderChange = (value: "newest" | "oldest") => {
    if (value === "newest") {
      setOrderBlog(1)
    } else if (value === "oldest") {
      setOrderBlog(2)
    }
    setPageIndex(1)
  }

  const handleBlogStatusChange = (value: string) => {
    if (value === "all") {
      setBlogStatus(null)
    } else {
      setBlogStatus(Number(value))
    }
    setPageIndex(1)
  }

  const handleEditBlog = (blog: Blog) => {
    dispatch(setDetailBlog(blog))
    editBlogModal.onOpen()
  }

  return (
    <div className="">
      <Container>
        <div className="my-10 flex flex-col items-center justify-center gap-5 font-semibold">
          <div className="text-3xl font-semibold">Các bài đăng của bạn</div>
          <span>Bộ lọc</span>
          <div className="flex flex-row justify-center gap-4">
            <Select
              onValueChange={handleOrderChange}
              value={orderBlog === 1 ? "newest" : "oldest"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Thời gian đăng bài" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={handleBlogStatusChange}
              value={blogStatus === null ? "all" : blogStatus?.toString()}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái bài viết" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={BlogStatus.Pending.toString()}>
                  Chờ duyệt
                </SelectItem>
                <SelectItem value={BlogStatus.Approved.toString()}>
                  Đã duyệt
                </SelectItem>
                <SelectItem value={BlogStatus.Rejected.toString()}>
                  Từ chối
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <ClipLoader size={40} color="#000" />
          </div>
        ) : postedBlogs.length > 0 ? (
          <div className="flex w-full justify-center">
            <div className="flex w-[60rem] flex-col justify-center">
              {postedBlogs.map((blog) => (
                <UserArticle
                  key={blog.id}
                  id={blog.id}
                  img={
                    blog.imageViewDtos.length > 0
                      ? blog.imageViewDtos.map((image) => image.filePath)
                      : ["https://via.placeholder.com/150"]
                  }
                  title={blog.title}
                  content={blog.content}
                  userName={blog.userName}
                  createdDate={blog.createdDate}
                  status={blog.status}
                  onEdit={() => handleEditBlog(blog)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>Bạn chưa đăng blog nào.</div>
        )}
        <div className="flex justify-center">
          <div className="mt-6 inline-flex items-center">
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
        <EditBlogModal onSuccess={fetchBlogs} />
      </Container>
    </div>
  )
}

export default PostedBlog
