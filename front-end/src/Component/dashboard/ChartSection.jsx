import React from "react";
import CLOChart from "./charts/CLOChart";
import PLOCharts from "./charts/PLOChart";

function ChartSection({
  courseList,
  courseData,
  studentPLOData,
  selectedCourse,
  onCourseChange,
}) {
  return (
    <div className="row mb-4">
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="courseSelect" className="form-label">
                เลือกรายวิชา:
              </label>
              <select
                id="courseSelect"
                className="form-select"
                value={selectedCourse}
                onChange={(e) => onCourseChange(e.target.value)}>
                {courseList.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <CLOChart courseData={courseData} selectedCourse={selectedCourse} />
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-body">
            <PLOCharts studentPLOData={studentPLOData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartSection;
