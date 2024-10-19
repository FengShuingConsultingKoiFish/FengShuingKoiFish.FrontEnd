
import CreateBlog from "@/components/ui/createBlog/CreateBlog"
import ArtFengShui from "@/components/ui/home/ArtFengShui"
import FeaturedKoi from "@/components/ui/home/FeaturedKoi"
import HomeHero from "@/components/ui/home/HomeHero"
import Introduciton from "@/components/ui/home/Introduciton"

function Home() {
  return (
    <div className="space-y-28">
      <HomeHero />
      <div className="space-y-40 px-20">
        <ArtFengShui />
        <CreateBlog onClick={()=>{}}/>
        <FeaturedKoi />
      </div>
      <Introduciton />
    </div>
  )
}

export default Home
