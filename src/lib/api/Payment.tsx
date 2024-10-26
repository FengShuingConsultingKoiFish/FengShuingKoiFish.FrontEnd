import { axiosClient } from "./config/axios-client";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

interface PurchasePackagePayload {
  packageId: number
  name: string
  price: number
}

export const PurchasePackage = async (paymentData: PurchasePackagePayload) => {
  try {
    nProgress.start();

    const response = await axiosClient.post("/api/Payments/purchase-package", paymentData);

    return response.data;
  } catch (error) {
    console.error("Error in payment request:", error);
    throw error;
  } finally {
    nProgress.done();
  }
};
