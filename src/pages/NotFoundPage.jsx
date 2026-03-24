// นำเข้า Link สำหรับสร้างลิงก์ที่เปลี่ยนหน้าโดยไม่ reload
import { Link } from "react-router-dom";

// หน้า 404 — แสดงเมื่อ URL ไม่ตรงกับ route ใดเลย (จับโดย path="*" ใน App.jsx)
function NotFoundPage() {
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "4rem auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* แสดงเลข 404 ขนาดใหญ่ */}
      <h1 style={{ fontSize: "5rem", margin: "0", color: "#1e40af" }}>404</h1>
      {/* ข้อความแจ้งผู้ใช้ */}
      <p
        style={{ fontSize: "1.2rem", color: "#718096", margin: "1rem 0 2rem" }}
      >
        ไม่พบหน้าที่คุณต้องการ
      </p>
      {/* ลิงก์กลับหน้าหลัก — ใช้ Link แทน <a> เพื่อไม่ให้ reload หน้า */}
      <Link
        to="/"
        style={{
          color: "#1e40af",
          textDecoration: "none",
          fontSize: "1rem",
        }}
      >
        ← กลับหน้าหลัก
      </Link>
    </div>
  );
}

export default NotFoundPage;
