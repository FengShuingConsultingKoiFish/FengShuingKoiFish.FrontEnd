
import FengShui from "@/components/local/default/FengShui"
import HomeHero from "@/components/local/default/HomeHero"
import CreateBlog from "@/components/ui/createBlog/CreateBlog"

function Home() {
  return (
    <div>
      <>
        <HomeHero />
        <div className="px-20">
          <FengShui />
        </div>
        <CreateBlog onClick={()=>{}}/>
      </>
    </div>
  )
}

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
        <FeaturedKoi />
      </div>
      <Introduciton />
    </div>
  )
}

export default Home
