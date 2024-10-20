import React, { useState } from "react"

import {
  IconBan,
  IconBrandBlogger,
  IconFlag,
  IconRosetteDiscountCheck,
  IconTrash
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { Link, Outlet } from "react-router-dom"

import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarBody,
  SidebarLink
} from "../Admin/components/CustomSidebar"

export function ManageBlogPage() {
  const links = [
    {
      label: "Đang chờ",
      href: "/admin/blogs/pending",
      icon: (
        <IconBrandBlogger className="h-5 w-5 flex-shrink-0 text-neutral-700" />
      )
    },
    {
      label: "Đã đăng",
      href: "/admin/blogs/approved",
      icon: (
        <IconRosetteDiscountCheck className="h-5 w-5 flex-shrink-0 text-neutral-700" />
      )
    },
    {
      label: "Đã từ chối kèm theo ý kiến đóng góp",
      href: "/admin/blogs/rejected",
      icon: <IconBan className="h-5 w-5 flex-shrink-0 text-neutral-700" />
    },
    {
      label: "Đã gỡ kèm theo ý kiến đóng góp",
      href: "/admin/blogs/removed",
      icon: <IconTrash className="h-5 w-5 flex-shrink-0 text-neutral-700" />
    },
    {
      label: "Bị gắn cờ",
      href: "/admin/blogs/flagged",
      icon: <IconFlag className="h-5 w-5 flex-shrink-0 text-neutral-700" />
    }
  ]
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(
        "mx-auto flex w-full min-h-screen flex-col rounded-md border border-neutral-200 bg-gray-100 md:flex-row"
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
    <div className="flex flex-1 ">
      <div className="flex w-full h-full flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10">
        <div className="flex flex-grow flex-col items-center justify-start text-black">
            <Outlet />
        </div>
      </div>
    </div>
  )
}
