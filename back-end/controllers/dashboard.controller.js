import pool from "../utils/db.js";

export async function getStudentCLOReport(req, res) {
  const { student_id } = req.params;

  try {
    const query = `
    WITH assignment_details AS (
      SELECT
        s.student_id,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        c.course_id,
        c.course_name,
        a.assignment_id,
        a.assignment_name,
        a.total_score,
        ag.score AS student_score,
        ac.clo_id,
        clo.CLO_code,
        clo.CLO_name,
        ac.weight AS clo_weight,
        (ag.score / a.total_score) * ac.weight AS clo_contribution_score
      FROM student s
      JOIN assignment_student ast ON s.student_id = ast.student_id
      JOIN assignment_grade ag ON ag.assignment_student_id = ast.id
      JOIN assignments a ON ast.assignment_id = a.assignment_id
      JOIN program_course pc ON a.program_course_id = pc.program_course_id
      JOIN course c ON pc.course_id = c.course_id
      JOIN assignment_clo ac ON a.assignment_id = ac.assignment_id
      JOIN clo ON ac.clo_id = clo.CLO_id
      WHERE s.student_id = ?
    ),

    clo_summary AS (
      SELECT
        student_id,
        course_id,
        course_name,
        clo_id,
        CLO_code,
        CLO_name,
        SUM(clo_contribution_score) AS clo_score,
        SUM(clo_weight) AS total_weight,
        (SUM(clo_contribution_score) / SUM(clo_weight)) * 100 AS clo_score_percent,
        CASE 
          WHEN (SUM(clo_contribution_score) / SUM(clo_weight)) * 100 >= 50 THEN 'PASS'
          ELSE 'FAIL'
        END AS clo_status
      FROM assignment_details
      GROUP BY student_id, course_id, clo_id
    )

    -- รวมทั้งรายละเอียด Assignment และสรุป CLO
    SELECT
      'DETAIL' AS record_type,
      ad.student_id,
      ad.student_name,
      ad.course_id,
      ad.course_name,
      ad.assignment_id,
      ad.assignment_name,
      ad.total_score,
      ad.student_score,
      ad.clo_id,
      ad.CLO_code,
      ad.CLO_name,
      ad.clo_weight,
      ad.clo_contribution_score,
      NULL AS clo_score,
      NULL AS clo_score_percent,
      NULL AS clo_status
    FROM assignment_details ad

    UNION ALL

    SELECT
      'SUMMARY' AS record_type,
      cs.student_id,
      NULL AS student_name,
      cs.course_id,
      cs.course_name,
      NULL AS assignment_id,
      NULL AS assignment_name,
      NULL AS total_score,
      NULL AS student_score,
      cs.clo_id,
      cs.CLO_code,
      cs.CLO_name,
      NULL AS clo_weight,
      NULL AS clo_contribution_score,
      cs.clo_score,
      cs.clo_score_percent,
      cs.clo_status
    FROM clo_summary cs

    ORDER BY course_id, record_type DESC, clo_id, assignment_id;
  `;

    const query_plo = `WITH assignment_details AS (
      SELECT
        s.student_id,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        a.assignment_id,
        a.total_score,
        ag.score AS student_score,
        ac.clo_id,
        clo.CLO_code,
        ac.weight AS clo_weight,
        (ag.score / a.total_score) * ac.weight AS clo_contribution_score
      FROM student s
      JOIN assignment_student ast ON s.student_id = ast.student_id
      JOIN assignment_grade ag ON ag.assignment_student_id = ast.id
      JOIN assignments a ON ast.assignment_id = a.assignment_id
      JOIN assignment_clo ac ON a.assignment_id = ac.assignment_id
      JOIN clo ON ac.clo_id = clo.CLO_id
      WHERE s.student_id = ?
    ),

    clo_summary AS (
      SELECT
        student_id,
        clo_id,
        SUM(clo_contribution_score) AS clo_score,
        SUM(clo_weight) AS total_weight,
        (SUM(clo_contribution_score) / SUM(clo_weight)) AS clo_score_ratio
      FROM assignment_details
      GROUP BY student_id, clo_id
    ),

    plo_summary AS (
      SELECT
        cs.student_id,
        p.PLO_id,
        p.PLO_code,
        p.PLO_name,
        SUM(cs.clo_score_ratio * pc.weight) / SUM(pc.weight) AS plo_score_ratio,
        (SUM(cs.clo_score_ratio * pc.weight) / SUM(pc.weight)) * 100 AS plo_score_percent,
        CASE
          WHEN (SUM(cs.clo_score_ratio * pc.weight) / SUM(pc.weight)) * 100 >= 50 THEN 'PASS'
          ELSE 'FAIL'
        END AS plo_status
      FROM clo_summary cs
      JOIN plo_clo pc ON cs.clo_id = pc.CLO_id
      JOIN plo p ON pc.PLO_id = p.PLO_id
      GROUP BY cs.student_id, p.PLO_id
    )

    SELECT
      student_id,
      PLO_id,
      PLO_code,
      PLO_name,
      plo_score_percent,
      plo_status
    FROM plo_summary
    ORDER BY PLO_id;
    `;

    const clo = await pool.query(query, [student_id]);

    const plo = await pool.query(query, [student_id]);

    res.status(200).json({ clo, plo });
  } catch (error) {
    res.status(500).json({
      message: "Failed while get student CLO Report",
      error: error.message,
    });
  }
}

