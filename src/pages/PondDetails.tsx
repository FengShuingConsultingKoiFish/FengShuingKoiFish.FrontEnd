import React, { useEffect, useState } from "react"

import axios from "axios"
import { FaPlus } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"

interface KoiDetail {
  koiDetailId: number
  koiBreedName: string
  koiName: string
  colors?: string
  pattern?: string
  description?: string
  image?: string
}

interface PondDetail {
  pondDetailId: number
  pondName: string
  description?: string
  image?: string
}

interface PondInfo {
  id: number
  quantity: number
  pondName: string
}

interface BreedInfo {
  name: string
  colors?: string
  pattern?: string
  description?: string
  image?: string
}

interface PondCharacteristic {
  name: string
  description?: string
  image?: string
}

const PondDetails: React.FC = () => {
  const { userPondId } = useParams<{ userPondId: string }>()
  const navigate = useNavigate()
  const [koiDetails, setKoiDetails] = useState<KoiDetail[]>([])
  const [pondDetails, setPondDetails] = useState<PondDetail[]>([])
  const [quantity, setQuantity] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPondDetails = async () => {
      const token = sessionStorage.getItem("token")

      try {
        const response = await axios.get(
          `https://consultingfish.azurewebsites.net/api/UserPond/viewdetails/${userPondId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.data.isSuccess) {
          const { koiDetails, pondDetails } = response.data.result
          setPondDetails(pondDetails)

          const pondResponse = await axios.get(
            `https://consultingfish.azurewebsites.net/api/UserPond/getall`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          const pondInfo = pondResponse.data.result.find(
            (pond: PondInfo) => pond.id.toString() === userPondId
          )

          if (pondInfo) {
            setQuantity(pondInfo.quantity)
          }

          const koiBreedResponse = await axios.get(
            "https://consultingfish.azurewebsites.net/api/Koi/Get-All-KoiBreeds",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          const pondCharacteristicResponse = await axios.get(
            "https://consultingfish.azurewebsites.net/api/Pond/Get-All-PondCharacteristics",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          const updatedKoiDetails = koiDetails.map((koi: KoiDetail) => {
            const breedInfo = koiBreedResponse.data.result.find(
              (breed: BreedInfo) => breed.name === koi.koiBreedName
            )
            return {
              ...koi,
              colors: breedInfo?.colors,
              pattern: breedInfo?.pattern,
              description: breedInfo?.description,
              image: breedInfo?.image
            }
          })

          const updatedPondDetails = pondDetails.map((pond: PondDetail) => {
            const pondInfo = pondCharacteristicResponse.data.result.find(
              (pondChar: PondCharacteristic) => pondChar.name === pond.pondName
            )
            return {
              ...pond,
              description: pondInfo?.description,
              image: pondInfo?.image
            }
          })

          setKoiDetails(updatedKoiDetails)
          setPondDetails(updatedPondDetails)
        } else {
          setError(response.data.message || "Không thể lấy chi tiết hồ và Koi.")
        }
      } catch (err) {
        console.error("PondDetails.tsx:135", err)
        setError("Có lỗi xảy ra khi gọi API.")
      } finally {
        setLoading(false)
      }
    }

    fetchPondDetails()
  }, [userPondId])

  if (loading) {
    return <p>Đang tải chi tiết...</p>
  }

  if (error) {
    console.error(
      "GET https://consultingfish.azurewebsites.net/api/UserPond/viewdetails/20 400 (Bad Request)"
    )
    const emptyKoiCards = Array.from({ length: quantity }).map((_, index) => (
      <div
        key={index}
        className="flex h-48 items-center justify-center rounded bg-gray-100 p-4 shadow"
        onClick={() => navigate(`/add-koi/${userPondId}`)} // Chuyển đến trang thêm Koi
      >
        <FaPlus className="text-4xl text-gray-400" />
      </div>
    ))

    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Chi tiết Hồ và Koi</h1>
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold">Chi tiết Koi</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {emptyKoiCards}
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold">Chi tiết Hồ</h2>
          <div
            className="flex h-48 items-center justify-center rounded bg-gray-100 p-4 shadow"
            onClick={() => navigate(`/add-pond/${userPondId}`)} // Chuyển đến trang thêm Hồ
          >
            <FaPlus className="text-4xl text-gray-400" />
          </div>
        </div>
      </div>
    )
  }

  const koiCards = Array.from({ length: quantity }).map((_, index) => {
    const koi = koiDetails[index]

    if (koi) {
      return (
        <div
          key={koi.koiDetailId}
          className="rounded bg-gray-100 p-4 shadow"
          onClick={() => navigate(`/add-koi/${userPondId}`)} // Chuyển đến trang thêm Koi
        >
          <p className="text-lg font-bold">Loài Koi: {koi.koiBreedName}</p>
          <p className="text-gray-700">Tên Koi: {koi.koiName}</p>
          {koi.colors && <p>Màu sắc: {koi.colors}</p>}
          {koi.pattern && <p>Hoa văn: {koi.pattern}</p>}
          {koi.description && <p>Mô tả: {koi.description}</p>}
          {koi.image && (
            <img
              src={koi.image}
              alt={koi.koiBreedName}
              className="mt-2 w-full rounded-lg"
            />
          )}
        </div>
      )
    }

    return (
      <div
        key={index}
        className="flex h-48 items-center justify-center rounded bg-gray-100 p-4 shadow"
        onClick={() => navigate(`/add-koi/${userPondId}`)} // Chuyển đến trang thêm Koi
      >
        <FaPlus className="text-4xl text-gray-400" />
      </div>
    )
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Chi tiết Hồ và Koi</h1>

      {/* Card Chi tiết Koi */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-2 text-xl font-semibold">Chi tiết Koi</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {koiCards}
        </div>
      </div>

      {/* Card Chi tiết Hồ */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-2 text-xl font-semibold">Chi tiết Hồ</h2>
        {pondDetails.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pondDetails.map((pond: PondDetail) => (
              <div
                key={pond.pondDetailId}
                className="rounded bg-gray-100 p-4 shadow"
              >
                <p className="text-lg font-bold">Loại Hồ: {pond.pondName}</p>
                {pond.description && <p>Mô tả: {pond.description}</p>}
                {pond.image && (
                  <img
                    src={pond.image}
                    alt={pond.pondName}
                    className="mt-2 w-full rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Không có chi tiết Hồ.</p>
        )}
      </div>
    </div>
  )
}

export default PondDetails
