import React from "react"

import {
  IconAdFilled,
  IconBan,
  IconCheck,
  IconClockHour2,
  IconCreditCard,
  IconFileText,
  IconFish,
  IconHome,
  IconList,
  IconListDetails,
  IconPackages,
  IconPool,
  IconSquareRoundedPlus,
  IconUser,
  IconWaterpolo
} from "@tabler/icons-react"
import { MdKeyboardArrowRight } from "react-icons/md"
import { Link, useLocation } from "react-router-dom"

const breadcrumbMap: {
  [key: string]: { label: string; icon: React.ReactNode }
} = {
  "/admin": { label: "Trang chủ", icon: <IconHome className="mr-2 h-4 w-4" /> },
  "/admin/blogs": {
    label: "Blogs",
    icon: <IconFileText className="mr-2 h-4 w-4" />
  },
  "/admin/blogs/pending": {
    label: "Blog đang đợi",
    icon: <IconClockHour2 className="mr-2 h-4 w-4" />
  },
  "/admin/blogs/approved": {
    label: "Blog đã duyệt",
    icon: <IconCheck className="mr-2 h-4 w-4" />
  },
  "/admin/blogs/rejected": {
    label: "Blog đã từ chối",
    icon: <IconBan className="mr-2 h-4 w-4" />
  },
  "/admin/goi-quang-cao": {
    label: "Gói Quảng cáo",
    icon: <IconPackages className="mr-2 h-4 w-4" />
  },
  "/admin/goi-quang-cao/create": {
    label: "Tạo gói quảng cáo",
    icon: <IconSquareRoundedPlus className="mr-2 h-4 w-4" />
  },
  "/admin/goi-quang-cao/all": {
    label: "Xem tất cả gói quảng cáo",
    icon: <IconList className="mr-2 h-4 w-4" />
  },
  "/admin/nguoi-dung": {
    label: "Quản lý người dùng",
    icon: <IconUser className="mr-2 h-4 w-4" />
  },
  "/admin/quang-cao": {
    label: "Quản lý quảng cáo",
    icon: <IconAdFilled className="mr-2 h-4 w-4" />
  },
  "/admin/nguoi-dung/all": {
    label: "Xem tất cả người dùng",
    icon: <IconUser className="mr-2 h-4 w-4" />
  },
  "/admin/quang-cao/pending": {
    label: "Các quảng cáo đang đợi",
    icon: <IconClockHour2 className="mr-2 h-4 w-4" />
  },
  "/admin/quang-cao/approved": {
    label: "Các quảng cáo đã duyệt",
    icon: <IconCheck className="mr-2 h-4 w-4" />
  },
  "/admin/quang-cao/rejected": {
    label: "Các quảng cáo bị từ chối",
    icon: <IconBan className="mr-2 h-4 w-4" />
  },
  "/admin/giao-dich": {
    label: "Giao dịch",
    icon: <IconCreditCard className="mr-2 h-4 w-4" />
  },
  "/admin/giao-dich/all": {
    label: "Tất cả giao dịch",
    icon: <IconList className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-menh": {
    label: "Quản lý mệnh",
    icon: <IconPackages className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-menh/create": {
    label: "Tạo mệnh",
    icon: <IconSquareRoundedPlus className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-menh/all": {
    label: "Xem tất cả các mệnh",
    icon: <IconList className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-loai-ca-va-loai-ho": {
    label: "Quản lý loại cá và loại hồ",
    icon: <IconPackages className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-loai-ca-va-loai-ho/all-pond": {
    label: "Xem tất cả loại hồ",
    icon: <IconPool className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-loai-ca-va-loai-ho/all-koi": {
    label: "Xem tất cả loại cá",
    icon: <IconListDetails className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-loai-ca-va-loai-ho/create-pond": {
    label: "Tạo loại hồ",
    icon: <IconWaterpolo className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-loai-ca-va-loai-ho/create-koi": {
    label: "Tạo loại cá",
    icon: <IconFish className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-ca-va-ho": {
    label: "Quản lý cá và hồ",
    icon: <IconPackages className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-ca-va-ho/all-pond": {
    label: "Xem tất cả hồ",
    icon: <IconPool className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-ca-va-ho/all-koi": {
    label: "Xem tất cả cá",
    icon: <IconListDetails className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-ca-va-ho/create-pond": {
    label: "Tạo hồ",
    icon: <IconWaterpolo className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-ca-va-ho/create-koi": {
    label: "Tạo cá",
    icon: <IconFish className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-menh-tuong-thich": {
    label: "Quản lý mệnh tương thích",
    icon: <IconPackages className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-menh-tuong-thich/all-pond": {
    label: "Mệnh tương thích với Hồ",
    icon: <IconPool className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-menh-tuong-thich/all-zodiac-koi": {
    label: "Mệnh tương thích với Cá",
    icon: <IconListDetails className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-menh-tuong-thich/create-pond": {
    label: "Tạo tương thích với Hồ",
    icon: <IconWaterpolo className="mr-2 h-4 w-4" />
  },
  "/admin/quan-li-menh-tuong-thich/create-koi": {
    label: "Tạo tương thích với Cá",
    icon: <IconFish className="mr-2 h-4 w-4" />
  }
}

const Breadcrumb = () => {
  const location = useLocation()

  const pathSegments = location.pathname.split("/").filter(Boolean)

  const paths = pathSegments.reduce((acc: string[], _segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`
    acc.push(path)
    return acc
  }, [])

  return (
    <ol className="mb-3 flex items-center justify-start space-x-2 whitespace-nowrap">
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1

        if (path.startsWith("/admin/goi-quang-cao/edit")) {
          path = "/admin/goi-quang-cao/edit"
        }

        const breadcrumb = breadcrumbMap[path]

        if (!breadcrumb) {
          return null
        }
        return (
          <li key={path} className="inline-flex items-center">
            {!isLast ? (
              <Link
                to={path}
                className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500"
              >
                {breadcrumbMap[path].icon}
                {breadcrumbMap[path].label}
              </Link>
            ) : (
              <span className="flex items-center text-sm font-semibold text-gray-800 dark:text-neutral-200">
                {breadcrumb.icon}
                {breadcrumb.label}
              </span>
            )}
            {!isLast && <MdKeyboardArrowRight />}
          </li>
        )
      })}
    </ol>
  )
}

export default Breadcrumb
