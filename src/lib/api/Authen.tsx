import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { Dispatch } from "redux"

import { clearCurrentUser, setCurrentUser } from "../redux/reducers/userSlice"
import { axiosClient } from "./config/axios-client"

// Define the user type according to your backend response
interface User {
  Id: string
  Name: string
  Email: string
  Role: string
}

interface RegisterResponse {
  data: any
  message: string
}

interface LoginResponse {
  result: {
    token: string
    refreshToken: string
  }
  message: string
  // Add any other fields from your backend response for the login
}

interface VerifyEmailResponse {
  message: string
  user: User
}

interface ErrorResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  errors: Array<{
    key: string
    value: string
  }>
  result: any
}

// Register User function
export const registerUser = async (
  emailAddress: string,
  userName: string,
  password: string,
  confirmPassword: string,
  phoneNumber: string
): Promise<RegisterResponse> => {
  try {
    const response = await axiosClient.post<RegisterResponse>(
      "/api/Accounts/sign-up",
      {
        emailAddress,
        userName,
        password,
        confirmPassword,
        phoneNumber
      }
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    throw error as ErrorResponse
  }
}

// Login User function
export const loginUser =
  (userNameOrEmail: string, password: string) =>
  async (
    dispatch: Dispatch
  ): Promise<
    | {
        message: string
        token: string
        user: User
      }
    | undefined
  > => {
    try {
      const response = await axiosClient.post<LoginResponse>(
        "api/Accounts/authen",
        {
          userNameOrEmail: userNameOrEmail,
          password: password
        }
      )

      console.log("Full Response:", response)
      const responseData = response.data
      console.log("Response Data:", responseData)

      if (responseData.result && responseData.result.token) {
        const token = responseData.result.token
        const refreshToken = responseData.result.refreshToken

        const user = jwtDecode<User>(token)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("refreshToken", refreshToken)

        console.log("Dispatching setCurrentUser action")

        dispatch(setCurrentUser(user)) // Dispatch action to Redux store

        return { message: responseData.message || "", token, user }
      } else {
        throw new Error(responseData.message || "Login failed!")
      }
    } catch (error) {
      throw error as ErrorResponse
    }
  }

// Verify Email function
export const verifyEmail = async (
  token: string,
  email: string
): Promise<VerifyEmailResponse> => {
  try {
    const response = await axiosClient.get<VerifyEmailResponse>(
      `/api/Accounts/verify-email?token=${token}&email=${email}`
    )

    const responseData = response.data
    console.log("Response Data:", responseData)

    return responseData
  } catch (error) {
    throw error as ErrorResponse
  }
}

interface TokenRenewalResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  errors: string | null
  result: {
    token: string
    refreshToken: string
  }
}

const token = sessionStorage.getItem("token")

export const renewToken = async (
  token: string,
  refreshToken: string,
  dispatch: Dispatch
): Promise<TokenRenewalResponse> => {
  try {
    console.log("Jump into renewToken API...")

    const response = await axios.post<TokenRenewalResponse>(
      //`https://localhost:7166/api/Accounts/renew-token`,
      `https://consultingfish.azurewebsites.net/api/Accounts/renew-token`,
      {
        token,
        refreshToken
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    )

    console.log("Full Renew token response:", response.data)
    return response.data
  } catch (error) {
    console.error("Failed to renew token:", error)
    dispatch(clearCurrentUser())
    throw error as ErrorResponse
  }
}
