import React, { useEffect, useState } from "react"

import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import useLoginModal from "@/hooks/useLoginModal"

import { axiosClient } from "@/lib/api/config/axios-client"

interface PondResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  errors: null | string
  result: Array<{
    pondId: number
    pondName: string
    zodiacId: number
    zodiacName: string
    image?: string
  }>
}

interface KoiResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  errors: null | string
  result: Array<{
    koiBreedId: number
    koiBreedName: string
    zodiacId: number
    zodiacName: string
    image?: string
  }>
}

interface PondDetail {
  id: number
  name: string
  description: string
  image: string
}

interface KoiDetail {
  id: number
  name: string
  colors: string
  pattern: string
  description: string
  image: string
}

const PondConsultationPage: React.FC = () => {
  const navigate = useNavigate()
  const loginModal = useLoginModal()
  const [zodiacName, setZodiacName] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [ponds, setPonds] = useState<
    Array<{ pondId: number; pondName: string; image?: string }>
  >([])
  const [koiBreeds, setKoiBreeds] = useState<
    Array<{ koiBreedId: number; koiBreedName: string; image?: string }>
  >([])
  const [loading, setLoading] = useState(true)
  const [zodiacMissing, setZodiacMissing] = useState<boolean>(false)
  const [selectedDetail, setSelectedDetail] = useState<
    PondDetail | KoiDetail | null
  >(null)

  const fetchZodiacStatus = async (): Promise<boolean> => {
    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi truy cập trang này.")
      loginModal.onOpen()
      return false
    }

    try {
      const response = await axiosClient.get(
        "/api/Zodiac/Check-If-User-Has-Zodiac"
      )

      if (response.data.isSuccess && response.data.result?.zodiacName) {
        setZodiacName(response.data.result.zodiacName)

        const storedUser = localStorage.getItem("userProfile")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUserName(parsedUser.name)
        }

        return true
      } else {
        setZodiacMissing(true)
        return false
      }
    } catch (error) {
      console.error("Error fetching zodiac status:", error)
      setZodiacMissing(true)
      return false
    }
  }

  const fetchConsultationAdvice = async () => {
    try {
      const pondResponse = await axiosClient.get<PondResponse>(
        `/api/Pond/Get-Suitable-Pond-For-User?zodiacName=${zodiacName}`
      )
      if (pondResponse.data.isSuccess) {
        setPonds(pondResponse.data.result || [])
      } else {
        console.error("Error fetching pond advice:", pondResponse.data.message)
      }

      const koiResponse = await axiosClient.get<KoiResponse>(
        `/api/Koi/Get-Suitable-Koi-For-User?zodiacName=${zodiacName}`
      )
      if (koiResponse.data.isSuccess) {
        setKoiBreeds(koiResponse.data.result || [])
      } else {
        console.error(
          "Error fetching koi breeds advice:",
          koiResponse.data.message
        )
      }
    } catch (error) {
      console.error("Error fetching consultation advice:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPondDetail = async (pondId: number) => {
    try {
      const response = await axiosClient.get(
        `/api/Pond/Get-All-PondCharacteristics`
      )
      const pondDetail = response.data.result.find(
        (pond: PondDetail) => pond.id === pondId
      )
      if (pondDetail) {
        setSelectedDetail(pondDetail)
      }
    } catch (error) {
      console.error("Error fetching pond detail:", error)
    }
  }

  const fetchKoiDetail = async (koiBreedId: number) => {
    try {
      const response = await axiosClient.get(`/api/Koi/Get-All-KoiBreeds`)
      const koiDetail = response.data.result.find(
        (koi: KoiDetail) => koi.id === koiBreedId
      )
      if (koiDetail) {
        setSelectedDetail(koiDetail)
      }
    } catch (error) {
      console.error("Error fetching koi detail:", error)
    }
  }

  useEffect(() => {
    const validateAndFetch = async () => {
      const hasZodiac = await fetchZodiacStatus()
      if (hasZodiac) {
        await fetchConsultationAdvice()
      } else {
        setLoading(false)
      }
    }

    validateAndFetch()
  }, [])

  const renderKoiBreeds = () => {
    return koiBreeds.length > 0 ? (
      koiBreeds.map((breed) => (
        <div
          key={breed.koiBreedId}
          className="card relative flex cursor-pointer items-center bg-transparent"
          onClick={() => fetchKoiDetail(breed.koiBreedId)}
        >
          <img
            src={breed.image || "https://via.placeholder.com/345"}
            alt={breed.koiBreedName}
            className="h-[345px] w-[345px] rounded-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="card-content relative z-10 -ml-8 w-[370px] rounded-r-md bg-white/50 p-4 shadow-lg">
            <h2 className="card-title font-bold text-purple-700">
              {breed.koiBreedName}
            </h2>
            <p className="card-text text-left text-sm text-gray-700">
              Đây là giống cá phù hợp với cung {zodiacName}.
            </p>
          </div>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center">
        <p className="text-lg font-semibold text-red-600">
          Không có tư vấn giống cá phù hợp cho bạn.
        </p>
        <p>Vui lòng kiểm tra lại thông tin mệnh của bạn hoặc liên hệ hỗ trợ.</p>
      </div>
    )
  }

  const renderPonds = () => {
    return ponds.length > 0 ? (
      ponds.map((pond) => (
        <div
          key={pond.pondId}
          className="card relative flex cursor-pointer items-center bg-transparent"
          onClick={() => fetchPondDetail(pond.pondId)}
        >
          <img
            src={pond.image || "https://via.placeholder.com/345"}
            alt={pond.pondName}
            className="h-[329px] w-[345px] rounded-l-md object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="card-content relative z-10 -ml-8 w-[370px] rounded-r-md bg-white/50 p-4 shadow-lg">
            <h2 className="card-title font-bold text-purple-700">
              {pond.pondName}
            </h2>
            <p className="card-text text-left text-sm text-gray-700">
              Đây là hồ cá phù hợp cho cung {zodiacName}.
            </p>
          </div>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center">
        <p className="text-lg font-semibold text-red-600">
          Không có tư vấn hồ cá phù hợp cho bạn.
        </p>
        <p>Vui lòng kiểm tra lại thông tin mệnh của bạn hoặc liên hệ hỗ trợ.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        {loading ? (
          <p>Đang tải...</p>
        ) : zodiacMissing ? (
          <div>
            <p className="mb-4 text-lg text-red-600">
              Bạn cần đoán mệnh trước khi sử dụng chức năng này.
            </p>
            <button
              className="button-glow rounded-md bg-purple-500 px-4 py-2 text-white"
              onClick={() => navigate("/doan-menh")}
            >
              Đến trang đoán mệnh
            </button>
          </div>
        ) : (
          <>
            <div className="bg-cover bg-center p-6">
              <h2 className="relative mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-4xl font-extrabold text-transparent">
                Tư Vấn Hồ cho mệnh {zodiacName}
              </h2>
              <p className="text-xl font-semibold">Xin chào {userName}!</p>
            </div>
            <div className="bg-cream-stone container mt-8 w-[1600px] rounded-lg p-8">
              <h1 className="title mb-8 mt-4 text-3xl font-bold">
                Giống Cá Phù Hợp
              </h1>
              <div className="grid grid-cols-2 gap-4">{renderKoiBreeds()}</div>
            </div>
            <div className="bg-cream-stone container mt-12 w-[1600px] rounded-lg p-8">
              <h1 className="title mb-8 mt-4 text-3xl font-bold">
                Hồ Cá Phù Hợp
              </h1>
              <div className="grid grid-cols-2 gap-4">{renderPonds()}</div>
            </div>
          </>
        )}

        {selectedDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="relative mx-4 flex h-[500px] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg md:mx-0">
              <div className="relative h-full w-1/2">
                <img
                  src={
                    selectedDetail.image ||
                    "https://via.placeholder.com/800x400"
                  }
                  alt={selectedDetail.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="flex h-full w-1/2 flex-col justify-between p-8 text-left text-gray-900">
                <div>
                  <h2 className="mb-4 text-3xl font-extrabold text-purple-800">
                    {selectedDetail.name}
                  </h2>
                  {"colors" in selectedDetail && (
                    <p className="mt-2 text-sm text-gray-700">
                      Màu sắc: {selectedDetail.colors}
                    </p>
                  )}
                  {"pattern" in selectedDetail && (
                    <p className="mt-2 text-sm text-gray-700">
                      Hoa văn: {selectedDetail.pattern}
                    </p>
                  )}
                  <p className="mt-2 break-words text-sm text-gray-700">
                    Mô tả: {selectedDetail.description}
                  </p>
                </div>
                <div className="mb-4 flex justify-center">
                  <button
                    onClick={() => setSelectedDetail(null)}
                    className="w-full max-w-xs rounded-lg bg-purple-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PondConsultationPage
