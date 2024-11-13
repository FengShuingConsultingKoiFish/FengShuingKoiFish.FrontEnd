import nProgress from "nprogress"
import "nprogress/nprogress.css"

import { axiosClient } from "./config/axios-client"

interface TotalStatiscticsResponse {
  statusCode: number
  isSuccess: boolean
  message: string
  errors: null | string
  result: {
    totalRevenueInYear: number
    totalUserInYear: number
    totalAdsInYear: number
    totalPackageInYear: number
  }
}

interface MonthlyRevenue {
    year: number;
    month: number;
    totalRevenue: number;
}

interface MonthlyRevenueResponse {
    statusCode: number
    isSuccess: boolean
    message: string
    errors: null | string
    result: MonthlyRevenue[]

  }

export const GetTotalStatisticsInYear =
  async (): Promise<TotalStatiscticsResponse> => {
    try {
      nProgress.start()
      const response = await axiosClient.get<TotalStatiscticsResponse>(
        "/api/Admins/get-total-statistics- in-year"
      )
      return response.data
    } catch (error) {
      console.error("Error fetching total statistics:", error)
      throw error
    } finally {
      nProgress.done()
    }
  }

  export const GetMonthlyRevenueInYear = async (): Promise<MonthlyRevenueResponse> => {
    try {
        nProgress.start();
        const response = await axiosClient.get<MonthlyRevenueResponse>('/api/Admins/get-monthly-revenue-in-year');
        return response.data;
    } catch (error) {
        console.error('Error fetching monthly revenue statistics:', error);
        throw error;
    }
    finally{
        nProgress.done()
    }
};
