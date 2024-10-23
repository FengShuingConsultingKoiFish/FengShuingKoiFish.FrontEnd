import { useEffect, useState } from "react"

import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"

import { getAllBlogs } from "@/lib/api/Blog"

import Container from "@/components/ui/Container"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/Select"
import { ArticleCard } from "@/components/ui/blog/ArticleCard"
import { Hero } from "@/components/ui/blog/Hero"

import CustomButton from "../Setting/Components/CustomBtn"

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

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(7)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [orderBlog, setOrderBlog] = useState<1 | 2>(1)

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchBlogs = async () => {
      try {
        setIsLoading(true)
        const requestData = {
          pageIndex,
          pageSize,
          title: null,
          blogStatus: 2,
          orderBlog,
          orderComment: null,
          orderImage: null
        }
        const response = await getAllBlogs(requestData)
        console.log(response.result.datas)
        setBlogs(response.result.datas)
        setTotalPages(response.result.totalPages)
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [pageIndex, orderBlog])

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

  const images = [
    "https://images.unsplash.com/photo-1521584934521-f27ac11b7523?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1466354424719-343280fe118b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1684221804306-06bd980f794d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  return (
    <div className="">
      <Hero images={images} />
      <Container>
        <div className="my-10 flex flex-row items-center justify-start gap-5 font-semibold">
          <span>Bộ lọc</span>
          <Select onValueChange={handleOrderChange} value={orderBlog === 1 ? "newest" : "oldest"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Thời gian đăng bài" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : blogs.length > 0 ? (
          <div className="flex w-full justify-center">
            <div className="flex w-[60rem] flex-col justify-center">
              {blogs.map((blog) => (
                <ArticleCard
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
                />
              ))}
            </div>
          </div>
        ) : (
          <div>No blogs available.</div>
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
      </Container>
    </div>
  )
}

export default Blog
