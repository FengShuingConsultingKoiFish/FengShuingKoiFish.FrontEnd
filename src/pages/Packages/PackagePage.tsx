"use client"

import React, { useEffect, useState } from "react"

import { motion } from "framer-motion"
import { ClipLoader } from "react-spinners"

import { getAllAdvertisements } from "@/lib/api/Advertisement"

import { AuroraBackground } from "@/components/ui/AuroraBg"

import CustomButton from "../Setting/Components/CustomBtn"
import { PackageCard } from "./components/PackageCard"
import { useNavigate } from "react-router-dom"

interface ImageViewDTO {
  id: number
  filePath: string
}

interface AdvertisementPackage {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  isActive: boolean
  createdDate: string
  createdBy: string
  imageViewDTOs: ImageViewDTO[]
}

export function PackagePage() {
  const [packages, setPackages] = useState<AdvertisementPackage[]>([])
  const [pageIndex, setPageIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  })

  const fetchPackages = async (page: number) => {
    setIsLoading(true)
    const requestData = {
      pageIndex: page,
      pageSize: 5, // You can change the pageSize as needed
      name: "",
      priceFilter: null,
      orderImage: null
    }

    try {
      const response = await getAllAdvertisements(requestData)
      console.log(response)
      setPackages(response.result.datas)
      setTotalPages(response.result.totalPages)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch packages:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch for the first page
    fetchPackages(pageIndex)
  }, [pageIndex])

  const handleNextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex(pageIndex + 1)
    }
  }

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1)
    }
  }

  const handlePackageClick = (id: number) => {
    navigate(`/goi-hoi-vien/${id}`)
  }

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
        className="relative flex flex-col items-center justify-start gap-4 px-4 py-10"
      >
        <div className="text-center text-3xl font-bold dark:text-white md:text-5xl">
          Khám phá các gói hội viên của chúng tôi
        </div>
        <p className="mx-auto mb-20 mt-6 max-w-lg text-center text-lg leading-8 text-gray-600">
          Dịch vụ tận tình, chuyên nghiệp mang đến cho bạn trải nghiệm tốt nhất
        </p>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <ClipLoader size={40} color="#000" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                name={pkg.name}
                description={pkg.description}
                price={pkg.price}
                imageViewDTOs={pkg.imageViewDTOs.map((image) => ({
                  id: image.id,
                  imageUrl: image.filePath
                }))}
                onClick={() => handlePackageClick(pkg.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-20 flex w-full justify-center items-center gap-4">
          <CustomButton
            onClick={handlePreviousPage}
            disabled={pageIndex === 1 || isLoading}
            label="Trang trước"
          />
          <span className="text-lg">
            Trang {pageIndex} trên {totalPages}
          </span>
          <CustomButton
            onClick={handleNextPage}
            disabled={pageIndex === totalPages || isLoading}
            label="Trang sau"
          />
        </div>
      </motion.div>
    </AuroraBackground>
  )
}
