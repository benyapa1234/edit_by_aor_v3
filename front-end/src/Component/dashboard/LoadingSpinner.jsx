import React from "react";

function LoadingSpinner({ message = "กำลังโหลด..." }) {
  return (
    <div className="text-center p-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="mt-2">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
