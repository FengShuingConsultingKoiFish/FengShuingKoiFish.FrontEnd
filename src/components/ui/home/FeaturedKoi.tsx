import FishCard from "./FishCard"
import { exampleData } from "./KoiExample"

function FeaturedKoi() {
  return (
    <div className="w-full space-y-10">
      <h1 className="text-center text-3xl font-bold text-primary">
        Các loại cá koi đặc trưng
      </h1>
      <div className="flex justify-between gap-10">
        {exampleData.map((fish) => (
          <FishCard key={fish.fishId} fishData={fish} />
        ))}
      </div>
    </div>
  )
}

export default FeaturedKoi
