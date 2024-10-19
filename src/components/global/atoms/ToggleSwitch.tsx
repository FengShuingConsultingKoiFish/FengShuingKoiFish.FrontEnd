import React from "react"

interface ToggleSwitchProps {
  isToggled: boolean
  onToggle: () => void
  labelOn: string
  labelOff: string
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isToggled,
  onToggle,
  labelOn,
  labelOff
}) => {
  return (
    <div className="bottom absolute left-8 flex items-center">
      <label className="relative mr-2 inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={isToggled}
          onChange={onToggle}
          className="peer sr-only"
        />
        <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-purple-500"></div>
        <div className="absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white shadow transition-all duration-300 peer-checked:translate-x-5 peer-checked:bg-pink-500"></div>
      </label>
      <span>{isToggled ? labelOn : labelOff}</span>
    </div>
  )
}

export default ToggleSwitch
