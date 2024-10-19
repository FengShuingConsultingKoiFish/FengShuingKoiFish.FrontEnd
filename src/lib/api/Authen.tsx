import { jwtDecode } from "jwt-decode"
import { Dispatch } from "redux"
import { setCurrentUser } from "../redux/reducers/userSlice"
import { axiosClient } from "./config/axios-client"
import toast from "react-hot-toast"

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
    key: string;
    value: string;
  }>;
  result: any;
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
        const user = jwtDecode<User>(token)
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("user", JSON.stringify(user))

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

