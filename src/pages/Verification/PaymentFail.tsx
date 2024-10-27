import React from "react";
import { Link } from "react-router-dom";

const PaymentFailedPage: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-28 w-28 text-red-600 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h1 className="text-4xl font-semibold text-red-600 mb-4">
          Thanh toán thất bại
        </h1>
        <p className="text-lg text-gray-600 mb-8">
         Lỗi
        </p>
        <Link
          to="/"
          className="inline-flex items-center rounded-full border border-red-600 bg-red-600 px-5 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring"
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
          <span className="text-sm font-medium">Về trang chủ</span>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
