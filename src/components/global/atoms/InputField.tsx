import React from "react"

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  id: string
  type?: "text" | "select"
  options?: string[]
  readOnly?: boolean // Thêm thuộc tính readOnly
  disabled?: boolean // Thêm thuộc tính disabled
  placeholder?: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  id,
  type = "text",
  options,
  readOnly = false, // Giá trị mặc định là false
  disabled = false // Giá trị mặc định là false
}) => {
  return (
    <div className="flex-1">
      <label className="mb-1 block" htmlFor={id}>
        {label} <span className="text-red-500">*</span>
      </label>
      {type === "text" ? (
        <input
          className="w-full rounded bg-white p-2 text-black"
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly} // Áp dụng readOnly cho input
        />
      ) : (
        <select
          className="w-full rounded bg-white p-2 text-black"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled} // Áp dụng disabled cho select
        >
          {options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

export default InputField
