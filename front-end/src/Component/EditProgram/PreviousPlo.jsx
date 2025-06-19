export default function PreviousPLOs({ onClickFunc }) {
  // test
  return (
    <>
      <p>ไม่พบข้อมูล PLO จากปีการศึกษาก่อนหน้า</p>
      <button
        onClick={() => onClickFunc(false)}
        className="btn btn-secondary"
        style={{ width: "100%" }}>
        ปิด
      </button>
    </>
  );
}
