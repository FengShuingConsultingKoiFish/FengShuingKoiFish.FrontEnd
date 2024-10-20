import { axiosClient } from "./config/axios-client";
import nProgress from "nprogress"
import "nprogress/nprogress.css"

interface CreateUpdateBlogRequest {
    id: number;
    title: string;
    content: string;
    imageIds: number[];
  }


  interface CreateUpdateBlogResponse {
    statusCode: number;
    isSuccess: boolean;
    message: string;
    result: {
      id: number;
      title: string;
      content: string;
      imageIds: number[];
    };
  }

  export const createUpdateBlog = async (
    blogData: CreateUpdateBlogRequest
  ): Promise<CreateUpdateBlogResponse> => {
    try {
      const response = await axiosClient.post<CreateUpdateBlogResponse>(
        "/api/Blogs/create-update-blogs",
        blogData
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


  interface GetAllBlogsForAdminRequest {
    pageIndex: number;
    pageSize: number;
    title?: string;
    blogStatus?: number | null;
    orderBlog?: string | null;
    orderComment?: string | null;
    orderImage?: string | null;
  }

  interface ImageViewDto {
    id: number;
    filePath: string;
    altText: string | null;
    userId: string;
    userName: string;
    createdDate: string;
  }

  interface Blog {
    id: number;
    title: string;
    content: string;
    userName: string;
    createdDate: string;
    status: string;
    imageViewDtos: ImageViewDto[];
  }


  interface GetAllBlogsForAdminResponse {
    statusCode: number;
    isSuccess: boolean;
    message: string;
    result: {
      pageIndex: number;
      totalPages: number;
      totalItems: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      datas: Blog[];
    };
  }

  export const getAllBlogsForAdmin = async (
    requestData: GetAllBlogsForAdminRequest
  ): Promise<GetAllBlogsForAdminResponse> => {
    try {
      nProgress.start()
      const response = await axiosClient.post<GetAllBlogsForAdminResponse>(
        "/api/Blogs/get-all-blogs-for-admin",
        requestData
      );
      nProgress.done()
      console.log(response)
      return response.data;
    } catch (error: any) {
      if (error.response) {
        nProgress.done()
        console.error("API Error: ", error.response.data.message);
        throw new Error(error.response.data.message || "An error occurred");
      } else {
        console.error("Unknown error: ", error.message);
        throw new Error("An unknown error occurred");
      }
    }
  };

  interface UpdateBlogStatusRequest {
    id: number;
    status: number;
  }
  
  interface UpdateBlogStatusResponse {
    statusCode: number;
    isSuccess: boolean;
    message: string;
  }

  export const updateBlogStatus = async (
    requestData: UpdateBlogStatusRequest
  ): Promise<UpdateBlogStatusResponse> => {
    try {
      nProgress.start();
      const response = await axiosClient.post<UpdateBlogStatusResponse>(
        "/api/Blogs/update-status-blogs",
        requestData
      );
      nProgress.done();
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
    }
  };




