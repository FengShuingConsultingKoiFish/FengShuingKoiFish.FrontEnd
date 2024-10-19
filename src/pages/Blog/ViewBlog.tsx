import React from "react"

import { ArticleReading } from "@/components/ui/blog/ArticleReading"

export const ViewBlog = () => {
  const data = [
    {
      title: "Giới thiệu",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            Hello Lorem ipsum is for people who are too lazy to write copy. But
            we are not. Here are some more example of beautiful designs I built.
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built. Lorem
            ipsum is for people who are too lazy to write copy. But we are not.
            Here are some more example of beautiful designs I built. Lorem ipsum
            is for people who are too lazy to write copy. But we are not. Here
            are some more example of beautiful designs I built. Lorem ipsum is
            for people who are too lazy to write copy. But we are not. Here are
            some more example of beautiful designs I built.
          </div>
        </div>
      )
    },
    {
      title: "Câu chuyện",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            I usually run out of copy, but when I see content this big, I try to
            integrate lorem ipsum.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built. Lorem
            ipsum is for people who are too lazy to write copy. But we are not.
            Here are some more example of beautiful designs I built. Lorem ipsum
            is for people who are too lazy to write copy. But we are not. Here
            are some more example of beautiful designs I built. Lorem ipsum is
            for people who are too lazy to write copy. But we are not. Here are
            some more example of beautiful designs I built. Lorem ipsum is for
            people who are too lazy to write copy. But we are not. Here are some
            more example of beautiful designs I built. Lorem ipsum is for people
            who are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built.
          </p>
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      )
    },
    {
      title: "Lời cảm ơn",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Deployed 5 new components on Aceternity today
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Card grid component
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Startup template Aceternity
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Random file upload lol
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Himesh Reshammiya Music CD
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 md:text-sm">
              ✅ Salman Bhai Fan Club registrations open
            </div>
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built. Lorem
            ipsum is for people who are too lazy to write copy. But we are not.
            Here are some more example of beautiful designs I built. Lorem ipsum
            is for people who are too lazy to write copy. But we are not. Here
            are some more example of beautiful designs I built. Lorem ipsum is
            for people who are too lazy to write copy. But we are not. Here are
            some more example of beautiful designs I built. Lorem ipsum is for
            people who are too lazy to write copy. But we are not. Here are some
            more example of beautiful designs I built. Lorem ipsum is for people
            who are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built. Lorem ipsum is for people who
            are too lazy to write copy. But we are not. Here are some more
            example of beautiful designs I built.
          </div>
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      )
    }
  ]
  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
        <h2 className="mb-4 max-w-4xl text-lg text-black md:text-4xl">
          Chào mừng bạn đến với blog của Steve
        </h2>
        <p className="max-w-sm text-sm text-black md:text-base">
          
        </p>
      </div>
      <ArticleReading data={data} />
    </div>
  )
}
