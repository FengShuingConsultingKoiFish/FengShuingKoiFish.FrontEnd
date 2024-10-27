import React from "react"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
  confirmText?: string
  cancelText?: string
}

const ConfirmModal1: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy"
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6">
        <p className="mb-4 text-center text-gray-700">{message}</p>
        <div className="flex justify-around">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className="rounded bg-gray-300 px-4 py-2 text-gray-700"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal1
