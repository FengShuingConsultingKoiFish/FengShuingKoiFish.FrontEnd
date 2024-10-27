import nProgress from "nprogress"
import "nprogress/nprogress.css"

import { axiosClient } from "./config/axios-client"

interface ImageViewDto {
  id: number
  filePath: string
  altText: string | null
  userId: string
  userName: string
  createdDate: string
}

interface PurchasePackagePayload {
  packageId: number
  name: string
  price: number
}

export const PurchasePackage = async (paymentData: PurchasePackagePayload) => {
  try {
    nProgress.start()

    const response = await axiosClient.post(
      "/api/Payments/purchase-package",
      paymentData
    )

    return response.data
  } catch (error) {
    console.error("Error in payment request:", error)
    throw error
  } finally {
    nProgress.done()
  }
}

interface PaymentRequest {
  pageIndex: number
  pageSize: number
  orderDate?: number | null
  transactionId?: number | null
  orderImage?: number | null
}

interface AdvertisementPackageView {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  createdDate: string
  createdBy: string
  isActive: boolean
  imageViewDTOs: ImageViewDto[]
}

interface Payment {
  id: number
  userName: string
  transactionId: number
  content: string
  amount: number
  createdDate: string
  advertisementPackageViewDTO: AdvertisementPackageView
}

interface PaymentResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  errors: any
  result: {
    pageIndex: number
    totalPages: number
    totalItems: number
    hasPreviousPage: boolean
    hasNextPage: boolean
    datas: Payment[]
  }
}

export const getAllPaymentsForMember = async (
  requestData: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    nProgress.start()

    const response = await axiosClient.post<PaymentResponse>(
      "/api/Payments/get-all-payments-for-member",
      requestData
    )

    return response.data
  } catch (error: any) {
    nProgress.done()
    if (error.response) {
      console.error("API Error: ", error.response.data.message)
      throw new Error(error.response.data.message || "An error occurred")
    } else {
      console.error("Unknown error: ", error.message)
      throw new Error("An unknown error occurred")
    }
  } finally {
    nProgress.done()
  }
}

interface ImageDTO {
  id: number
  filePath: string
  altText: string | null
}

interface AdvertisementPackageViewDTO {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  createdDate: string
  isActive: boolean
  createdBy: string
  imageViewDTOs: ImageDTO[]
}

interface PaymentByIdResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  errors: any
  result: {
    id: number
    userName: string
    transactionId: number
    content: string
    amount: number
    createdDate: string
    advertisementPackageViewDTO: AdvertisementPackageViewDTO
  }
}

export const getPaymentByIdForMember = async (
  id: number
): Promise<PaymentByIdResponse> => {
  try {
    nProgress.start()

    const response = await axiosClient.get<PaymentByIdResponse>(
      `/api/Payments/get-payment-by-id-for-member/${id}`
    )

    return response.data
  } catch (error: any) {
    console.error("Error fetching payment by ID:", error)
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred")
    } else {
      throw new Error("An unknown error occurred")
    }
  } finally {
    nProgress.done()
  }
}

export const getAllPaymentsForAdmin = async (
  requestData: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    nProgress.start()

    const response = await axiosClient.post<PaymentResponse>(
      "/api/Payments/get-all-payments-for-admin",
      requestData
    )

    return response.data
  } catch (error: any) {
    nProgress.done()
    if (error.response) {
      console.error("API Error: ", error.response.data.message)
      throw new Error(error.response.data.message || "An error occurred")
    } else {
      console.error("Unknown error: ", error.message)
      throw new Error("An unknown error occurred")
    }
  } finally {
    nProgress.done()
  }
}

interface ResponsePayment {
  statusCode: number;
  message: string;
}

export const getResponsePayment = async (url: string): Promise<ResponsePayment> => {
  try {
    nProgress.start();

    const response = await axiosClient.get<ResponsePayment>(
      `/api/Payments/response-payment${url}`
    );

    return {
      statusCode: response.status,
      message: "Success",
    };
  } catch (error: any) {
    console.error("Error in response payment request:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      throw new Error("An unknown error occurred");
    }
  } finally {
    nProgress.done();
  }
};
