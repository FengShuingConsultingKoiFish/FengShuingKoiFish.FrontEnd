import React from "react"

interface SubmitButtonProps {
  label: string
  disabled?: boolean // Cho phép nhận thuộc tính disabled
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  disabled = false
}) => {
  return (
    <button
      type="submit"
      className={`button-glow mt-14 w-36 rounded-md px-4 py-2 font-bold text-white transition-colors ${
        disabled
          ? "cursor-not-allowed bg-gray-400"
          : "bg-purple-500 hover:bg-purple-600"
      }`}
      disabled={disabled} // Áp dụng thuộc tính disabled
    >
      {label}
    </button>
  )
}

export default SubmitButton
