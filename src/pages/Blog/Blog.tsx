import { useEffect, useState } from "react"

import { motion } from "framer-motion"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"

import { getAllBlogs } from "@/lib/api/Blog"
import { createUpdateComment, createUpdateCommentForAdvertisement } from "@/lib/api/Comments"

import { AuroraBackground } from "@/components/ui/AuroraBg"
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
import { ClipLoader } from "react-spinners"
import { RootState } from "@/lib/redux/store"
import { useSelector } from "react-redux"
import { getAllAdvertisements } from "@/lib/api/Advertisement"
import { AdvertisementCard } from "@/components/ui/advertisement/AdvertisementCard"

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
  description: string
  price: number
  
  

  createdDate: string
  status: string
  imageViewDtos: ImageViewDto[]
  commentViewDtos?: []
}

interface Advertisement {
  id: number
  title: string
  userName: string
  createdDate: string
  description: string
  price: number
  content: string
  imageViewDtos: ImageViewDto[]
  commentViewDtos?: []
}

interface InterleavedItem {
  type: "blog" | "advertisement";
  data: Blog | Advertisement;
}

const Blog = () => {
  const currentUser = useSelector((state: RootState) => state.users.currentUser)
  const [, setBlogs] = useState<Blog[]>([])
  const [, setAdvertisements] = useState<Advertisement[]>([]);
  const [combinedItems, setCombinedItems] = useState<InterleavedItem[]>([]);
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(7)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [orderBlog, setOrderBlog] = useState<1 | 2>(1)
  const [, setComments] = useState<{ [key: number]: string }>({}) 
  const [apiMessages, setApiMessages] = useState<{ [key: number]: string }>({}) 
  const [activeBlogId, setActiveBlogId] = useState<number | null>(null);

  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const blogRequestData = {
          pageIndex,
          pageSize,
          title: null,
          blogStatus: 2,
          orderBlog,
          orderComment: 1,
          orderImage: null
        };
        const advertisementRequestData = {
          pageIndex,
          pageSize,
          advertisementStatus: 1, // Adjust the status based on your requirements
          orderAdvertisement: 1,
          orderComment: null,
          orderImage: null
        };

        const [blogResponse, adResponse] = await Promise.all([
          getAllBlogs(blogRequestData),
          getAllAdvertisements(advertisementRequestData)
        ]);
        //@ts-ignore
        setBlogs(blogResponse.result.datas);
        //@ts-ignore
        setAdvertisements(adResponse.result.datas);
        setTotalPages(Math.max(blogResponse.result.totalPages, adResponse.result.totalPages));

        // Interleave blogs and advertisements
        const interleavedItems = [];
        const maxItems = Math.max(blogResponse.result.datas.length, adResponse.result.datas.length);
        for (let i = 0; i < maxItems; i++) {
          if (i < blogResponse.result.datas.length) interleavedItems.push({ type: "blog", data: blogResponse.result.datas[i] });
          if (i < adResponse.result.datas.length) interleavedItems.push({ type: "advertisement", data: adResponse.result.datas[i] });
        }
        //@ts-ignore
        setCombinedItems(interleavedItems);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageIndex, orderBlog]);

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

  const handleBlogCommentSubmit = async (blogId: number, comment: string) => {
    try {
      const response = await createUpdateComment({
        blogId,
        content: comment
      })

      console.log(response)

      if (response.isSuccess) {
        setApiMessages((prev) => ({
          ...prev,
          [blogId]: ""
        }))
        setComments((prev) => ({ ...prev, [blogId]: "" }))
      } else {
        setApiMessages((prev) => ({
          ...prev,
          [blogId]: response.message || "Failed to submit comment."
        }))
      }
    } catch (error: any) {
      setApiMessages((prev) => ({
        ...prev,
        [blogId]: error.message || "An unknown error occurred."
      }))
    }
  }

  const handleAdCommentSubmit = async (advertisementId: number, comment: string) => {
    try {
      const response = await createUpdateCommentForAdvertisement({
        advertisementId,
        content: comment
      })

      console.log(response)

      if (response.isSuccess) {
        setApiMessages((prev) => ({
          ...prev,
          [advertisementId]: ""
        }))
        setComments((prev) => ({ ...prev, [advertisementId]: "" }))
      } else {
        setApiMessages((prev) => ({
          ...prev,
          [advertisementId]: response.message || "Failed to submit comment."
        }))
      }
    } catch (error: any) {
      setApiMessages((prev) => ({
        ...prev,
        [advertisementId]: error.message || "An unknown error occurred."
      }))
    }
  }

 
  const handleCommentToggle = (blogId: number) => {
    setActiveBlogId((prevBlogId) => (prevBlogId === blogId ? null : blogId)); 
  };

  const images = [
    "https://images.unsplash.com/photo-1521584934521-f27ac11b7523?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1466354424719-343280fe118b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1684221804306-06bd980f794d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="relative flex w-full flex-col justify-start gap-4 pb-10"
      >
        <Hero images={images} />
        <Container>
          <div className="my-10 flex items-center gap-5 font-semibold">
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
            <div className="flex items-center justify-center">
              <ClipLoader size={40} color="#000" />
            </div>
          ) : combinedItems.length > 0 ? (
            <div className="flex w-full justify-center">
              <div className="flex w-[60rem] flex-col justify-center">
                {combinedItems.map((item, index) =>
                  item.type === "blog" ? (
                    <ArticleCard
                      key={index}
                      id={item.data.id}
                      img={
                        item.data.imageViewDtos.length > 0
                          ? item.data.imageViewDtos.map(image => image.filePath)
                          : ["https://via.placeholder.com/150"]
                      }
                      title={item.data.title}
                      content={item.data.content}
                      userName={item.data.userName}
                      createdDate={item.data.createdDate}
                      commentViewDtos={item.data.commentViewDtos}
                      activeBlogId={activeBlogId}
                      //@ts-ignore
                      onSubmitComment={handleBlogCommentSubmit}
                      onToggleComment={handleCommentToggle}
                      currentUser={currentUser}
                      apiMessage={apiMessages[item.data.id]}
                    />
                  ) : (
                    <AdvertisementCard
                      key={index}
                      id={item.data.id}
                      img={
                        item.data.imageViewDtos.length > 0
                          ? item.data.imageViewDtos.map(image => image.filePath)
                          : ["https://via.placeholder.com/150"]
                      }
                      title={item.data.title}
                      description={item.data.description}
                      price={item.data.price}
                      userName={item.data.userName}
                      createdDate={item.data.createdDate}
                      commentViewDtos={item.data.commentViewDtos}
                      activeBlogId={activeBlogId}
                      //@ts-ignore
                      onSubmitComment={handleAdCommentSubmit}
                      onToggleComment={handleCommentToggle}
                      currentUser={currentUser}
                    />
                  )
                )}
              </div>
            </div>
          ) : (
            <div>No blogs or advertisements available.</div>
          )}

          <div className="flex justify-center mt-6">
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
        </Container>
      </motion.div>
    </AuroraBackground>
  );
};

export default Blog
