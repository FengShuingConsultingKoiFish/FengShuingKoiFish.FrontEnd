import { axiosClient } from "./config/axios-client";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

interface ImageViewDTO {
  id: number;
  filePath: string;
  altText: string | null;
  userId: string;
  userName: string;
  createdDate: string;
}

interface AdvertisementPackageViewDTO {
  id: number;
  name: string;
  price: number;
  description: string;
  limitAd: number;
  limitContent: number;
  limitImage: number;
  isActive: boolean;
  createdDate: string;
  createdBy: string;
  imageViewDTOs: ImageViewDTO[];
}

interface PurchasedPackage {
  id: number;
  monitoredQuantity: number;
  userName: string;
  status: number;
  createdDate: string;
  advertisementPackageViewDTO: AdvertisementPackageViewDTO;
}

interface PurchasePackageRequest {
  pageIndex: number;
  pageSize: number;
  status?: number | null;
  orderImage?: number | null;
  orderDate?: number | null;
}

interface PurchasedPackageResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  result: {
    pageIndex: number;
    totalPages: number;
    totalItems: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    datas: PurchasedPackage[];
    advertisementPackageViewDTO: AdvertisementPackageViewDTO;
  };
}

export const getAllPurchasedPkgForUser = async (
  requestData: PurchasePackageRequest
): Promise<PurchasedPackageResponse> => {
  try {
    nProgress.start();

    const response = await axiosClient.post<PurchasedPackageResponse>(
      "/api/PurchasedPackages/get-all-purchased-package-for-user",
      requestData
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error:", error.response.data.message);
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      console.error("Unknown error:", error.message);
      throw new Error("An unknown error occurred");
    }
  } finally {
    nProgress.done();
  }
};

export const getPurchasedPackageById = async (
  packageId: number
): Promise<PurchasedPackageResponse> => {
  try {
    nProgress.start();

    const response = await axiosClient.get<PurchasedPackageResponse>(
      `/api/PurchasedPackages/get-purchased-package-by-id-for-user/${packageId}`
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error:", error.response.data.message);
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      console.error("Unknown error:", error.message);
      throw new Error("An unknown error occurred");
    }
  } finally {
    nProgress.done();
  }
};