export async function getAvgReport(req, res) {
  const { program_id } = req.params;

  const query_clo = `WITH assignment_details AS (
    SELECT
      c.course_id,
      c.course_name,
      clo.CLO_id,
      clo.CLO_code,
      ac.weight AS clo_weight,
      a.total_score,
      ag.score,
      (ag.score / a.total_score) * ac.weight AS clo_contribution_score,
      pc.program_id
    FROM clo
    JOIN assignment_clo ac ON clo.CLO_id = ac.clo_id
    JOIN assignments a ON ac.assignment_id = a.assignment_id
    JOIN program_course pc ON a.program_course_id = pc.program_course_id
    JOIN course c ON pc.course_id = c.course_id
    LEFT JOIN assignment_student ast ON ast.assignment_id = a.assignment_id
    LEFT JOIN assignment_grade ag ON ag.assignment_student_id = ast.id
    WHERE pc.program_id = ?
  ),

  clo_summary AS (
    SELECT
      course_id,
      course_name,
      CLO_id,
      CLO_code,
      SUM(clo_contribution_score) AS total_score,
      SUM(clo_weight) AS total_weight,
      (SUM(clo_contribution_score) / SUM(clo_weight)) * 100 AS avg_clo_score_percent
    FROM assignment_details
    GROUP BY course_id, CLO_id, CLO_code, course_name
  )

  SELECT
    course_id,
    course_name,
    CLO_id,
    CLO_code,
    ROUND(avg_clo_score_percent, 2) AS avg_clo_score_percent
  FROM clo_summary
  ORDER BY course_id, CLO_id;
      `;
  const query_plo = `WITH assignment_details AS (
      SELECT
        c.course_id,
        c.course_name,
        clo.CLO_id,
        clo.CLO_code,
        ac.weight AS clo_weight,
        a.total_score,
        ag.score,
        (ag.score / a.total_score) * ac.weight AS clo_contribution_score,
        pc.program_id
      FROM clo
      JOIN assignment_clo ac ON clo.CLO_id = ac.clo_id
      JOIN assignments a ON ac.assignment_id = a.assignment_id
      JOIN program_course pc ON a.program_course_id = pc.program_course_id
      JOIN course c ON pc.course_id = c.course_id
      LEFT JOIN assignment_student ast ON ast.assignment_id = a.assignment_id
      LEFT JOIN assignment_grade ag ON ag.assignment_student_id = ast.id
      WHERE pc.program_id = ?
    ),

    clo_summary AS (
      SELECT
        course_id,
        CLO_id,
        SUM(clo_contribution_score) AS total_score,
        SUM(clo_weight) AS total_weight,
        (SUM(clo_contribution_score) / SUM(clo_weight)) AS clo_score_ratio
      FROM assignment_details
      GROUP BY course_id, CLO_id
    ),

    plo_mapping AS (
      SELECT
        pc.course_id,
        p.PLO_id,
        p.PLO_code,
        clo.CLO_id,
        pm.weight
      FROM plo p
      JOIN plo_clo pm ON p.PLO_id = pm.PLO_id
      JOIN clo ON clo.CLO_id = pm.CLO_id
      JOIN program_course pc ON pm.course_id = pc.course_id
      WHERE pc.program_id = ?
    ),

    plo_summary AS (
      SELECT
        pm.PLO_id,
        pm.PLO_code,
        SUM(cs.clo_score_ratio * pm.weight) AS weighted_score,
        SUM(pm.weight) AS total_weight,
        (SUM(cs.clo_score_ratio * pm.weight) / SUM(pm.weight)) * 100 AS avg_plo_score_percent
      FROM plo_mapping pm
      LEFT JOIN clo_summary cs ON pm.course_id = cs.course_id AND pm.CLO_id = cs.CLO_id
      GROUP BY pm.PLO_id, pm.PLO_code
    )

    SELECT
      PLO_id,
      PLO_code,
      ROUND(avg_plo_score_percent, 2) AS avg_plo_score_percent
    FROM plo_summary
    ORDER BY PLO_id;

    `;

  try {
    const clo = await pool.query(query_clo, [program_id]);

    const plo = await pool.query(query_plo, [program_id, program_id]);
    res.status(200).json({ clo, plo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetch report", error: error.message });
  }
}
