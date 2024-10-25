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
