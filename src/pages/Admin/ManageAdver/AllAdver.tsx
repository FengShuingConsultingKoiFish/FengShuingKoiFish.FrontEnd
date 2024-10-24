import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from "react-icons/io"
import { useNavigate } from "react-router-dom"

import { getAllAdvertisementsPkg } from "@/lib/api/AdvertisementPkg"

import AdverPkgSection from "../components/AdverPkgSection"

interface ImageViewDTO {
  id: number
  filePath: string
  altText: string | null
  userId: string
  userName: string
  createdDate: string
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

export const AllAdver = () => {
  const navigate = useNavigate()
  const [advertisementPackages, setAdvertisementPackages] = useState<
    AdvertisementPackage[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await getAllAdvertisementsPkg({
          pageIndex: pageIndex,
          pageSize: pageSize,
          name: "",
          priceFilter: null,
          orderImage: 1
        })
        console.log(response)
        if (response.isSuccess) {
          setAdvertisementPackages(response.result.datas)
          setTotalPages(response.result.totalPages)
        } else {
          console.error(response.message)
        }
      } catch (error) {
        console.error("Error fetching adverpkg:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdvertisements()
  }, [pageIndex])

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

  const handleEditDetail = (id: number) => {
    navigate(`/admin/goi-quang-cao/edit/${id}`)
  }

  return (
    <div className="relative flex w-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Tất cả các gói quảng cáo</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : advertisementPackages.length === 0 ? (
        <p>Không có gói quảng cáo nào</p>
      ) : (
        <ul className="space-y-4 font-semibold">
          {advertisementPackages.map((pkg) => (
            <AdverPkgSection
              key={pkg.id}
              id={pkg.id}
              name={pkg.name}
              price={pkg.price}
              description={pkg.description}
              limitAd={pkg.limitAd}
              limitContent={pkg.limitContent}
              limitImage={pkg.limitImage}
              imageViewDtos={pkg.imageViewDTOs}
              clickToEdit={() => handleEditDetail(pkg.id)}
            />
          ))}
        </ul>
      )}
      <div className="fixed bottom-0 mt-6 inline-flex translate-x-[50rem] items-center sm:translate-x-[40rem]">
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
  )
}
