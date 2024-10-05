import { useState } from "react"

import { Button } from "@/components/global/atoms/button"

import { FishType } from "./FishSchema"
import ViewFish from "./ViewFish"

interface FishCardProps {
  fishData: FishType
}

function FishCard({ fishData }: FishCardProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const handleViewDetailsClick = () => {
    setIsViewDialogOpen(true)
  }

  return (
    <>
      <div className="w-full space-y-4 rounded-xl border-2 p-4">
        <div>
          <h1 className="text-xl font-semibold text-primary">
            {fishData.fishName}
          </h1>
          <p className="text-sm font-semibold text-gray-600">
            {fishData.title}
          </p>
        </div>

        <>
          <img
            src={fishData.image}
            alt={fishData.fishName}
            className="h-[300px] w-full select-none rounded-lg object-cover"
          />
        </>

        <div>
          <Button onClick={handleViewDetailsClick} className="w-full">
            Xem chi tiết
          </Button>
        </div>
      </div>
      {isViewDialogOpen && (
        <ViewFish
          fishData={fishData}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}
    </>
  )
}

export default FishCard
