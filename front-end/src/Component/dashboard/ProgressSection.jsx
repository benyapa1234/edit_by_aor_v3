import React from "react";
import ProgressChart from "./charts/ProgressChart";
import PLOMatrix from "./PLOMatrix";

function ProgressSection({ studentPLOData, courseList }) {
  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card h-100">
          <div className="card-body text-center">
            <ProgressChart studentPLOData={studentPLOData} />
            <div className="mt-3">
              {studentPLOData.ploList && studentPLOData.ploList.length > 0 && (
                <>
                  <p className="mb-1">
                    <strong>จำนวน PLO ที่ผ่านแล้ว:</strong>{" "}
                    {studentPLOData.ploList.filter((plo) => plo.passed).length}/
                    {studentPLOData.ploList.length}
                  </p>
                  <p className="mb-1">
                    <strong>เกณฑ์การสำเร็จการศึกษา:</strong> ผ่านอย่างน้อย 70%
                    ของ PLO ทั้งหมด
                  </p>
                  <p
                    className={`alert ${
                      studentPLOData.ploList.filter((plo) => plo.passed)
                        .length >=
                      studentPLOData.ploList.length * 0.7
                        ? "alert-success"
                        : "alert-warning"
                    } mt-2 p-2`}>
                    {studentPLOData.ploList.filter((plo) => plo.passed)
                      .length >=
                    studentPLOData.ploList.length * 0.7
                      ? "ผ่านเกณฑ์การสำเร็จการศึกษาแล้ว"
                      : "ยังไม่ผ่านเกณฑ์การสำเร็จการศึกษา"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card h-100">
          <div className="card-body">
            <PLOMatrix
              studentPLOData={studentPLOData}
              courseList={courseList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressSection;
