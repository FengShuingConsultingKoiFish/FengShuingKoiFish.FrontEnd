import React from "react"

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
  | undefined

interface StatusProps {
  status: string | number
}

const Status: React.FC<StatusProps> = ({ status }) => {
  let statusClass: string
  let label: string

  switch (status) {
    case "Active":
    case 1:
      statusClass = "bg-green-500"
      label = "Hoạt động"
      break
    case "Approved":
      statusClass = "bg-green-500"
      label = "Đã duyệt"
      break
    case "Rejected":
      statusClass = "bg-red-500"
      label = "Đã từ chối"
      break
    case "Pending":
      statusClass = "bg-yellow-500"
      label = "Đang đợi duyệt"
      break
    case "Inactive":
    case 2:
      statusClass = "bg-red-500"
      label = "Không khả dụng"
      break

    default:
      statusClass = "bg-gray-500"
      label = "Unknown"
  }

  return (
    <div
      className={`rounded-full px-4 py-2 text-center font-bold text-white ${statusClass} w-fit`}
    >
      {label}
    </div>
  )
}

export default Status
