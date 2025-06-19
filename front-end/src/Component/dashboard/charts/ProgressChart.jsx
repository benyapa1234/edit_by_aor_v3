import React from "react";
import { Doughnut } from "react-chartjs-2";

function ProgressChart({ studentPLOData }) {
  // สร้างข้อมูลกราฟ Progress to Graduation
  const getProgressToGraduationData = () => {
    if (!studentPLOData.ploList || studentPLOData.ploList.length === 0)
      return null;

    const passedPLOs = studentPLOData.ploList.filter(
      (plo) => plo.passed
    ).length;
    const totalPLOs = studentPLOData.ploList.length;
    const percentComplete = Math.round((passedPLOs / totalPLOs) * 100);
    const percentRemaining = 100 - percentComplete;

    return {
      labels: [`ผ่านแล้ว ${percentComplete}%`, `ยังเหลือ ${percentRemaining}%`],
      datasets: [
        {
          label: "ความก้าวหน้าในการสำเร็จการศึกษา",
          data: [percentComplete, percentRemaining],
          backgroundColor: [
            "rgba(75, 192, 120, 0.8)",
            "rgba(220, 220, 220, 0.8)",
          ],
          borderColor: ["rgba(75, 192, 120, 1)", "rgba(220, 220, 220, 1)"],
          borderWidth: 1,
          cutout: "70%",
        },
      ],
    };
  };

  const progressOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "bottom" },
      title: {
        display: true,
        text: "Progress to Graduation",
        font: { size: 16 },
      },
    },
  };

  if (!studentPLOData.ploList || studentPLOData.ploList.length === 0)
    return null;

  const passedPLOs = studentPLOData.ploList.filter((plo) => plo.passed).length;
  const totalPLOs = studentPLOData.ploList.length;
  const percentComplete = Math.round((passedPLOs / totalPLOs) * 100);

  return (
    <div className="donut-container position-relative">
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <h2 style={{ fontSize: "24px", margin: 0 }}>{percentComplete}%</h2>
        <p style={{ fontSize: "14px", margin: 0 }}>
          ({passedPLOs}/{totalPLOs} PLOs)
        </p>
      </div>
      <Doughnut
        data={getProgressToGraduationData()}
        options={progressOptions}
      />
    </div>
  );
}

export default ProgressChart;
