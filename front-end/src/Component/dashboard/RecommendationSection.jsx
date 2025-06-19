import React from "react";

function RecommendationSection({ studentPLOData }) {
  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">คำแนะนำในการลงทะเบียนเรียน</h5>
          </div>
          <div className="card-body">
            {studentPLOData.ploList && studentPLOData.ploList.length > 0 ? (
              <>
                <p>
                  จากผลการวิเคราะห์ PLO ที่ยังไม่ผ่าน
                  ควรพัฒนาทักษะในด้านต่อไปนี้:
                </p>
                <ul>
                  {studentPLOData.ploList
                    .filter((plo) => !plo.passed)
                    .map((plo, index) => (
                      <li key={index}>
                        <strong>{plo.plo_id}:</strong> {plo.name} (
                        {plo.percent.toFixed(1)}%)
                      </li>
                    ))}
                </ul>
                {studentPLOData.ploList.filter((plo) => !plo.passed).length ===
                  0 && (
                  <p className="text-success">
                    <strong>ยินดีด้วย!</strong> คุณผ่าน PLO ทั้งหมดแล้ว
                  </p>
                )}
              </>
            ) : (
              <p>ไม่มีข้อมูลสำหรับการแนะนำ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendationSection;
