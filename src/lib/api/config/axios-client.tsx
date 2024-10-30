import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios"
import { jwtDecode } from "jwt-decode"
import toast from "react-hot-toast"
import { Dispatch } from "redux"

import { clearCurrentUser } from "@/lib/redux/reducers/userSlice"
import store from "@/lib/redux/store"

import { renewToken } from "../Authen"

//export const BASE_URL = "https://localhost:7166"
export const BASE_URL = "https://consultingfish.azurewebsites.net";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

let renewalAttempts = 0
const MAX_RENEWAL_ATTEMPTS = 3

let isRenewingToken = false;

const checkAndRenewToken = async (dispatch: Dispatch): Promise<boolean> => {
  console.log("Checking token expiration...");
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token || !refreshToken) {
    console.log("No token or refreshToken found. Clearing current user.");
    dispatch(clearCurrentUser());
    return false;
  }

  const user = jwtDecode<{ exp: number }>(token);
  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = user.exp - currentTime; // Time left until the token expires, in seconds
  const renewThreshold = 60; // 1 minute

  console.log("Current time:", currentTime, "Token expiration time:", user.exp, "Time left:", timeLeft);

  if (timeLeft <= renewThreshold) {
    if (isRenewingToken) {
      console.log("Token renewal already in progress, waiting...");
      while (isRenewingToken) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return true;
    }

    if (renewalAttempts >= MAX_RENEWAL_ATTEMPTS) {
      console.error("Max renewal attempts reached. Logging out.");
      dispatch(clearCurrentUser());
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      toast.error("Session expired. Please log in again.");
      window.location.href = "/";
      return false;
    }

    renewalAttempts += 1; // Increment on each renewal attempt
    console.log(`Token is about to expire, attempting to renew... Attempt ${renewalAttempts}`);

    isRenewingToken = true;
    try {
      console.log("Calling renewToken API...");
      const renewalResponse = await renewToken(token, refreshToken, dispatch);
      console.log("After Calling renewToken API...", renewalResponse);

      if (renewalResponse.isSuccess && renewalResponse.result?.token && renewalResponse.result?.refreshToken) {
        const newToken = renewalResponse.result.token;
        const newRefreshToken = renewalResponse.result.refreshToken;
        const newUser = jwtDecode<{ exp: number }>(newToken);

        // Update local storage with new token values
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("user", JSON.stringify(newUser));

        renewalAttempts = 0; // Reset counter on success
        console.log("Token successfully renewed.");
        return true;
      } else {
        console.error("Renew token failed.");
        dispatch(clearCurrentUser());
        return false;
      }
    } catch (error) {
      console.error("Error during token renewal:", error);
      return false;
    } finally {
      isRenewingToken = false;
    }
  } else {
    console.log("Token is still valid, no renewal needed.");
  }
  return true;
};

// Request Interceptor with TypeScript
axiosClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const token = localStorage.getItem("token")

    if (!token) {
      return config
    }

    // Check and renew token if needed
    const dispatch = store.dispatch
    const isTokenValid = await checkAndRenewToken(dispatch)

    console.log("isTokenValid:", isTokenValid)

    if (!isTokenValid) {
      return Promise.reject("Session expired. Please log in again.")
    }

    // Set Authorization header with the renewed token
    const renewedToken = localStorage.getItem("token")
    if (renewedToken && config.headers) {
      config.headers.Authorization = `Bearer ${renewedToken}`
    }

    return config
  },
  (error: AxiosError) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error)
  }
)

// Response Interceptor with TypeScript
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)
