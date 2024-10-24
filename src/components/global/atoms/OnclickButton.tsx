interface SubmitButtonProps {
  label: string
  onClick?: () => void // Thêm thuộc tính onClick để hỗ trợ sự kiện
}

const OnclickButton: React.FC<SubmitButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick} // Gán sự kiện onClick
      className="button-glow mt-14 w-36 rounded-md bg-purple-500 px-4 py-2 font-bold text-white transition-colors hover:bg-purple-500"
    >
      {label}
    </button>
  )
}

export default OnclickButton
