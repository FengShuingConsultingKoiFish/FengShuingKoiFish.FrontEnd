interface SubmitButtonProps {
  label: string
  onClick?: () => void
}

const OnclickButton: React.FC<SubmitButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="button-glow w-36 rounded-md bg-purple-500 px-4 py-2 font-bold text-white transition-colors hover:bg-purple-500"
    >
      {label}
    </button>
  )
}

export default OnclickButton
