import React from "react"

interface CustomButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
  type?: "button" | "submit" | "reset"
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  disabled,
  icon,
  isLoading
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`my-5 flex flex-row items-center rounded-md border px-4 py-2 text-sm transition duration-200 ${disabled ? "cursor-not-allowed border-gray-400 bg-gray-200 text-gray-400" : "border-black bg-white text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  )
}

export default CustomButton
