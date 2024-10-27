import React from "react"

interface ConfirmModalProps {
  isVisible: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isVisible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        inset: "0"
      }}
    >
      <div className="relative mx-auto w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
        <h2 className="mb-4 text-lg font-bold">Xác nhận xóa</h2>
        <p>{message}</p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            className="rounded bg-red-500 px-4 py-2 text-white transition duration-200 hover:bg-red-400"
            onClick={onConfirm}
          >
            Xóa
          </button>
          <button
            className="rounded bg-gray-300 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-400"
            onClick={onCancel}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
