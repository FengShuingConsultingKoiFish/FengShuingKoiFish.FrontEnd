import React from "react"

import {
  IconBan,
  IconCheck,
  IconClockHour2,
  IconFileText,
  IconHome,
  IconList,
  IconPackages,
  IconPhotoPlus,
  IconSquareRoundedPlus,
  IconTrash
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
  "/admin/goi-quang-cao/add-images/": {
    label: "Thêm hình ảnh cho gói quảng cáo",
    icon: <IconPhotoPlus className="mr-2 h-4 w-4" />
  },
  "/admin/goi-quang-cao/delete-images/": {
    label: "Xóa ảnh cho gói quảng cáo",
    icon: <IconTrash className="mr-2 h-4 w-4" />
  }
}

const Breadcrumb = () => {
  const location = useLocation()

  const pathSegments = location.pathname.split("/").filter(Boolean)

  const paths = pathSegments.reduce((acc: string[], segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`
    acc.push(path)
    return acc
  }, [])

  return (
    <ol className="mb-3 flex items-center justify-start space-x-2 whitespace-nowrap">
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1

        let basePath = path
        if (path.startsWith("/admin/goi-quang-cao/add-images")) {
          basePath = "/admin/goi-quang-cao/add-images"
        } else if (path.startsWith("/admin/goi-quang-cao/delete-images")) {
          basePath = "/admin/goi-quang-cao/delete-images"
        }

        const breadcrumb = breadcrumbMap[basePath]

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
                {breadcrumbMap[path].icon}
                {breadcrumbMap[path].label}
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
