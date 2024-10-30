// src/PondDetails.tsx
import React, { useEffect, useState } from "react"

import { FaPlus, FaTimes } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"

import { axiosClient } from "@/lib/api/config/axios-client"

import ConfirmModal from "@/components/global/atoms/ConfirmModal"
import OnclickButton from "@/components/global/atoms/OnclickButton"

import {
  BreedInfo,
  KoiDetail,
  PondCharacteristic,
  PondDetail,
  PondInfo
} from "./interfaces"

// Import ConfirmModal

const PondDetails: React.FC = () => {
  const { userPondId } = useParams<{ userPondId: string }>()
  const navigate = useNavigate()
  const [koiDetails, setKoiDetails] = useState<KoiDetail[]>([])
  const [pondDetails, setPondDetails] = useState<PondDetail[]>([])
  const [quantity, setQuantity] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [, setError] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [deleteType, setDeleteType] = useState<"koi" | "pond" | null>(null)
  const [pondCharacteristics, setPondCharacteristics] = useState<
    PondCharacteristic[]
  >([])

  useEffect(() => {
    const token = sessionStorage.getItem("token")

    if (!token) {
      navigate("/")
      return
    }

    const fetchPondCharacteristics = async () => {
      try {
        const response = await axiosClient.get(
          "/api/Pond/Get-All-PondCharacteristics",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        if (response.data.isSuccess) {
          setPondCharacteristics(response.data.result)
        }
      } catch (error) {
        console.error("Error fetching pond characteristics:", error)
      }
    }

    const fetchPondDetails = async () => {
      try {
        const pondResponse = await axiosClient.get("/api/UserPond/getall", {
          headers: { Authorization: `Bearer ${token}` }
        })

        const pondInfo = pondResponse.data.result.find(
          (pond: PondInfo) => pond.id.toString() === userPondId
        )

        if (pondInfo) {
          setQuantity(pondInfo.quantity)
        } else {
          setError("Không tìm thấy thông tin số lượng cho hồ này.")
          setQuantity(0)
          return
        }

        const response = await axiosClient.get(
          `/api/UserPond/viewdetails/${userPondId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (response.data.isSuccess) {
          const { koiDetails, pondDetails } = response.data.result
          setPondDetails(pondDetails || [])

          const koiBreedResponse = await axiosClient.get(
            "/api/Koi/Get-All-KoiBreeds",
            { headers: { Authorization: `Bearer ${token}` } }
          )

          const updatedKoiDetails = koiDetails.map((koi: KoiDetail) => {
            const breedInfo = koiBreedResponse.data.result.find(
              (breed: BreedInfo) => breed.name === koi.koiBreedName
            )
            return {
              ...koi,
              koiBreedId: breedInfo?.id || null,
              colors: breedInfo?.colors,
              pattern: breedInfo?.pattern,
              description: breedInfo?.description,
              image: breedInfo?.image
            }
          })

          setKoiDetails(updatedKoiDetails)
        } else {
          setError(response.data.message || "Không thể lấy chi tiết hồ và Koi.")
          setKoiDetails([])
        }
      } catch (err) {
        console.error("PondDetails.tsx:135", err)
        setError("Có lỗi xảy ra khi gọi API.")
        setKoiDetails([])
      } finally {
        setLoading(false)
      }
    }

    fetchPondCharacteristics()
    fetchPondDetails()
  }, [userPondId, navigate])

  const handleDeleteKoi = async () => {
    if (!itemToDelete || deleteType !== "koi") return
    const token = sessionStorage.getItem("token")
    const koiToDeleteDetail = koiDetails.find(
      (koi) => koi.koiDetailId === itemToDelete
    )
    const koiBreedId = koiToDeleteDetail?.koiBreedId

    if (!koiBreedId) {
      console.error("koiBreedId không tồn tại cho cá Koi này.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("userPondId", userPondId || "")
      formData.append("koiBreedId", koiBreedId.toString())

      const response = await axiosClient.delete(
        "/api/UserPond/deletekoibreed",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
          data: formData
        }
      )

      if (response.data.isSuccess) {
        setKoiDetails((prevKoiDetails) =>
          prevKoiDetails.filter((koi) => koi.koiDetailId !== itemToDelete)
        )
        setShowConfirmModal(false)
      } else {
        alert(response.data.message || "Không thể xóa cá Koi.")
      }
    } catch (err) {
      console.error("Error deleting koi:", err)
      alert("Có lỗi xảy ra khi xóa cá Koi.")
    }
  }

  const handleDeletePond = async () => {
    if (!itemToDelete || deleteType !== "pond") return
    const token = sessionStorage.getItem("token")

    const pondToDeleteDetail = pondDetails.find(
      (pond) => pond.pondDetailId === itemToDelete
    )
    const pondCharacteristic = pondCharacteristics.find(
      (pond) => pond.name === pondToDeleteDetail?.pondName
    )
    const pondId = pondCharacteristic?.id

    if (!pondId) {
      console.error("pondId không tồn tại cho hồ này.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("userPondId", userPondId || "")
      formData.append("pondId", pondId.toString())

      const response = await axiosClient.delete(`/api/UserPond/deletepond`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        data: formData
      })

      if (response.data.isSuccess) {
        setPondDetails((prevPondDetails) =>
          prevPondDetails.filter((pond) => pond.pondDetailId !== itemToDelete)
        )
        setShowConfirmModal(false)
      } else {
        alert(response.data.message || "Không thể xóa hồ.")
      }
    } catch (err) {
      console.error("Error deleting pond:", err)
      alert("Có lỗi xảy ra khi xóa hồ.")
    }
  }

  const handleConfirmDelete = () => {
    if (deleteType === "koi") handleDeleteKoi()
    else if (deleteType === "pond") handleDeletePond()
    setShowConfirmModal(false)
  }

  const openConfirmModal = (id: number, type: "koi" | "pond") => {
    setItemToDelete(id)
    setDeleteType(type)
    setShowConfirmModal(true)
  }

  if (loading) {
    return <p>Đang tải chi tiết...</p>
  }

  const koiCards = Array.from({ length: quantity || 0 }).map((_, index) => {
    const koi = koiDetails[index]

    return koi ? (
      <div
        key={koi.koiDetailId}
        className="relative cursor-default rounded bg-gray-100 p-4 shadow transition-transform hover:scale-105"
      >
        <FaTimes
          className="absolute right-2 top-2 cursor-pointer text-red-500"
          onClick={() => openConfirmModal(koi.koiDetailId, "koi")}
        />
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
    ) : (
      <div
        key={index}
        className="flex h-48 cursor-pointer items-center justify-center rounded bg-gray-100 p-4 shadow transition-transform hover:scale-105"
        onClick={() => navigate(`/add-koi/${userPondId}`)}
      >
        <FaPlus className="text-4xl text-gray-400" />
      </div>
    )
  })

  return (
    <div className="container mx-auto p-4">
      <OnclickButton
        label="Trở lại"
        onClick={() => navigate("/see-all-pond")}
      />
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-500">
        Chi tiết Hồ và Koi
      </h1>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-2 text-xl font-semibold">Chi tiết Koi</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {koiCards}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-2 text-xl font-semibold">Chi tiết Hồ</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pondDetails.map((pond: PondDetail) => (
            <div
              key={pond.pondDetailId}
              className="relative rounded bg-gray-100 p-4 shadow transition-transform hover:scale-105"
            >
              <FaTimes
                className="absolute right-2 top-2 cursor-pointer text-red-500"
                onClick={() => openConfirmModal(pond.pondDetailId, "pond")}
              />
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
        <div
          className="mt-4 flex h-48 cursor-pointer items-center justify-center rounded bg-gray-100 p-4 shadow transition-transform hover:scale-105"
          onClick={() => navigate(`/add-pond/${userPondId}`)}
        >
          <FaPlus className="text-4xl text-gray-400" />
          <p className="ml-2 text-gray-700">Thêm Hồ</p>
        </div>
      </div>

      {/* Sử dụng ConfirmModal */}
      <ConfirmModal
        isVisible={showConfirmModal}
        message="Bạn có chắc chắn muốn xóa mục này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />

      <div className="mt-8 flex justify-center">
        <OnclickButton
          label="Xác nhận"
          onClick={() => navigate(`/see-all-pond#pond-${userPondId}`)}
        />
      </div>
    </div>
  )
}

export default PondDetails
