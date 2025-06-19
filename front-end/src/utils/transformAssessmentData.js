// utils/transformAssessmentData.js

export function transformAssessmentData(rawData) {
  const { clo, plo } = rawData;

  // ดึงข้อมูลรายวิชาทั้งหมด
  const coursesMap = new Map();
  clo.forEach((item) => {
    if (!coursesMap.has(item.course_id)) {
      coursesMap.set(item.course_id, {
        id: item.course_id.toString(),
        name: item.course_name,
      });
    }
  });

  const courses = Array.from(coursesMap.values());

  // แปลงข้อมูล CLO ตามรายวิชา
  const courseCLOData = {};

  courses.forEach((course) => {
    const courseId = course.id;
    const courseCLOs = clo.filter(
      (item) =>
        item.course_id.toString() === courseId && item.record_type === "SUMMARY"
    );

    courseCLOData[courseId] = courseCLOs.map((item) => ({
      clo_id: item.CLO_code,
      name: item.CLO_name,
      percent: parseFloat(item.clo_score_percent),
      passed: item.clo_status === "PASS",
    }));
  });

  // แปลงข้อมูล PLO
  const ploSummaryData = plo.filter((item) => item.record_type === "SUMMARY");

  // รวมข้อมูล PLO ที่ซ้ำกัน (เดียวกันแต่ต่างวิชา)
  const ploMap = new Map();

  ploSummaryData.forEach((item) => {
    const ploCode = item.CLO_code; // ใช้ CLO_code เป็น PLO code
    const percent = parseFloat(item.clo_score_percent);
    const passed = item.clo_status === "PASS";

    if (ploMap.has(ploCode)) {
      // หาค่าเฉลี่ยถ้ามี PLO เดียวกันจากหลายวิชา
      const existing = ploMap.get(ploCode);
      const avgPercent = (existing.percent + percent) / 2;
      ploMap.set(ploCode, {
        plo_id: ploCode,
        name: item.CLO_name,
        percent: avgPercent,
        passed: avgPercent >= 70, // เกณฑ์ผ่าน 70%
      });
    } else {
      ploMap.set(ploCode, {
        plo_id: ploCode,
        name: item.CLO_name,
        percent: percent,
        passed: passed,
      });
    }
  });

  const ploData = Array.from(ploMap.values());

  // สร้าง PLO Matrix แยกตามรายวิชา
  const coursePLOMatrix = {};

  courses.forEach((course) => {
    const courseId = course.id;
    coursePLOMatrix[courseId] = {};

    const coursePLOs = plo.filter(
      (item) =>
        item.course_id.toString() === courseId && item.record_type === "SUMMARY"
    );

    coursePLOs.forEach((item) => {
      const ploCode = item.CLO_code;
      const percent = parseFloat(item.clo_score_percent);
      coursePLOMatrix[courseId][ploCode] = Math.round(percent);
    });
  });

  return {
    courses,
    courseCLOData,
    ploData,
    coursePLOMatrix,
  };
}
