import React from "react"

interface SubmitButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean // Thêm thuộc tính disabled
}

const OnclickButton: React.FC<SubmitButtonProps> = ({
  label,
  onClick,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`button-glow w-36 rounded-md px-4 py-2 font-bold text-white transition-colors ${
        disabled
          ? "cursor-not-allowed bg-gray-400"
          : "bg-purple-500 hover:bg-purple-600"
      }`}
      disabled={disabled} // Áp dụng disabled vào button
    >
      {label}
    </button>
  )
}

export default OnclickButton
