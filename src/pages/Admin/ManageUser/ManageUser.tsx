import React, { useState } from "react"

import {
  IconCirclePlus,
  IconList,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { Link, Outlet } from "react-router-dom"

import { cn } from "@/lib/utils"

import Breadcrumb from "@/components/ui/Breadcrums"

import { Sidebar, SidebarBody, SidebarLink } from "../components/CustomSidebar"

export function ManageUserPage() {
  const links = [
    {
      label: "Xem tất cả người dùng",
      href: "/admin/nguoi-dung/all",
      icon: (
        <IconList className="h-5 w-5 flex-shrink-0 text-neutral-700" />
      )
    },
  ]
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen w-full flex-col rounded-md border border-neutral-200 bg-gray-100 md:flex-row"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div></div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  )
}
export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    ></Link>
  )
}

const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10">
        <Breadcrumb />
        <div className="flex flex-grow flex-col items-center justify-start text-black">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
