import { axiosClient } from "./config/axios-client";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

interface CommentRequest {
  commentId?: number;
  blogId: number;
  content: string;
}

interface AdvertisementCommentRequest {
  commentId?: number;
  advertisementId: number;
  content: string;
}

interface CommentResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
}

export const createUpdateComment = async (
  requestData: CommentRequest
): Promise<CommentResponse> => {
  try {
    nProgress.start();

    const response = await axiosClient.post<CommentResponse>(
      "/api/Comments/create-update-comment-for-blog",
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

export const createUpdateCommentForAdvertisement = async (
  requestData: AdvertisementCommentRequest
): Promise<CommentResponse> => {
  try {
    nProgress.start();

    const response = await axiosClient.post<CommentResponse>(
      "/api/Comments/create-update-comment-for-advertisement",
      requestData
    );

    return response.data;
  } catch (error: any) {
    nProgress.done();
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
