"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: "text" | "password" | "email" | "number"; 
  disabled?: boolean;
  formatPrice?: boolean;
  register: UseFormRegister<any>; 
  required?: boolean;
  errors: FieldErrors<any>;
  domain?: string;
  placeholder: string;
  onChange:any
}

const Input = ({
  id,
  label,
  type = "text",
  disabled = false,
  formatPrice = false,
  register,
  required = false,
  errors,
  domain,
  placeholder,
  onChange
}: InputProps) => {
  return (
    <div className="w-full relative">
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder={placeholder}
        onChange={onChange}
        type={type}
        className={`peer w-full p-4 pt-6 bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
            ${formatPrice ? "pl-9" : "pl-4"}
            ${errors[id] ? "border-rose-500" : "border-neutral-300"}
            ${errors[id] ? "focus:border-rose-500" : "focus:border-neutral-black"}
        `}
      />
      {domain && (
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-700">
          {domain}
        </span>
      )}

      <label
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] 
          ${formatPrice ? "left-9" : "left-4"}
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-zinc-400"}  
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
