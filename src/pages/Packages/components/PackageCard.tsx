import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/MovingBorder"

interface ImageViewDTO {
  id: number
  imageUrl: string
}

interface CardProps {
  name: string
  description: string
  price: number
  imageViewDTOs: ImageViewDTO[]
  onClick: () => void
}

export function PackageCard({
  name,
  description,
  price,
  imageViewDTOs,
  onClick
}: CardProps) {
  const backgroundImage =
    imageViewDTOs.length > 0 ? imageViewDTOs[0].imageUrl : ""
  return (
    <div className="w-full max-w-xs cursor-pointer" onClick={onClick}>
      <div
        className={cn(
          "card group relative mx-auto flex h-96 w-full cursor-pointer flex-col justify-end overflow-hidden rounded-md border border-transparent p-4 shadow-xl",
          "hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50 hover:after:content-['']",
          "transition-all duration-500"
        )}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            backgroundImage: `url(https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHp6dTQ5eHkweml0a3MzYWEzbDZpNW9oZHptZmthYmw5ZG5nN2d3NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F2NiLnKoooDXa2RZq1/giphy.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        <div className="text relative z-30">
          <h1 className="text-shadow relative text-xl font-bold text-white text-opacity-100 md:text-3xl mb-10">
            {name}
          </h1>
          {/* <p className="text-shadow relative my-4 text-base font-normal text-white">
            {description}
          </p> */}
          <div>
            <Button
              borderRadius="1.75rem"
              className="border-neutral-200 bg-gray-300 text-black dark:border-slate-800 dark:bg-slate-900 dark:text-white font-bold"
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
              }).format(price)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

