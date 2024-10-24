import { Control, Controller, FieldError, FieldErrors } from "react-hook-form"
import { UseFormRegister } from "react-hook-form"
import { FaDongSign } from "react-icons/fa6"
import { NumericFormat, NumericFormatProps } from "react-number-format"

interface InputProps {
  id: string
  label: string
  disabled?: boolean
  formatPrice?: boolean
  control?: Control<any>
  type?: "text" | "password" | "email" | "number"
  register: UseFormRegister<any>
  required?: boolean
  errors: FieldErrors
  placeholder?: string
  onChange: any
  validate?: any
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  disabled = false,
  formatPrice = false,
  control,
  register,
  required = false,
  errors,
  onChange,
  type = "text",
  placeholder,
  validate
}) => {
  return (
    <div className="relative w-full">
      {formatPrice && (
        <FaDongSign
          size={24}
          className="absolute bottom-[0.5px] left-3 -translate-y-6 transform text-neutral-700"
        />
      )}

      {formatPrice && control ? (
        <Controller
          control={control}
          name={id}
          rules={{ required, validate }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              id={id}
              disabled={disabled}
              value={value}
              onValueChange={(values) => {
                onChange(values.floatValue)
              }}
              placeholder={placeholder}
              thousandSeparator=","
              decimalScale={0}
              className={`peer w-full rounded-md border-2 bg-white p-4 pt-6 outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${
                errors[id] ? "border-rose-500" : "border-neutral-300"
              } ${
                errors[id]
                  ? "focus:border-rose-500"
                  : "focus:border-neutral-black"
              } pl-10`}
            />
          )}
        />
      ) : (
        <input
          id={id}
          disabled={disabled}
          {...register(id, { required, validate })}
          placeholder={placeholder}
          onChange={onChange}
          type={type}
          className={`peer w-full rounded-md border-2 bg-white p-4 pt-6 outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${
            errors[id] ? "border-rose-500" : "border-neutral-300"
          } ${
            errors[id] ? "focus:border-rose-500" : "focus:border-neutral-black"
          } ${formatPrice ? "pl-10" : ""}`}
        />
      )}
      <label
        className={`text-md absolute top-5 z-10 origin-[0] -translate-y-3 transform duration-150 ${formatPrice ? "left-9" : "left-4"} peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 ${errors[id] ? "text-rose-500" : "text-zinc-400"} `}
      >
        {label}
      </label>
    </div>
  )
}

export default Input
