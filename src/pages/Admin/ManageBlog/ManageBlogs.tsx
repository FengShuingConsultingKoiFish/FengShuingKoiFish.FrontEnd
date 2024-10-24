import React, { useState } from "react"

import {
  IconBan,
  IconBrandBlogger,
  IconFlag,
  IconRosetteDiscountCheck,
  IconTrash
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { Link, Outlet, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"

import Breadcrumb from "@/components/ui/Breadcrums"
import { WobbleCard } from "@/components/ui/WobbleCard"

import { Sidebar, SidebarBody, SidebarLink } from "../components/CustomSidebar"

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
  const location = useLocation()
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10">
        <Breadcrumb />
        <div className="flex flex-grow flex-col items-center justify-start text-black">
          {location.pathname === "/admin/blogs" && (
            <div className="mx-auto grid h-screen w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
              <WobbleCard
                containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                className=""
              >
                <div className="max-w-xs">
                  <h2 className="text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:text-xl lg:text-3xl">
                    Tổng số bài đăng
                  </h2>
                  <p className="mt-4 text-left text-base/6 text-neutral-200">
                    With over 100,000 mothly active bot users, Gippity AI is the
                    most popular AI platform for developers.
                  </p>
                </div>
              </WobbleCard>
              <WobbleCard containerClassName="col-span-1 min-h-[300px]">
                <h2 className="max-w-80 text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:text-xl lg:text-3xl">
                  Số bài đăng thành công
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                  If someone yells “stop!”, goes limp, or taps out, the fight is
                  over.
                </p>
              </WobbleCard>
              <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
                <div className="max-w-sm">
                  <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
                    Số bài đăng bị từ chối
                  </h2>
                  <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                    With over 100,000 mothly active bot users, Gippity AI is the
                    most popular AI platform for developers.
                  </p>
                </div>
              </WobbleCard>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
