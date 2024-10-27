import { axiosClient } from "./config/axios-client";

interface PurchasedPackageRequest {
  pageIndex: number;
  pageSize: number;
  status: number | null;
  orderImage?: string | null;
  orderDate?: string | null;
}

interface AdvertisementPackage {
  id: number;
  name: string;
  price: number;
  description: string;
  limitAd: number;
  limitContent: number;
  limitImage: number;
  isActive: boolean;
  createdDate: string;
}

interface PurchasedPackage {
  id: number;
  monitoredQuantity: number;
  username: string;
  status: number | null;
  createDate: string;
  advertisementPackageViewDTO: AdvertisementPackage;
}

interface PurchasedPackageResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  errors: any;
  result: {
    pageIndex: number;
    totalPages: number;
    totalItems: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    datas: PurchasedPackage[];
  };
}

export const getAllPurchasedPackagesForUser = async (
  requestData: PurchasedPackageRequest
): Promise<PurchasedPackageResponse> => {
  try {
    const response = await axiosClient.post<PurchasedPackageResponse>(
      "/api/PurchasedPackages/get-all-purchased-package-for-user",
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching purchased packages", error);
    throw error;
  }
};

interface AdvertisementPackage {
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
  imageViewDTOs: Array<{
    id: number;
    filePath: string;
    altText: string | null;
    userId: string;
  }>;
}

interface PurchasedPackageByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  errors: any;
  result: {
    id: number;
    monitoredQuantity: number;
    userName: string;
    status: number;
    createDate: string;
    advertisementPackageViewDTO: AdvertisementPackage;
  };
}

export const getPurchasedPackageById = async (id: number): Promise<PurchasedPackageByIdResponse> => {
  try {
    const response = await axiosClient.get<PurchasedPackageByIdResponse>(
      `/api/PurchasedPackages/get-purchased-package-by-id-for-user/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching purchased package by ID", error);
    throw error;
  }
};

interface PurchasedPackageAdminResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  errors: any;
  result: {
    pageIndex: number;
    totalPages: number;
    totalItems: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    datas: PurchasedPackage[];
  };
}

export const getAllPurchasedPackagesForAdmin = async (
  requestData: PurchasedPackageRequest
): Promise<PurchasedPackageAdminResponse> => {
  try {
    const response = await axiosClient.post<PurchasedPackageAdminResponse>(
      "/api/PurchasedPackages/get-all-purchased-package-for-admin",
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching purchased packages for admin", error);
    throw error;
  }
};
