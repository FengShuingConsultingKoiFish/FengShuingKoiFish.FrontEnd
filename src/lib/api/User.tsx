import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import nProgress from "nprogress"
import "nprogress/nprogress.css"
import toast from "react-hot-toast"

import { toastWarn } from "@/components/providers/Toaster"

import { clearCurrentUser, setDetailUser } from "../redux/reducers/userSlice"
import { axiosClient } from "./config/axios-client"

interface UserProfile {
  fullName: string
  identityCard: string
  dateOfBirth: string
  gender: string
  imageId?: number
}

interface GetUserProfileResponse {
  statusCode: number
  isSuccess: boolean
  message: any
  result: {
    userId: string
    userName: string
    fullName: string
    identityCard: string
    dateOfBirth: string
    gender: string
    avatar: string
    createdDate: string
  }
}

interface Response {
  statusCode: number
  isSuccess: boolean
  message: string
  result: {
    fullName: string
    identityCard: string
    dateOfBirth: Date
    gender: string
    avatar: string
    userId: string
    userName: string
    createdDate: string
  }
}

export const ForgotPassword = async (
  email: string
): Promise<Response | void> => {
  try {
    nProgress.start()
    const response = await axiosClient.post<Response>(
      "/api/Accounts/forgot-password",
      { email }
    )
    nProgress.done()
    return response.data
  } catch (error: any) {
    nProgress.done()
    handleAxiosError(error)
  }
}

export const ResetPassword = async (
  email: string,
  newPassword: string,
  confirmedNewPassword: string,
  token: string
): Promise<Response | void> => {
  try {
    nProgress.start()
    const response = await axiosClient.post<Response>(
      "/api/Accounts/reset-password",
      { email, newPassword, confirmedNewPassword, token }
    )
    nProgress.done()
    return response.data
  } catch (error: any) {
    nProgress.done()
    handleAxiosError(error)
  }
}

export const CreateOrUpdateUserProfile = async (
  userProfile: UserProfile
): Promise<Response | void> => {
  try {
    nProgress.start()
    const response = await axiosClient.post<Response>(
      "/api/UserDetails/create-update-user-detail",
      {
        fullName: userProfile.fullName,
        identityCard: userProfile.identityCard,
        dateOfBirth: userProfile.dateOfBirth,
        gender: userProfile.gender
      }
    )
    nProgress.done()
    if (response.data.isSuccess) {
      toast.success("Cập nhật thông tin thành công!")
    }
    return response.data
  } catch (error: any) {
    nProgress.done()
    handleAxiosError(error)
  }
}

// Thunk action to get user profile
export const GetUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      nProgress.start()
      const response = await axiosClient.get<GetUserProfileResponse>(
        "/api/UserDetails/get-user-detail-for-user"
      )
      nProgress.done()

      if (response.data.isSuccess) {
        dispatch(setDetailUser(response.data.result))
      }
      return response.data
    } catch (error: any) {
      nProgress.done()
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            toastWarn("Hãy cập nhật thông tin của bạn!")
            break
          case 401:
            dispatch(clearCurrentUser())
            toast.error("Phiên của bạn đã hết hạn !!")
            break
          default:
            toast.error(
              error.response.data?.statusCode || "An unknown error occurred"
            )
        }
      } else {
        toast.error("An unknown error occurred")
      }

      return rejectWithValue(error)
    }
  }
)

function handleAxiosError(error: any) {
  if (axios.isAxiosError(error) && error.response) {
    toast.error(error.response.data?.message || "An error occurred")
  } else {
    toast.error("An unknown error occurred")
  }
}
