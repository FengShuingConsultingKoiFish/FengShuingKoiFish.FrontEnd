import { axiosClient } from "./config/axios-client";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

interface RequestPaymentPayload {
  userId: string;
  packageName: string;
  fullName: string;
  description: string;
  amount: number;
  createdDate: string;
}

export const RequestPayment = async (paymentData: RequestPaymentPayload) => {
  try {
    nProgress.start();

    const response = await axiosClient.post("/api/Payments/request-payment", paymentData);

    return response.data;
  } catch (error) {
    console.error("Error in payment request:", error);
    throw error;
  } finally {
    nProgress.done();
  }
};
