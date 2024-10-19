import { axiosClient } from "./config/axios-client";

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