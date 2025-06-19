// EditCourse.js
import React, { useState } from "react";

const EditCourse = ({
  courseList,
  editCourse,
  setEditCourse,
  updateCourse,
}) => {
  return (
    <div className="mb-4">
      <h4>Edit Course</h4>
      <div className="row">
        <div className="col-md-3">
          <select
            className="form-select mb-2"
            name="course_id"
            value={editCourse.course_id}
            onChange={(e) => {
              console.log(editCourse);
              setEditCourse({ ...editCourse, course_id: e.target.value });
            }}>
            <option value="">Select Course</option>
            {courseList && courseList.length > 0 ? (
              courseList.map((courseItem) => (
                <option key={courseItem.course_id} value={courseItem.course_id}>
                  {courseItem.course_id} - {courseItem.course_name}
                </option>
              ))
            ) : (
              <option value="">No courses available</option>
            )}
          </select>
        </div>
        <div className="col-md-3">
          <input
            className="form-control mb-2"
            placeholder="Course Name (Thai)"
            name="course_name"
            value={editCourse.course_name}
            onChange={(e) =>
              setEditCourse({ ...editCourse, course_name: e.target.value })
            }
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control mb-2"
            placeholder="Course Name (English)"
            name="course_engname"
            value={editCourse.course_engname}
            onChange={(e) =>
              setEditCourse({ ...editCourse, course_engname: e.target.value })
            }
          />
        </div>
        <div className="col-md-3">
          <button
            onClick={() => updateCourse(editCourse)}
            className="btn btn-warning">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
