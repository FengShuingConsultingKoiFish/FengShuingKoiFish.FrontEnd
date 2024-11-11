import { useEffect } from "react"

import {
  IconBadgeAdFilled,
  IconCreditCard,
  IconFish,
  IconPackage,
  IconUsersGroup,
  IconWaterpolo,
  IconWriting,
  IconYinYang,
  IconZodiacAquarius
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

import { FloatingDock } from "@/components/ui/FloatingDock"
import { Spotlight } from "@/components/ui/Spotlight"

export function AdminPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row",
        "h-screen"
      )}
    >
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
  const links = [
    {
      title: "Quản lý blog",
      icon: <IconWriting className="h-full w-full text-neutral-300" />,
      href: "/admin/blogs"
    },

    {
      title: "Quản lí gói quảng cáo",
      icon: <IconPackage className="h-full w-full text-neutral-300" />,
      href: "/admin/goi-quang-cao"
    },
    {
      title: "Quản lý người dùng",
      icon: <IconUsersGroup className="h-full w-full text-neutral-300" />,
      href: "/admin/nguoi-dung"
    },
    {
      title: "Quản lý quảng cáo của người dùng",
      icon: <IconBadgeAdFilled className="h-full w-full text-neutral-300" />,
      href: "/admin/quang-cao"
    },

    {
      title: "Quản lý giao dịch",
      icon: <IconCreditCard className="h-full w-full text-neutral-300" />,
      href: "/admin/giao-dich"
    },
    {
      title: "Quản lí mệnh",
      href: "/admin/quan-li-menh",
      icon: <IconZodiacAquarius className="h-full w-full text-neutral-300" />
    },
    {
      title: "Quản lí cá và hồ",
      href: "/admin/quan-li-ca-va-ho",
      icon: <IconFish className="h-full w-full text-neutral-300" />
    },
    {
      title: "Quản lí loại cá và loại hồ",
      href: "/admin/quan-li-loai-ca-va-loai-ho",
      icon: <IconWaterpolo className="h-full w-full text-neutral-300" />
    },
    {
      title: "Quản lí Mệnh tương thích",
      href: "/admin/quan-li-menh-tuong-thich",
      icon: <IconYinYang className="h-full w-full text-neutral-300" />
    },
  ]
  return (
    <div className="flex flex-1">
      <div className="bg-grid-white/[0.02] relative flex h-screen w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
          <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text py-3 text-center text-4xl font-bold text-transparent md:text-7xl">
            Quản lý <br /> hệ thống
          </h1>
          <div className="flex h-[35rem] w-full items-center justify-center">
            <FloatingDock mobileClassName="translate-y-20" items={links} />
          </div>
        </div>
      </div>
    </div>
  )
}
