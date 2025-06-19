import React from "react";

function StudentSelector({
  studentList,
  selectedStudent,
  onStudentChange,
  studentCourses,
}) {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6">
                <label htmlFor="studentSelect" className="form-label">
                  <strong>เลือกนักเรียน:</strong>
                </label>
                <select
                  id="studentSelect"
                  className="form-select"
                  value={selectedStudent}
                  onChange={(e) => onStudentChange(e.target.value)}>
                  <option value="">-- เลือกนักเรียน --</option>
                  {studentList.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.student_id} - {student.first_name}{" "}
                      {student.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                {selectedStudent && (
                  <div className="mt-3 mt-md-0">
                    <strong>รายวิชาที่ลงทะเบียน:</strong>
                    <div className="mt-1">
                      {studentCourses.length > 0 ? (
                        <span className="badge bg-info me-1">
                          {studentCourses.length} รายวิชา
                        </span>
                      ) : (
                        <span className="text-muted">
                          ไม่มีรายวิชาที่ลงทะเบียน
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSelector;
