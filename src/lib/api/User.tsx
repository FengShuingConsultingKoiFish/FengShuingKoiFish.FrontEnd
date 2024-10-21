import axios from "axios"
import nProgress from "nprogress"
import "nprogress/nprogress.css"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Dispatch } from "redux"

import { toastWarn } from "@/components/providers/Toaster"

import { clearCurrentUser, setDetailUser } from "../redux/reducers/userSlice"
import { axiosClient } from "./config/axios-client"

interface UserPassWord {
  email: string
}
interface GetUserProfile {
  statusCode: number
  isSuccess: boolean
  message: any
  error: string
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

interface UserProfile {
  fullName: string
  identityCard: string
  dateOfBirth: string | null
  gender: string
  imageId?: number
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

// interface ErrorResponse {
//   message: any
// }

export const ForgotPassword = async (
  email: string
): Promise<Response | void> => {
  try {
    nProgress.start()
    const response = await axiosClient.post<Response>(
      "/api/Accounts/forgot-password",
      {
        email: email
      }
    )
    console.log(response)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      toast.error(error.response.data?.message || "An error occurred")
    } else {
      toast.error("An unknown error occurred")
    }
  } finally {
    nProgress.done()
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
      {
        email: email,
        newPassword,
        confirmedNewPassword,
        token
      }
    )
    console.log(response)
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      toast.error(error.response.data?.message || "An error occurred")
    } else {
      toast.error("An unknown error occurred")
    }
  } finally {
    nProgress.done()
  }
}

export const CreateOrUpdateUserProfile = async (
  userProfile: UserProfile,
  dispatch: Dispatch
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
        //imageId: userProfile.imageId
      }
    )
    console.log(response)
    if (response.data.isSuccess) {
      toast.success("Cập nhật thông tin thành công!")
    }

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.errors?.[0]?.value || "An error occurred"
      toast.error(errorMessage)
    } else {
      throw error
    }
  } finally {
    nProgress.done()
  }
}

export const GetUserProfile = async (
  dispatch: Dispatch
): Promise<GetUserProfile | void> => {
  try {
    nProgress.start()
    const response = await axiosClient.get<GetUserProfile>(
      "/api/UserDetails/get-user-detail-for-user"
    )
    //console.log(response.data.result)
    if (response.data.isSuccess) {
      dispatch(setDetailUser(response.data.result))
    }
    return response.data
  } catch (error: any) {
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
  } finally {
    nProgress.done()
  }
}

interface GetUserAvatarResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  result: string;
}

export const GetUserAvatar = async (
  userName: string
): Promise<GetUserAvatarResponse | void> => {
  try {
    nProgress.start();
    const response = await axiosClient.get<GetUserAvatarResponse>(
      `/api/UserDetails/get-user-avatar-by-userName/${userName}`
    );
    
    if (response.data.isSuccess) {
      console.log("Avatar URL:", response.data.result); 
      return response.data;
    } else {
      toast.error(response.data.message || "Failed to fetch user avatar.");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      toast.error(error.response.data?.message || "An error occurred");
    } else {
      toast.error("An unknown error occurred");
    }
  } finally {
    nProgress.done();
  }
};
