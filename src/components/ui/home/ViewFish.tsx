import { Button } from "@/components/global/atoms/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/global/atoms/dialog"

import { FishType } from "./FishSchema"

interface ViewProductProps {
  fishData: FishType
  onClose: () => void
}

function ViewFish({ fishData, onClose }: ViewProductProps) {
  return (
    <Dialog onOpenChange={onClose} open>
      <DialogContent className="min-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Thông tin chi tiết</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between font-semibold">
            <div>
              <h4>{fishData.fishName}</h4>
              <p className="text-sm font-normal text-gray-500">
                {fishData.title}
              </p>
            </div>
            <p className="rounded-xl bg-gray-200 p-2 text-sm text-primary">
              {fishData.type}
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={fishData.image}
              alt={fishData.fishName}
              className="h-[300px] w-full select-none rounded-xl object-cover"
            />
          </div>

          <div className="text-justify text-sm">{fishData.description}</div>
          <div className="flex justify-end">
            <Button variant={"outline"} onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewFish
