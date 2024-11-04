import React, { useEffect, useState } from "react"

import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"

import useLoginModal from "@/hooks/useLoginModal"

import { axiosClient } from "@/lib/api/config/axios-client"

import OnclickButton from "@/components/global/atoms/OnclickButton"

import "../../styles/fengshui.css"
import PondList from "./PondList"

interface Pond {
  id: number
  pondName: string
  quantity: number
  description: string
  image: string
  score: number
}

const SeeAllPond: React.FC = () => {
  const [ponds, setPonds] = useState<Pond[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [visiblePonds, setVisiblePonds] = useState<number>(4)
  const [activeButton, setActiveButton] = useState<string>("see-all")
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const location = useLocation()
  const navigate = useNavigate()
  const loginModal = useLoginModal()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Vui lòng đăng nhập để xem danh sách hồ cá.")
      navigate("/")
      loginModal.onOpen()
      return
    }

    const fetchPonds = async () => {
      try {
        const response = await axiosClient.get("/api/UserPond/getall", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.data.isSuccess) {
          setPonds(response.data.result)
        } else {
          setError(response.data.message || "Không lấy được danh sách hồ cá")
        }
      } catch {
        setError("Có lỗi xảy ra khi lấy danh sách hồ cá.")
      } finally {
        setLoading(false)
      }
    }

    fetchPonds()
  }, [navigate])

  useEffect(() => {
    if (!loading && location.hash) {
      const elementId = location.hash.replace("#", "")
      const element = document.getElementById(elementId)

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [location.hash, loading])

  const handleDeletePond = async (id: number) => {
    const token = localStorage.getItem("token")
    try {
      const response = await axiosClient.delete(`/api/UserPond/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.isSuccess) {
        setPonds((prevPonds) => prevPonds.filter((pond) => pond.id !== id))
      } else {
        alert("Xóa không thành công!")
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi xóa hồ cá.", error)
    }
  }

  const handleUpdatePond = async (updatedPond: Pond) => {
    const token = localStorage.getItem("token")
    try {
      const response = await axiosClient.put(
        `/api/UserPond/update/${updatedPond.id}`,
        {
          pondName: updatedPond.pondName,
          quantity: updatedPond.quantity,
          description: updatedPond.description,
          image: updatedPond.image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.data.isSuccess) {
        setPonds((prevPonds) =>
          prevPonds.map((pond) =>
            pond.id === updatedPond.id ? updatedPond : pond
          )
        )
      } else {
        alert("Cập nhật không thành công!")
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi cập nhật hồ cá.", error)
    }
  }

  const validateName = (name: string, id: number) => {
    return !ponds.some((pond) => pond.pondName === name && pond.id !== id)
  }

  const handleShowMore = () => {
    setVisiblePonds((prev) => prev + 4)
  }

  const handleNavigation = (page: string) => {
    setActiveButton(page)
    if (page === "create") {
      navigate("/create-pond")
    } else if (page === "see-all") {
      navigate("/see-all-pond")
    }
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
  }

  const filteredPonds = ponds.filter((pond) => {
    const matchesSearch = pond.pondName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "hasScore" && pond.score !== 0) ||
      (filter === "noScore" && pond.score === 0)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <p>Đang tải danh sách hồ cá...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="white flex min-h-screen flex-col items-center p-10"
    >
      <div className="mb-6 flex justify-start space-x-4">
        <button
          onClick={() => handleNavigation("create")}
          className={`rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl ${
            activeButton === "create"
              ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              : "bg-gray-400"
          }`}
        >
          Tạo hồ cá
        </button>
        <button
          onClick={() => handleNavigation("see-all")}
          className={`rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl ${
            activeButton === "see-all"
              ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              : "bg-gray-400"
          }`}
        >
          Xem tất cả hồ cá
        </button>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm hồ cá theo tên..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full max-w-md rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => handleFilterChange("all")}
          className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-300 ${
            filter === "all"
              ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              : "bg-gray-400"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => handleFilterChange("hasScore")}
          className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-300 ${
            filter === "hasScore"
              ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              : "bg-gray-400"
          }`}
        >
          Đã có điểm
        </button>
        <button
          onClick={() => handleFilterChange("noScore")}
          className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-300 ${
            filter === "noScore"
              ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              : "bg-gray-400"
          }`}
        >
          Chưa có điểm
        </button>
      </div>

      <h1 className="mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-5xl font-extrabold text-transparent">
        Danh sách hồ cá
      </h1>

      <PondList
        ponds={filteredPonds}
        visiblePonds={visiblePonds}
        onDelete={handleDeletePond}
        onUpdate={handleUpdatePond}
        validateName={validateName}
      />
      {visiblePonds < filteredPonds.length && (
        <OnclickButton label="Xem thêm" onClick={handleShowMore} />
      )}
    </motion.div>
  )
}

export default SeeAllPond
