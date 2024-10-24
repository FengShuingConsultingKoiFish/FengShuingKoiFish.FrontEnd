import React, { useEffect, useState } from "react"

import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

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
    image: string
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
    image: string
  }>
}

interface UserProfile {
  name: string
}

const PondConsultationPage: React.FC = () => {
  const navigate = useNavigate()

  const [zodiacName, setZodiacName] = useState<string>("")
  const [userName, setUserName] = useState<string>("") // Thêm trạng thái cho tên người dùng
  const [ponds, setPonds] = useState<
    Array<{ pondName: string; image: string }>
  >([])
  const [koiBreeds, setKoiBreeds] = useState<
    Array<{ koiBreedName: string; image: string }>
  >([])
  const [loading, setLoading] = useState(true)
  const [zodiacMissing, setZodiacMissing] = useState<boolean>(false)

  // Hàm lấy trạng thái đoán mệnh và thông tin user
  const fetchZodiacStatus = async (): Promise<boolean> => {
    const token = sessionStorage.getItem("token")

    // Kiểm tra nếu token không tồn tại
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi truy cập trang này.")
      navigate("/")
      return false
    }

    try {
      const response = await axios.get(
        `https://consultingfish.azurewebsites.net/api/Zodiac/Check-If-User-Has-Zodiac`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.isSuccess && response.data.result?.zodiacName) {
        setZodiacName(response.data.result.zodiacName)

        // Lấy tên người dùng từ sessionStorage hoặc API nếu có
        const storedUser = sessionStorage.getItem("userProfile")
        if (storedUser) {
          const parsedUser: UserProfile = JSON.parse(storedUser)
          setUserName(parsedUser.name) // Gán tên người dùng
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

  // Fetch ponds and koi breeds advice based on zodiac
  const fetchConsultationAdvice = async () => {
    const token = sessionStorage.getItem("token")

    // Nếu không có token thì return tránh lỗi API
    if (!token) return

    try {
      // Call API to get ponds advice
      const pondResponse = await axios.get<PondResponse>(
        `https://consultingfish.azurewebsites.net/api/Pond/Get-Suitable-Pond-For-User?zodiacName=${zodiacName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (pondResponse.data.isSuccess) {
        setPonds(pondResponse.data.result || [])
      } else {
        toast.error("Không thể lấy tư vấn hồ cá.")
        console.error("Error fetching pond advice:", pondResponse.data.message)
      }

      // Call API to get koi breeds advice
      const koiResponse = await axios.get<KoiResponse>(
        `https://consultingfish.azurewebsites.net/api/Koi/Get-Suitable-Koi-For-User?zodiacName=${zodiacName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (koiResponse.data.isSuccess) {
        setKoiBreeds(koiResponse.data.result || [])
      } else {
        toast.error("Không thể lấy tư vấn giống cá.")
        console.error(
          "Error fetching koi breeds advice:",
          koiResponse.data.message
        )
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy thông tin tư vấn. Vui lòng thử lại.")
      console.error("Error fetching consultation advice:", error)
    } finally {
      setLoading(false)
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
  }, []) // Loại bỏ dependency `zodiacName` để tránh gọi lại không cần thiết

  const renderKoiBreeds = () => {
    return koiBreeds.length > 0 ? (
      koiBreeds.map((breed, index) =>
        breed.koiBreedName && breed.image ? (
          <div
            key={index}
            className="card relative flex items-center bg-transparent"
          >
            <img
              src={breed.image}
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
        ) : (
          <p>Thông tin giống cá không hợp lệ</p>
        )
      )
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
      ponds.map((pond, index) =>
        pond.pondName && pond.image ? (
          <div
            key={index}
            className="card relative flex items-center bg-transparent"
          >
            <img
              src={pond.image}
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
        ) : (
          <p>Thông tin hồ cá không hợp lệ</p>
        )
      )
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
            <div
              className="bg-cover bg-center p-6"
              style={{
                backgroundImage: 'url("https://path_to_background_image.jpg")'
              }}
            >
              <h2 className="relative mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-4xl font-extrabold text-transparent">
                Tư Vấn Hồ cho mệnh {zodiacName}
              </h2>
              <p className="text-xl font-semibold">Xin chào {userName}!</p>
            </div>

            {/* Background cho phần giống cá */}
            <div className="bg-cream-stone container mt-8 w-[1600px] rounded-lg p-8">
              <h1 className="title mb-8 mt-4 text-3xl font-bold">
                Giống Cá Phù Hợp
              </h1>
              <div className="grid grid-cols-2 gap-4">{renderKoiBreeds()}</div>
            </div>

            {/* Background cho phần hồ cá */}
            <div className="bg-cream-stone container mt-12 w-[1600px] rounded-lg p-8">
              <h1 className="title mb-8 mt-4 text-3xl font-bold">
                Hồ Cá Phù Hợp
              </h1>
              <div className="grid grid-cols-2 gap-4">{renderPonds()}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PondConsultationPage
