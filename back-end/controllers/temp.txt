// --------** Query สำหรับดู PLOทั้งหมด รายคน **----------------
// WITH student_clo_score AS (
//     SELECT 
//         astu.student_id,
//         ac.clo_id,
//         SUM((ag.score / a.total_score) * ac.weight * a.total_score) AS clo_score
//     FROM 
//         assignments a
//     JOIN assignment_clo ac ON a.assignment_id = ac.assignment_id
//     JOIN assignment_student astu ON a.assignment_id = astu.assignment_id
//     JOIN assignment_grade ag ON ag.assignment_student_id = astu.id
//     WHERE 
//         astu.student_id = '56610537'  -- <<< เปลี่ยนเป็นรหัสนักเรียน
//     GROUP BY 
//         astu.student_id, ac.clo_id
// )

// SELECT 
//     p.PLO_id,
//     SUM(sc.clo_score * (p.weight / 100)) AS plo_score
// FROM 
//     student_clo_score sc
// JOIN 
//     plo_clo p ON sc.clo_id = p.CLO_id
// WHERE 
//     p.year = 2025  -- <<< ปีการศึกษา (กำหนดตามข้อมูลจริง)
// GROUP BY 
//     p.PLO_id
// ORDER BY 
//     p.PLO_id;


// --------** Query สำหรับดู CLOทั้งหมด รายคน **----------------
// SELECT 
//     astu.student_id,
//     ac.clo_id,
//     SUM((ag.score / a.total_score) * ac.weight * a.total_score) AS total_score_clo
// FROM 
//     assignments a
// JOIN 
//     assignment_clo ac ON a.assignment_id = ac.assignment_id
// JOIN 
//     assignment_student astu ON a.assignment_id = astu.assignment_id
// JOIN 
//     assignment_grade ag ON ag.assignment_student_id = astu.id
// WHERE 
//     astu.student_id = '50565600' -- <<< เปลี่ยนเป็นรหัสนักเรียนที่ต้องการ
// GROUP BY 
//     astu.student_id,
//     ac.clo_id
// ORDER BY 
//     ac.clo_id;


// --------** Query สำหรับดู ค่าเฉลี่ยPLOทั้งหมด รายคน **----------------
// SELECT
//     p.PLO_id,
//     p.PLO_name,
//     AVG(student_plo_score) AS avg_plo_score
// FROM
//     (
//         -- คำนวณคะแนนของนักเรียนแต่ละคนในแต่ละ PLO
//         SELECT
//             ag.assignment_student_id,
//             pc.PLO_id,
//             SUM(
//                 (ag.score / a.total_score) -- สัดส่วนคะแนนงานที่นักเรียนได้
//                 * ac.weight               -- น้ำหนัก CLO ต่อ assignment
//                 * pc.weight               -- น้ำหนัก CLO ต่อ PLO
//             ) AS student_plo_score
//         FROM assignment_grade ag
//         INNER JOIN assignment_student ast ON ag.assignment_student_id = ast.id
//         INNER JOIN assignments a ON ast.assignment_id = a.assignment_id
//         INNER JOIN assignment_clo ac ON a.assignment_id = ac.assignment_id
//         INNER JOIN plo_clo pc ON ac.clo_id = pc.CLO_id
//             AND pc.year = YEAR(CURDATE()) -- กรองปีตามต้องการ (แก้ได้)
//             -- AND pc.semester_id = ?       -- กรองเทอม (ถ้าต้องการ)
//             -- AND pc.course_id = ?         -- กรองรายวิชา (ถ้าต้องการ)
//             -- AND pc.section_id = ?        -- กรอง section (ถ้าต้องการ)
//         GROUP BY ag.assignment_student_id, pc.PLO_id
//     ) AS student_plo_scores
// INNER JOIN plo p ON student_plo_scores.PLO_id = p.PLO_id
// GROUP BY p.PLO_id, p.PLO_name
// ORDER BY p.PLO_id;


// --------** Query สำหรับดู CLO ของวิชาตามนักเรียน  คน รายคน **----------------
// SELECT
//     clo.CLO_id,
//     clo.CLO_code,
//     clo.CLO_name,
//     SUM(
  //         (ag.score / a.total_score) * ac.weight
  //     ) AS clo_score
  // FROM assignment_grade ag
  // JOIN assignment_student ast ON ag.assignment_student_id = ast.id
  // JOIN assignments a ON ast.assignment_id = a.assignment_id
  // JOIN assignment_clo ac ON a.assignment_id = ac.assignment_id
  // JOIN clo ON ac.clo_id = clo.CLO_id
  // JOIN program_course pc ON a.program_course_id = pc.program_course_id
  // WHERE ast.student_id = '50565600'
  //   AND pc.course_id = 3051234
  // GROUP BY clo.CLO_id, clo.CLO_code, clo.CLO_name
  // ORDER BY clo.CLO_id;
  

// --------** Query สำหรับดู CLO เฉลี่ย ของวิชาที่เลือก  คน รายคน **----------------
//   SELECT 
//     clo.CLO_id,
//     clo.CLO_code,
//     clo.CLO_name,
//     AVG(student_clo_score.total_clo_score) AS average_clo_score
// FROM (
//     SELECT
//         ast.student_id,
//         clo.CLO_id,
//         SUM((ag.score / a.total_score) * ac.weight) AS total_clo_score
//     FROM assignment_grade ag
//     JOIN assignment_student ast ON ag.assignment_student_id = ast.id
//     JOIN assignments a ON ast.assignment_id = a.assignment_id
//     JOIN assignment_clo ac ON a.assignment_id = ac.assignment_id
//     JOIN clo ON ac.clo_id = clo.CLO_id
//     JOIN program_course pc ON a.program_course_id = pc.program_course_id
//     WHERE pc.course_id = 305100
//     GROUP BY ast.student_id, clo.CLO_id
// ) AS student_clo_score
// JOIN clo ON student_clo_score.CLO_id = clo.CLO_id
// GROUP BY clo.CLO_id, clo.CLO_code, clo.CLO_name
// ORDER BY clo.CLO_id;
