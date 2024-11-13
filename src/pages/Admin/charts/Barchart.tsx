/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react"

import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  revenueData: number[];
}

const BarChart: React.FC<BarChartProps> = ({revenueData}) => {
  const data: ChartData<"bar"> = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12"
    ],
    datasets: [
      {
        label: "Dữ liệu",
        data: revenueData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }
    ]
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Doanh thu theo tháng (VND)"
      }
    }
  }

  return (
    <div style={{ height: "400px" }}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default BarChart
