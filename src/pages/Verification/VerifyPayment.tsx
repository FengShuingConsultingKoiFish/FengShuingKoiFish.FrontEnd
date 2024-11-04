import React, { useEffect, useState } from "react"

import { Link, useLocation, useNavigate } from "react-router-dom"

import { getPaymentResponseMessage } from "@/lib/api/Payment"

const PaymentSuccessPage: React.FC = () => {
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  function convert(text: string): string {
    return encodeURIComponent(text.trim())
  }

  useEffect(() => {
    const verifyPayment = async () => {
      console.log("Starting payment verification...")
      try {
        const searchParams = new URLSearchParams(location.search)
        const responseMessage = searchParams.get("responseMessage") ?? ""

        //const encodedResponseMessage = `responseMessage=${responseMessage}`;

        console.log(
          "Sending request to getPaymentResponseMessage with:",
          convert(responseMessage)
        )
        const paymentResponse = await getPaymentResponseMessage(
          convert(responseMessage)
        )

        console.log("Received paymentResponse:", paymentResponse)
        if (paymentResponse.statusCode === 200) {
          setIsPaymentSuccess(true)
        } else {
          navigate("/thanh-toan-that-bai")
        }
      } catch (error: any) {
        console.error("Payment verification failed:", error)

        if (error.response && error.response.status === 400) {
          console.error("Error message:", error.response.data.message)
          navigate("/thanh-toan-that-bai")
        } else {
          navigate("/thanh-toan-that-bai")
        }
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [location.search, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1>Đang xác thực...</h1>
      </div>
    )
  }

  if (isPaymentSuccess) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>
          <div className="flex flex-col items-center space-y-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-28 w-28 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-4xl font-semibold">
              Thanh toán của bạn đã được xử lý thành công!
            </h1>
            <Link
              to="/"
              className="inline-flex items-center rounded-full border border-indigo-600 bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span className="text-sm font-medium">Trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default PaymentSuccessPage
