import { ReactNode } from "react"

import { Link } from "react-router-dom"

interface ContainerProps {
  label: ReactNode
  link: string
}

const Item = ({ label, link }: ContainerProps) => {
  return (
    <Link to={link}>
      <div className="hidden cursor-pointer rounded-full px-4 py-3 text-sm font-semibold transition hover:bg-neutral-100 md:block">
        {label}
      </div>
    </Link>
  )
}

export default Item
