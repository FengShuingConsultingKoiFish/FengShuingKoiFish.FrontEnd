// src/components/BackButton.tsx
import React from "react"

import { useNavigate } from "react-router-dom"

interface BackButtonProps {
  label?: string
}

const BackButton: React.FC<BackButtonProps> = ({ label = "Trở lại" }) => {
  const navigate = useNavigate()

  return (
    <button
      className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
      onClick={() => navigate(-1)}
    >
      {label}
    </button>
  )
}

export default BackButton
