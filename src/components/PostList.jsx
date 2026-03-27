import { useState } from "react";
import PostCard from "./PostCard";
import LoadingSpinner from "./LoadingSpinner";
import useFetch from "./hooks/useFetch";

// ⭐ ระดับ 1 — PostCount Component
// รับ prop "count" จาก PostList (ค่าที่ส่งมาคือ posts.length = จำนวนโพสต์ทั้งหมด)
// เป็น Presentational Component = แสดงผลอย่างเดียว ไม่ส่งค่ากลับไปที่ไหน
function PostCount({ count }) {
  return (
    <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>
      โพสต์ทั้งหมด: <strong>{count}</strong> รายการ
    </p>
  );
}
function PostList() {
  // state สำหรับเก็บคำค้นหา (เริ่มต้น = "" คือยังไม่ได้พิมพ์อะไร)
  // เมื่อพิมพ์ในช่องค้นหา → setSearch อัปเดตค่า → component re-render → filter ทำงานใหม่
  const [search, setSearch] = useState("");
  // ⭐⭐ ระดับ 2 — Sort: state เก็บลำดับการเรียง ("desc" = ใหม่สุดก่อน, "asc" = เก่าสุดก่อน)
  const [sortOrder, setSortOrder] = useState("desc");

  // เรียก useFetch hook → ส่ง URL ไปดึงข้อมูลจาก API
  const {
    data: posts,
    loading,
    error,
    refetch,
  } = useFetch("https://jsonplaceholder.typicode.com/posts");

  // กรองโพสต์ → เอาเฉพาะตัวที่ title ตรงกับคำค้นหา (ไม่สนตัวพิมพ์เล็ก/ใหญ่)
  // ถ้า search = "" (ว่าง) → includes("") จะเป็น true ทุกตัว → แสดงทั้งหมด
  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );

  // ⭐⭐ ระดับ 2 — Sort: เรียงลำดับโพสต์ที่กรองแล้ว
  // [...filtered] = copy array ใหม่ (ไม่แก้ต้นฉบับ เพราะ .sort() จะแก้ array เดิม)
  // ถ้า "desc" → b.id - a.id = id มากสุดขึ้นก่อน (โพสต์ใหม่สุดก่อน)
  // ถ้า "asc" → a.id - b.id = id น้อยสุดขึ้นก่อน (โพสต์เก่าสุดก่อน)
  const sorted = [...filtered].sort((a, b) =>
    sortOrder === "desc" ? b.id - a.id : a.id - b.id,
  );

  // ถ้ายังโหลดอยู่ → แสดง LoadingSpinner แล้วจบ (ไม่ render อะไรอื่น)
  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <div
        style={{
          padding: "1.5rem",
          background: "#fff5f5",
          border: "1px solid #fc8181",
          borderRadius: "8px",
          color: "#c53030",
        }}
      >
        เกิดข้อผิดพลาด: {error}
      </div>
    );

  return (
    <div>
      <h2
        style={{
          color: "#2d3748",
          borderBottom: "2px solid #1e40af",
          paddingBottom: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        โพสต์ล่าสุด
        <button
          onClick={refetch}
          style={{
            color: "black",
            fontSize: "0.85rem",
            padding: "0.3rem 0.75rem",
            border: "1px solid #cbd5e0",
            borderRadius: "6px",
            cursor: "pointer",
            background: "white",
          }}
        >
          🔄 โหลดใหม่
        </button>
      </h2>

      <input
        type="text"
        placeholder="ค้นหาโพสต์..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          border: "1px solid #cbd5e0",
          borderRadius: "6px",
          fontSize: "1rem",
          marginBottom: "0.5rem",
          boxSizing: "border-box",
        }}
      />

      {/* ⭐⭐ ระดับ 2 — Sort: ปุ่มสลับลำดับ กดแล้วสลับ desc ↔ asc */}
      <button
        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
        style={{
          color: "black",
          marginBottom: "1rem",
          padding: "0.4rem 1rem",
          border: "1px solid #cbd5e0",
          borderRadius: "6px",
          cursor: "pointer",
          background: "white",
          fontSize: "0.9rem",
        }}
      >
        {/* ⭐⭐ ระดับ 2 — Sort: แสดงข้อความตาม sortOrder ปัจจุบัน */}
        {sortOrder === "desc" ? "🔽 ใหม่สุดก่อน" : "🔼 เก่าสุดก่อน"}
      </button>
      <PostCount count={posts.length} />
      {sorted.length === 0 && (
        <p style={{ color: "#718096", textAlign: "center", padding: "2rem" }}>
          ไม่พบโพสต์ที่ค้นหา
        </p>
      )}

      {sorted.map(
        (
          post, //ขั้นตอนแรก จะวนลูป sorted แล้วส่งค่า post ไปยัง PostCard แล้ว render PostCard ทีละอัน โดยส่ง id, title, body ไปแสดงผล
        ) => (
          <PostCard key={post.id} post={post} />
        ),
      )}
    </div>
  );
}
export default PostList;
