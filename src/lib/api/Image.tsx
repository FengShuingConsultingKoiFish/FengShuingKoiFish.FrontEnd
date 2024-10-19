import axios from "axios";
import { axiosClient } from "./config/axios-client";


interface ImageUploadResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  result: { 
      altText: string;
      createdDate: string;
      filePath: string;
      id : number
      userId: string;
      userName: string;
  
    imageUrl: string;
    thumbnailUrl: string;
  };
  }

  interface ImageUpdateRequest {
    id: number;
    altText?: string;
  }
  
  interface ImageUpdateResponse {
    statusCode: number;
    isSuccess: boolean;
    message: string;
    result: {
      avatar: number;
    };
  }

  interface GetImagesForMemberResponse {
    statusCode: number;
    isSuccess: boolean;
    message: string;
    result: {
      pageIndex: number;
      totalPages: number;
      totalItems: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      datas: Array<{
        id: number;
        filePath: string; 
        altText: string | null;
        userId: string;
        userName: string;
        createdDate: string;
      }>;
    };
  }
  
  
  export const uploadImage = async (
    filePath: File,
    //fileName : string
  ): Promise<number> => {
    try {
      const formData = new FormData();
      formData.append("file", filePath);
      //formData.append("altText", altText )
  
      const response = await axiosClient.post<ImageUploadResponse>(
        `/api/Images/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.result.id;
      
    } catch (error: any) {
      throw error;
    }
  };


  export const updateUserAvatar = async (
    avatar: number,
  ): Promise<ImageUpdateResponse> => {
    try {
      const response = await axiosClient.post<ImageUpdateResponse>(
        `/api/UserDetails/update-user-avatar`,
        {
          avatar
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error("API Error: ", error.response.data.message);
        throw new Error(error.response.data.message || "An error occurred");
      } else {
        console.error("Unknown error: ", error.message);
        throw new Error("An unknown error occurred");
      }
    }
  };
  

  interface GetImagesForMemberRequest {
    pageIndex: number;
    pageSize: number;
    name?: string;
    orderDate?: null;
  }
  
  
  export const getImagesForMember = async (
    requestData: GetImagesForMemberRequest
  ): Promise<GetImagesForMemberResponse> => {
    try {
      const response = await axiosClient.post<GetImagesForMemberResponse>(
        "/api/Images/get-images-for-member",
        requestData
      );
      console.log(response)
      return response.data;
      
    } catch (error: any) {
      throw error;
    }
  };