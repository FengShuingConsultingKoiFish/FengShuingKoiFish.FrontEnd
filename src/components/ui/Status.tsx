
import React from "react";

// Define possible statuses as a union type
type StatusType =
  | "Active"
  | "Accepted"
  | "Completed"
  | "Denied"
  | "Pending"
  | "Inactive"
  | 0
  | 2
  | 3
  | undefined;


interface StatusProps {
  status: string;
}

const Status: React.FC<StatusProps> = ({ status }) => {
  let statusClass: string;
  let label: string;

  switch (status) {
    case "Active":
      statusClass = "bg-green-500";
      label = "Hoạt động";
      break;
    case "Approved":
      statusClass = "bg-green-500";
      label = "Đã duyệt";
      break;
    case "Rejected":
      statusClass = "bg-red-500";
      label = "Đã từ chối";
      break;
    case "Pending":
      statusClass = "bg-yellow-500";
      label = "Đang đợi duyệt";
      break;
    case "Inactive":
      statusClass = "bg-red-500";
      label = "Inactive";
      break;

    default:
      statusClass = "bg-gray-500";
      label = "Unknown";
  }

  return (
    <div
      className={`px-4 py-2 rounded-full text-white text-center font-bold ${statusClass} w-fit`}
    >
      {label}
    </div>
  );
};

export default Status;
