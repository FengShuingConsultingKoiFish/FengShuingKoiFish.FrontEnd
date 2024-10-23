import nProgress from "nprogress"
import "nprogress/nprogress.css"
import toast from "react-hot-toast"

import { axiosClient } from "./config/axios-client"

interface AdvertisementPackageRequest {
  id: number
  name: string
  price: number
  description: string
  limitAd: number
  limitContent: number
  limitImage: number
  imageIds: number[]
}

interface CreateUpdateAdvertisementPackageResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  result: {
    id: number
    title: string
    content: string
    imageIds: number[]
  }
}

export const createUpdateAdvertisement = async (
  advertisementPackage: AdvertisementPackageRequest
): Promise<CreateUpdateAdvertisementPackageResponse> => {
  try {
    nProgress.start()
    const response =
      await axiosClient.post<CreateUpdateAdvertisementPackageResponse>(
        "/api/AdvertisementPackages/create-update-advertisement-package",
        advertisementPackage
      )
    return response.data
  } catch (error: any) {
    if (error.response) {
      nProgress.done()
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

interface ImageViewDTO {
  id: number
  filePath: string
  altText: string | null
  userId: string
  userName: string
  createdDate: string
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
  createdBy: string;
  imageViewDTOs: ImageViewDTO[]
}
    


interface GetAllAdvertisementPackagesResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  result: {
    pageIndex: number;
    totalPages: number;
    totalItems: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    datas: AdvertisementPackage[];
  };
}

interface GetAllAdvertisementPackagesRequest {
  pageIndex: number;
  pageSize: number;
  name?: string;
  priceFilter?: number | null;
  orderImage?: number | null;
}

export const getAllAdvertisementsPkg = async (
  requestData: GetAllAdvertisementPackagesRequest
): Promise<GetAllAdvertisementPackagesResponse> => {
  try {
    nProgress.start();
    const response = await axiosClient.post<GetAllAdvertisementPackagesResponse>(
      "/api/AdvertisementPackages/get-all-packages",
      requestData
    );
    return response.data;
  } catch (error: any) {
    nProgress.done();
    if (error.response) {
      console.error("API Error: ", error.response.data.message);
      toast.error(error.response.data.message || "An error occurred");
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      console.error("Unknown error: ", error.message);
      toast.error("An unknown error occurred");
      throw new Error("An unknown error occurred");
    }
  } finally {
    nProgress.done();
  }
};

interface GetAdvertisementPackageByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  result: AdvertisementPackage;
}

export const getAdvertisementPackageById = async (id: number): Promise<GetAdvertisementPackageByIdResponse> => {
  try {
    nProgress.start();
    const response = await axiosClient.get<GetAdvertisementPackageByIdResponse>(
      `/api/AdvertisementPackages/get-package-by-id/${id}`
    );
    return response.data;
  } catch (error: any) {
    nProgress.done();
    if (error.response) {
      console.error("API Error: ", error.response.data.message);
      toast.error(error.response.data.message || "An error occurred");
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      console.error("Unknown error: ", error.message);
      toast.error("An unknown error occurred");
      throw new Error("An unknown error occurred");
    }
  } finally {
    nProgress.done();
  }
};

interface AddImagesToPackageRequest {
  advertisementPackageId: number;
  imagesId: number[];
}

// Interface for the response
interface AddImagesToPackageResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
}

export const addImagesToAdvertisementPackage = async (
  requestData: AddImagesToPackageRequest
): Promise<AddImagesToPackageResponse> => {
  try {
    nProgress.start();
    const response = await axiosClient.post<AddImagesToPackageResponse>(
      "/api/AdvertisementPackages/add-images-to-packages",
      requestData
    );
    return response.data;
  } catch (error: any) {
    nProgress.done();
    if (error.response) {
      console.error("API Error: ", error.response.data.message);
      toast.error(error.response.data.message || "An error occurred");
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      console.error("Unknown error: ", error.message);
      toast.error("An unknown error occurred");
      throw new Error("An unknown error occurred");
    }
  } finally {
    nProgress.done();
  }
};
