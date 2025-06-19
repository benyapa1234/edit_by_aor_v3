import React from "react";
import { Bar, Pie } from "react-chartjs-2";

function PLOCharts({ studentPLOData }) {
  // สร้างข้อมูลกราฟ PLO Coverage
  const getPLOCoverageChartData = () => {
    if (!studentPLOData.ploList || studentPLOData.ploList.length === 0)
      return null;

    const passed = studentPLOData.ploList.filter((plo) => plo.passed).length;
    const notPassed = studentPLOData.ploList.length - passed;

    return {
      labels: ["ผ่านแล้ว", "ยังไม่ผ่าน"],
      datasets: [
        {
          label: "สัดส่วน PLO",
          data: [passed, notPassed],
          backgroundColor: [
            "rgba(75, 192, 120, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
          borderColor: ["rgba(75, 192, 120, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    };
  };

  // สร้างข้อมูลกราฟ PLO Per Course
  const getPLOBarChartData = () => {
    if (!studentPLOData.ploList || studentPLOData.ploList.length === 0)
      return null;

    return {
      labels: studentPLOData.ploList.map((plo) => plo.plo_id),
      datasets: [
        {
          label: "เปอร์เซ็นต์ความสำเร็จ",
          data: studentPLOData.ploList.map((plo) => plo.percent),
          backgroundColor: studentPLOData.ploList.map((plo) =>
            plo.passed ? "rgba(75, 192, 120, 0.8)" : "rgba(255, 99, 132, 0.8)"
          ),
          borderColor: studentPLOData.ploList.map((plo) =>
            plo.passed ? "rgba(75, 192, 120, 1)" : "rgba(255, 99, 132, 1)"
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  const ploCoverageOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "bottom" },
      title: { display: true, text: "PLO Coverage", font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataset = context.dataset;
            const total = dataset.data.reduce((acc, data) => acc + data, 0);
            const currentValue = dataset.data[context.dataIndex];
            const percentage = Math.round((currentValue / total) * 100);
            return `${context.label}: ${currentValue} PLOs (${percentage}%)`;
          },
        },
      },
    },
  };

  const ploBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "PLO Achievement", font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw}% (${context.raw >= 70 ? "ผ่าน" : "ไม่ผ่าน"})`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "ร้อยละความสำเร็จ (%)" },
      },
      x: {
        title: { display: true, text: "Program Learning Outcomes" },
      },
    },
  };

  const coverageData = getPLOCoverageChartData();
  const barData = getPLOBarChartData();

  return (
    <div className="row">
      <div className="col-md-5">
        {coverageData ? (
          <Pie data={coverageData} options={ploCoverageOptions} />
        ) : (
          <div className="text-center text-muted">ไม่มีข้อมูล PLO Coverage</div>
        )}
      </div>
      <div className="col-md-7">
        {barData ? (
          <Bar data={barData} options={ploBarOptions} />
        ) : (
          <div className="text-center text-muted">
            ไม่มีข้อมูล PLO Achievement
          </div>
        )}
      </div>
    </div>
  );
}

export default PLOCharts;
