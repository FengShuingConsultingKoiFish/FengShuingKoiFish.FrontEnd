import { Dispatch, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import nProgress from "nprogress"
import "nprogress/nprogress.css"
import toast from "react-hot-toast"

import { toastWarn } from "@/components/providers/Toaster"

import {
  clearCurrentUser,
  setDetailUser,
  setUsersList
} from "../redux/reducers/userSlice"
import { axiosClient } from "./config/axios-client"

interface UserProfile {
  fullName: string
  identityCard: string
  dateOfBirth: string | null
  gender: string
  imageId?: number
}

interface GetUserProfile {
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

function handleAxiosError(error: any) {
  if (axios.isAxiosError(error) && error.response) {
    toast.error(error.response.data?.message || "An error occurred")
  } else {
    toast.error("An unknown error occurred")
  }
}

interface GetAllUserDetailsRequest {
  pageIndex: number
  pageSize: number
  fullName?: string
  userName?: string
  userId?: string
}

interface UserDetails {
  userId: string
  userName: string
  fullName: string
  identityCard: string
  dateOfBirth: string
  gender: string
  avatar: string
  createdDate: string
}

interface GetAllUserDetailsResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  result: {
    pageIndex: number
    totalPages: number
    totalItems: number
    hasPreviousPage: boolean
    hasNextPage: boolean
    datas: UserDetails[]
  }
}

export const GetAllUserDetails = async (
  requestData: GetAllUserDetailsRequest
): Promise<GetAllUserDetailsResponse> => {
  try {
    nProgress.start()
    const response = await axiosClient.post<GetAllUserDetailsResponse>(
      "/api/UserDetails/get-all-details",
      requestData
    )
    return response.data
  } catch (error: any) {
    nProgress.done()
    console.error("API Error: ", error.response.data.message)
    throw new Error(error.response.data.message || "An error occurred")
  } finally {
    nProgress.done()
  }
}

interface GetAllBlogsForUserRequest {
  pageIndex: number;
  pageSize: number;
  title: string;
  blogStatus: number | null;
  orderBlog: number | null;
  orderComment: number | null;
  orderImage: number | null;
}
interface ImageViewDtos {
  id: number
  filePath: string
  altText?: string | null
  userId: string
  userName: string
  createdDate: string
}

interface BlogDetails {
  id: number;
  title: string;
  content: string;
  userName: string
  createdDate: string
  status: string
  imageViewDtos: ImageViewDtos[]
  commentViewDtos : []
}

interface GetAllBlogsForUserResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  result: {
    pageIndex: number;
    totalPages: number;
    totalItems: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    datas: BlogDetails[];
  };
}

export const GetAllBlogsForUser = async (
  requestData: GetAllBlogsForUserRequest
): Promise<GetAllBlogsForUserResponse> => {
  try {
    nProgress.start();
    const response = await axiosClient.post<GetAllBlogsForUserResponse>(
      "/api/Blogs/get-all-blogs-for-user",
      requestData
    );
    nProgress.done();
    return response.data;
  } catch (error: any) {
    nProgress.done();
    console.error("API Error: ", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "An error occurred");
  } finally {
    nProgress.done();
  }
};

