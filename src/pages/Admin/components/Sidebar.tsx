import React from "react"

import { FaCircle, FaClipboardCheck, FaFlag, FaTrashAlt } from "react-icons/fa"

interface SidebarItem {
  label: string
  icon?: React.ReactNode
  isActive?: boolean
  notificationCount?: number
  onClick?: () => void
}

interface SidebarProps {
  items: SidebarItem[]
  title: string
}

const Sidebar: React.FC<SidebarProps> = ({ items, title }) => {
    return (
      <div className="w-64 h-screen bg-gray-900 text-white">
        <div className="p-7 text-lg font-semibold border-b border-gray-700">
          {title}
        </div>
  
        <ul className="mt-4">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={item.onClick}
              className={`p-3 flex items-center cursor-pointer hover:bg-gray-700 transition ${
                item.isActive ? "bg-gray-800" : ""
              }`}
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              <span className="flex-grow">{item.label}</span>
              {item.notificationCount !== undefined && (
                <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
                  {item.notificationCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Sidebar;
