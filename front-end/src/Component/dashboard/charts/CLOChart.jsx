import React from "react";
import { Bar } from "react-chartjs-2";
import { chartConfig } from "../../../config/chartConfig";

function CLOChart({ courseData, selectedCourse }) {
  // สร้างข้อมูลกราฟ CLO ตามรายวิชาที่เลือก
  const getCLOChartData = () => {
    if (!selectedCourse || !courseData[selectedCourse]) return null;

    const cloList = courseData[selectedCourse];
    return {
      labels: cloList.map((clo) => clo.clo_id),
      datasets: [
        {
          label: "ผลสัมฤทธิ์ CLO (%)",
          data: cloList.map((clo) => clo.percent),
          backgroundColor: cloList.map((clo) =>
            clo.passed ? "rgba(75, 192, 120, 0.8)" : "rgba(255, 99, 132, 0.8)"
          ),
          borderColor: cloList.map((clo) =>
            clo.passed ? "rgba(75, 192, 120, 1)" : "rgba(255, 99, 132, 1)"
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  // ตัวเลือกสำหรับกราฟแท่ง CLO
  const cloChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "CLO Completion per Course",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw}% (${context.raw >= 50 ? "ผ่าน" : "ไม่ผ่าน"})`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "ร้อยละความสำเร็จ (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Course Learning Outcomes",
        },
      },
    },
  };

  const chartData = getCLOChartData();

  if (!chartData) {
    return (
      <div className="text-center text-muted">
        ไม่มีข้อมูล CLO สำหรับรายวิชานี้
      </div>
    );
  }

  return <Bar data={chartData} options={cloChartOptions} />;
}

export default CLOChart;
