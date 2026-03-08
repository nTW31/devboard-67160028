import { useState } from "react";
import PostCard from "./PostCard";

function PostList({ posts, favorites, onToggleFavorite }) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // กำหนด default เป็น desc = ใหม่สุด, asc = เดิมสุด

  // กรองโพสต์ตาม search
  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );
  const sorted = [...filtered].sort(
    (
      a,
      b, // จัดเรียงตาม id
    ) => (sortOrder === "desc" ? b.id - a.id : a.id - b.id), // กรณี "desc" = b.id - a.id โพสต์ใหม่กว่า ถ้าเท็จก็ a.id - b.id โพสต์เก่ากว่า
  );
  return (
    <div>
      <h2
        style={{
          color: "#2d3748",
          borderBottom: "2px solid #1e40af",
          paddingBottom: "0.5rem",
        }}
      >
        โพสต์ล่าสุด
      </h2>

      {/* Search Input */}
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
          marginBottom: "1rem",
          boxSizing: "border-box",
        }}
      />
      {/* เพิ่มปุ่ม Sort ตรงนี้ */}
      <button
        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")} //ถ้ากดปุ่มและถ้าเป็น "desc" เปลี่ยนเป็น "asc" และกลับกัน
        style={{
          //ตั้งค่าปุ่ม
          marginBottom: "1rem",
          padding: "0.4rem 1rem",
          border: "1px solid #cbd5e0",
          borderRadius: "6px",
          cursor: "pointer",
          background: "white",
          fontSize: "0.9rem",
          color: "#000000ff",
        }}
      >
        {/*แสดงข้อความตามเงื่อนไข ถ้าจิรงให้แสดงใหม่สุด แต่ถ้าไม่แสดงเก่าสุด*/}
        {sortOrder === "desc" ? "🔽 ใหม่สุดก่อน" : "🔼 เก่าสุดก่อน"}
      </button>

      {/* ถ้าไม่พบโพสต์ */}
      {filtered.length === 0 && (
        <p style={{ color: "#718096", textAlign: "center", padding: "2rem" }}>
          ไม่พบโพสต์ที่ค้นหา
        </p>
      )}

      {/* เปลี่ยนจาก filtered.map → sorted.map */}
      {sorted.map(
        (
          post, //ขั้นตอนแรก จะวนลูป sorted แล้วส่งค่า post ไปยัง PostCard แล้ว render PostCard ทีละอัน โดยส่ง id, title, body ไปแสดงผล
        ) => (
          <PostCard
            key={post.id}
            title={post.title}
            body={post.body}
            isFavorite={favorites.includes(post.id)} //เช็คว่าโพสต์นั้นถูกใจอยู่ไหมด้วย ถ้ามีให้ส่ง true ถ้าไม่มีให้ส่ง false
            onToggleFavorite={() => onToggleFavorite(post.id)} //แต่ถ้ามี กดถูกใจก็ส่ง id กลับไปให้ App จัดการผ่าน
          />
        ),
      )}
    </div>
  );
}

export default PostList;
