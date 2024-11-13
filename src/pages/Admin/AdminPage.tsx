import { useEffect, useState } from "react"

import {
  IconAdCircle,
  IconBadgeAdFilled,
  IconCreditCard,
  IconCurrencyDong,
  IconFish,
  IconPackage,
  IconPackageExport,
  IconUsers,
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

import BarChart from "./charts/Barchart"
import TotalSection from "./components/TotalSection"
import { GetTotalStatisticsInYear, GetMonthlyRevenueInYear } from "@/lib/api/Admin"

export function AdminPage() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>(Array(12).fill(0));

  const [totalStatistics, setTotalStatistics] = useState({
    totalRevenueInYear: 0,
    totalUserInYear: 0,
    totalAdsInYear: 0,
    totalPackageInYear: 0
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch total statistics
    const fetchTotalStatistics = async () => {
      try {
        const data = await GetTotalStatisticsInYear();
        if (data.isSuccess) {
          setTotalStatistics(data.result);
        }
      } catch (error) {
        console.error("Error fetching total statistics:", error);
      }
    };

    // Fetch monthly revenue data
    const fetchMonthlyRevenue = async () => {
      try {
        const data = await GetMonthlyRevenueInYear();
        if (data.isSuccess) {
          const revenueData = Array(12).fill(0);

          data.result.forEach((item: { month: number; totalRevenue: number }) => {
            revenueData[item.month - 1] = item.totalRevenue;
          });

          setMonthlyRevenue(revenueData);
        }
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
      }
    };

    fetchTotalStatistics();
    fetchMonthlyRevenue();
  }, []);



  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row",
        "h-fit"
      )}
    >
      <Dashboard totalStatistics={totalStatistics} monthlyRevenue={monthlyRevenue}/>
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

const Dashboard = ({ totalStatistics, monthlyRevenue }: { totalStatistics: { totalRevenueInYear: number; totalUserInYear: number; totalAdsInYear: number, totalPackageInYear: number }, monthlyRevenue: number[] }) => {
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
    }
  ]
  return (
    <div className="flex flex-1">
      <div className="bg-grid-white/[0.02] relative flex h-full w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />
        <div className="relative z-10 mx-auto h-full max-h-[55rem] w-full p-4 pt-20 md:pt-0">
          <h1 className="my-10 bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text py-3 text-center text-4xl font-bold text-transparent md:text-7xl">
            Quản lý hệ thống
          </h1>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <TotalSection
              title="Tổng doanh thu"
              icon={<IconCurrencyDong />}
              data={totalStatistics.totalRevenueInYear.toLocaleString()}
            />
            <TotalSection
              title="Người dùng hệ thống"
              icon={<IconUsers />}
              data={totalStatistics.totalUserInYear.toString()}
            />
            <TotalSection
              title="Tổng số quảng cáo đã đăng"
              icon={<IconAdCircle />}
              data={totalStatistics.totalAdsInYear.toString()}
            />
            <TotalSection
              title="Tổng số gói đã bán được"
              icon={<IconPackageExport/>}
              data={totalStatistics.totalPackageInYear.toString()}
            />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-full rounded-xl border bg-card p-4 text-card-foreground shadow" style={{ minHeight: '400px' }}>
              <BarChart revenueData={monthlyRevenue}/>
            </div>
          </div>

          <div className="mt-10 flex h-[35rem] w-full items-center justify-center">
            <FloatingDock
              mobileClassName="fixed right-0 translate-y-20 mr-5"
              items={links}
              desktopClassName="fixed bottom-0 mb-5"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
