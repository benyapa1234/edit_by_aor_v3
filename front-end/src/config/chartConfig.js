import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

// ลงทะเบียน Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

export const chartConfig = {
  // การตั้งค่าทั่วไปสำหรับกราฟ
  defaultColors: {
    success: "rgba(75, 192, 120, 0.8)",
    successBorder: "rgba(75, 192, 120, 1)",
    danger: "rgba(255, 99, 132, 0.8)",
    dangerBorder: "rgba(255, 99, 132, 1)",
    neutral: "rgba(220, 220, 220, 0.8)",
    neutralBorder: "rgba(220, 220, 220, 1)",
  },

  defaultOptions: {
    responsive: true,
    maintainAspectRatio: false,
  },
};
