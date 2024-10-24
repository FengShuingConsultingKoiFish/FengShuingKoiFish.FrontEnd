import React, { useEffect, useState } from "react"

import CustomButton from "@/pages/Setting/Components/CustomBtn"
import { ClipLoader } from "react-spinners"

import { GetAllUserDetails } from "@/lib/api/User"

import UserSection from "../components/UserSection"
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io"

// Interface to match user details from API
interface UserDetail {
  userId: string
  userName: string
  fullName: string
  identityCard: string
  dateOfBirth: string
  gender: string
  avatar: string
  createdDate: string
}

const AllUser: React.FC = () => {
  const [users, setUsers] = useState<UserDetail[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize] = useState<number>(5)
  const [totalPages, setTotalPages] = useState<number>(0)

  useEffect(() => {
    const fetchAllUserDetails = async () => {
      setIsLoading(true)
      try {
        const response = await GetAllUserDetails({
          pageIndex: pageIndex,
          pageSize: pageSize,
          fullName: "",
          userName: "",
          userId: ""
        })
        console.log(response)
        if (response.isSuccess) {
          setUsers(response.result.datas)
          setTotalPages(response.result.totalPages)
        } else {
          console.error(response.message)
        }
      } catch (error) {
        console.error("Error fetching all user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllUserDetails()
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

  // Render the list of users
  return (
    <div className="relative flex w-full flex-col">
      <h1 className="mb-4 text-2xl font-bold">Danh sách người dùng hệ thống</h1>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <ClipLoader size={50} />
        </div>
      ) : (
        <div className="space-y-4 font-semibold">
          {users.length > 0 ? (
            users.map((user) => (
              <UserSection
                key={user.userId}
                userId={user.userId}
                userName={user.userName}
                fullName={user.fullName}
                identityCard={user.identityCard}
                dateOfBirth={user.dateOfBirth}
                gender={user.gender}
                avatar={user.avatar}
                createdDate={user.createdDate}
              />
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      )}

      <div className="fixed bottom-0 mt-6 inline-flex translate-x-[45rem] sm:translate-x-[40rem] items-center">
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

export default AllUser
