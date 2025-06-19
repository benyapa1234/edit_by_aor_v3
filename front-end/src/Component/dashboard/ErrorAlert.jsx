import React from "react";

function ErrorAlert({ error, onRetry }) {
  return (
    <div className="container py-4">
      <div className="alert alert-danger text-center" role="alert">
        <h4 className="alert-heading">เกิดข้อผิดพลาด!</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={onRetry}>
          ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>
  );
}

export default ErrorAlert;
