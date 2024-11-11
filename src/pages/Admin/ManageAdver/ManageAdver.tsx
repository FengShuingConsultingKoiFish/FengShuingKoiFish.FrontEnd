import { useState } from "react"

import { IconBan, IconCheck, IconClockHour2 } from "@tabler/icons-react"
import { Link, Outlet } from "react-router-dom"

import { cn } from "@/lib/utils"

import { AdverSvg } from "@/components/global/icons/icon"
import Breadcrumb from "@/components/ui/Breadcrums"

import { Sidebar, SidebarBody, SidebarLink } from "../components/CustomSidebar"

export function ManageAdverPage() {
  const links = [
    {
      label: "Các quảng cáo đang đợi",
      href: "/admin/quang-cao/pending",
      icon: (
        <IconClockHour2 className="h-5 w-5 flex-shrink-0 text-neutral-700" />
      )
    },
    {
      label: "Các quảng cáo được duyệt",
      href: "/admin/quang-cao/approved",
      icon: <IconCheck className="h-5 w-5 flex-shrink-0 text-neutral-700" />
    },
    {
      label: "Các quảng cáo bị từ chối",
      href: "/admin/quang-cao/rejected",
      icon: <IconBan className="h-5 w-5 flex-shrink-0 text-neutral-700" />
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
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10">
        <Breadcrumb />
        <div className="flex flex-grow flex-col items-center justify-start text-black">
          {location.pathname === "/admin/quang-cao" && (
            <div className="flex flex-col justify-between">
              <p className="my-10 flex items-center justify-center text-4xl font-semibold">
                Quản lý gói quảng cáo
              </p>
              <AdverSvg />
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
