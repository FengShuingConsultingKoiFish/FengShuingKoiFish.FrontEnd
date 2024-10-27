import nProgress from "nprogress"
import "nprogress/nprogress.css"
import toast from "react-hot-toast"

import { axiosClient } from "./config/axios-client"

interface AdvertisementDTO {
  purchasedPackageId: number
  title: string
  description: string
  price: number
  imageIds: number[]
}

export const createUpdateAdvertisement = async (
  advertisementData: AdvertisementDTO
) => {
  try {
    nProgress.start()

    const response = await axiosClient.post(
      "/api/Advertisements/create-update-advertisement",
      advertisementData
    )
    return response.data
  } catch (error: any) {
    nProgress.done()
    if (error.response) {
      console.error("API Error: ", error.response.data.message)
      throw new Error(error.response.data.result.message || "An error occurred")
    } else {
      console.error("Unknown error: ", error.message)
      toast.error("An unknown error occurred")
      throw new Error("An unknown error occurred")
    }
  } finally {
    nProgress.done()
  }
}

interface AddImagesToAdvertisementDTO {
  advertisementId: number
  imagesId: number[]
}

export const addImagesToAdvertisement = async (
  addImagesData: AddImagesToAdvertisementDTO
) => {
  try {
    nProgress.start()

    const response = await axiosClient.post(
      "/api/Advertisements/add-images-to-advertisement",
      addImagesData
    )
    return response.data
  } catch (error: any) {
    nProgress.done()
    if (error.response) {
      console.error("API Error: ", error.response.data.message)
      toast.error(error.response.data.message || "An error occurred")
      throw new Error(error.response.data.message || "An error occurred")
    } else {
      console.error("Unknown error: ", error.message)
      toast.error("An unknown error occurred")
      throw new Error("An unknown error occurred")
    }
  } finally {
    nProgress.done()
  }
}

interface DeleteImagesFromAdvertisementDTO {
  advertisementId: number
  imageIds: number[]
}

export const deleteImagesFromAdvertisement = async (
  deleteImagesData: DeleteImagesFromAdvertisementDTO
) => {
  try {
    nProgress.start()
    const response = await axiosClient.post(
      "/api/Advertisements/delete-images-from-advertisement",
      deleteImagesData
    )
    return response.data
  } catch (error: any) {
    nProgress.done()
    if (error.response) {
      console.error("API Error: ", error.response.data.message)
      toast.error(error.response.data.message || "An error occurred")
      throw new Error(error.response.data.message || "An error occurred")
    } else {
      console.error("Unknown error: ", error.message)
      toast.error("An unknown error occurred")
      throw new Error("An unknown error occurred")
    }
  } finally {
    nProgress.done()
  }
}

interface Advertisement {
  id: number;
  userName: string;
  title: string;
  description: string;
  price: number;
  createdDate: string;
  status: string;
  imageViewDTOs: Array<{
    id: number;
    filePath: string;
    altText: string | null;
    userId: string;
    userName: string;
    createdDate: string;
  }>;
}

interface AdvertisementAdminResponse {
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
    datas: Advertisement[];
  };
}

interface GetAdvertisementsRequest {
  pageIndex: number;
  pageSize: number;
  title?: string;
  advertisementStatus?: string | number;
  orderAdvertisement?: string | null;
  orderComment?: string | null;
  orderImage?: string | null;
}

export const getAllAdvertisementsForAdmin = async (
  requestData: GetAdvertisementsRequest
): Promise<AdvertisementAdminResponse> => {
  try {
    nProgress.start();

    const response = await axiosClient.post<AdvertisementAdminResponse>(
      "/api/Advertisements/get-all-advertisements-for-admin",
      requestData
    );

    return response.data;
  } catch (error: any) {
    nProgress.done();
    if (error.response) {
      console.error("API Error: ", error.response.data.message);
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      console.error("Unknown error: ", error.message);
      throw new Error("An unknown error occurred");
    }
  } finally {
    nProgress.done();
  }
};

interface UpdateAdvertisementStatusDTO {
  id: number;
  status: number;
}

export const updateAdvertisementStatus = async (
  updateData: UpdateAdvertisementStatusDTO
): Promise<void> => {
  try {
    nProgress.start();

    const response = await axiosClient.post(
      "/api/Advertisements/update-status-advertisement",
      updateData
    );
    return response.data;
  } catch (error: any) {
    nProgress.done();
    if (error.response) {
      console.error("API Error: ", error.response.data.message);
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      console.error("Unknown error: ", error.message);
      throw new Error("An unknown error occurred");
    }
  } finally {
    nProgress.done();
  }
};
