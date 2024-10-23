import React, { useEffect, useState } from "react"

import {
  IconBrandTabler,
  IconPackage,
  IconSettings,
  IconWriting
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { TbMoodEmpty } from "react-icons/tb"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

import Breadcrumb from "@/components/ui/Breadcrums"

import {
  Sidebar,
  SidebarBody,
  SidebarLink
} from "../Admin/components/CustomSidebar"

export function AdminPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const links = [
    {
      label: "Thống kê",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700" />
      )
    },
    {
      label: "Quản lý blog",
      href: "/admin/blogs",
      icon: <IconWriting className="h-5 w-5 flex-shrink-0 text-neutral-700" />
    },
    {
      label: "Quản lý gói quảng cáo",
      href: "/admin/goi-quang-cao",
      icon: <IconPackage className="h-5 w-5 flex-shrink-0 text-neutral-700" />
    },
    {
      label: "Cài đặt",
      href: "/",
      icon: <IconSettings className="h-5 w-5 flex-shrink-0 text-neutral-700" />
    }
  ]
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row",
        "h-screen"
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
export const LogoLabel = () => {
  return (
    <Link
      to="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium text-black"
      >
        Koi Consulting
      </motion.span>
    </Link>
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
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-10">
        <Breadcrumb />
        <div className="flex flex-grow flex-col items-center justify-start text-black">
          <TbMoodEmpty size={140} />
          <p className="mt-5 font-semibold">Dashboard cho admin</p>
        </div>
      </div>
    </div>
  )
}
