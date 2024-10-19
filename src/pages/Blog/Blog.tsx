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

const Blog = () => {
  const images = [
    "https://images.unsplash.com/photo-1521584934521-f27ac11b7523?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1466354424719-343280fe118b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1684221804306-06bd980f794d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  return (
    <div className="">
      <Hero images={images} />
      <Container>
        <div className="flex flex-row items-center justify-start gap-5 my-10 font-semibold">
         <span>Bộ lọc</span>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Thời gian đăng bài" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
          <ArticleCard
            img="https://images.unsplash.com/photo-1714523580277-c4130f4b4dfe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title="This fish is incredible"
            body="I just visit this website and i found a lot of interesting things and received some useful consulting"
            author="Nguyen Van A"
            date="19/09/2024"
          />
          <ArticleCard
            img="https://images.unsplash.com/photo-1522567659205-ee20ba167aaa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title="This fish is incredible"
            body="I just visit this website and i found a lot of interesting things and received some useful consulting"
            author="Nguyen Van A"
            date="19/09/2024"
          />
          <ArticleCard
            img="https://images.unsplash.com/photo-1658266588086-1a88604ad115?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title="This fish is incredible"
            body="I just visit this website and i found a lot of interesting things and received some useful consulting"
            author="Nguyen Van A"
            date="19/09/2024"
          />
          <ArticleCard
            img="https://images.unsplash.com/photo-1714187343814-63a549b5b9cf?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            title="This fish is incredible"
            body="I just visit this website and i found a lot of interesting things and received some useful consulting"
            author="Nguyen Van A"
            date="19/09/2024"
          />
        </div>
      </Container>
    </div>
  )
}

export default Blog
