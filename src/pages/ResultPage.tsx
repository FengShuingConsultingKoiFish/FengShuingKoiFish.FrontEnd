import React, { useEffect, useState } from "react"

import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

import "../styles/fengshui.css"

interface ZodiacResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  errors: null | string
  result: string | null
}

const ResultPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { name, gender, birthDate, useAccountInfo } = location.state || {}

  const [zodiac, setZodiac] = useState<string>("")
  const [zodiacMessage, setZodiacMessage] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const handleNewLookup = () => {
    navigate("/doan-menh")
  }

  const fetchZodiacForGuest = async () => {
    try {
      const dateParts = birthDate.split("/")
      const day = parseInt(dateParts[0], 10)
      const month = parseInt(dateParts[1], 10) - 1
      const year = parseInt(dateParts[2], 10)

      const formattedDate = new Date(year, month, day)

      if (isNaN(formattedDate.getTime())) {
        throw new Error("Invalid birthDate format")
      }

      const formattedBirthDate = formattedDate.toISOString().split("T")[0]

      console.log("Original birthDate:", birthDate)
      console.log("Formatted birthDate (ISO):", formattedBirthDate)

      console.log("Calling guest API with birthdate (ISO):", formattedBirthDate)

      const response = await axios.get<ZodiacResponse>(
        `https://consultingfish.azurewebsites.net/api/Zodiac/Get-Zodiac-By-Birthdate-For-Guest?birthDate=${formattedBirthDate}`
      )

      if (response.data.isSuccess) {
        const zodiacSign =
          response.data.result || response.data.message || "Không có kết quả"

        console.log("Zodiac fetched for guest:", zodiacSign)
        setZodiac(zodiacSign)
      } else {
        console.error(
          "Error fetching Zodiac sign for guest:",
          response.data.message
        )
      }
    } catch (error) {
      console.error("Error fetching Zodiac sign for guest:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchZodiacForUser = async () => {
    const token = sessionStorage.getItem("token")
    try {
      console.log("Calling user API")
      const response = await axios.get<ZodiacResponse>(
        "https://consultingfish.azurewebsites.net/api/Zodiac/Get-Zodiac-Sign",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.isSuccess) {
        setZodiac(response.data.result || "Không có kết quả")
        setZodiacMessage(response.data.message || "")
      } else {
        console.error(
          "Error fetching Zodiac sign for user:",
          response.data.message
        )
      }
    } catch (error) {
      console.error("Error fetching Zodiac sign for user:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (useAccountInfo) {
      fetchZodiacForUser()
    } else {
      fetchZodiacForGuest()
    }
  }, [useAccountInfo])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="mb-8 text-2xl font-bold">
          <br />
          GIẢI MÃ PHONG THỦY
        </h1>
        <div className="relative inline-block h-[520px] w-[660px] rounded-3xl border-2 border-purple-300 bg-white p-8 shadow-lg">
          <div className="mb-2 flex justify-center">
            <img
              src="https://png.pngtree.com/png-vector/20190723/ourlarge/pngtree-koi-fish-and-sakura-flower-logo-luck-prosperity-and-good-fortune-png-image_1570092.jpg"
              alt="Koi Fish Logo"
              className="h-32 w-32 rounded-full border-4 border-yellow-400"
            />
          </div>
          <div className="flex text-left">
            <div className="ml-[80px] flex-1">
              <p className="mb-2 font-bold">Họ tên</p>
              <p className="mb-2 font-bold">Giới tính</p>
              <p className="mb-2 font-bold">Ngày sinh</p>
              <p className="mb-2 font-bold">Mệnh</p>
              <p className="mb-2 font-bold">Thông điệp</p>
            </div>
            <div className="flex-1">
              <p className="mb-2">{name || "N/A"}</p>
              <p className="mb-2">{gender || "N/A"}</p>
              <p className="mb-2">{birthDate || "N/A"}</p>
              <p className="mb-2">{zodiac ? zodiac : "Không có kết quả"}</p>
              <p className="mb-2">
                {zodiacMessage || "Bạn cần đăng nhập để xem thông điệp"}
              </p>
            </div>
          </div>

          <button
            className="button-glow mt-4 rounded-md bg-purple-500 px-4 py-2 text-white"
            onClick={handleNewLookup}
          >
            TRA CỨU MỚI
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultPage
