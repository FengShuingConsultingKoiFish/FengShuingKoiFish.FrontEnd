interface TotalSectionProps {
  title: string
  icon: React.ReactNode
  data: string
}

const TotalSection: React.FC<TotalSectionProps> = ({ title, icon, data }) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        {icon}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">{data}</div>
      </div>
    </div>
  )
}

export default TotalSection;
