import React from "react"

interface SubmitButtonProps {
  label: string
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label }) => {
  return (
    <button
      type="submit"
      className="button-glow mt-14 w-36 rounded-md bg-purple-500 px-4 py-2 font-bold text-white transition-colors hover:bg-purple-500"
    >
      {label}
    </button>
  )
}

export default SubmitButton
