import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import LoadingSpinner from "./LoadingSpinner";

function PostList({ favorites, onToggleFavorite }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // ⭐⭐ Sort

  async function fetchPosts() {
    // ⭐ โหลดใหม่ — แยกออกมาเพื่อเรียกได้ทั้งจาก useEffect และปุ่ม
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!res.ok) throw new Error("ดึงข้อมูลไม่สำเร็จ");
      const data = await res.json();
      setPosts(data.slice(0, 20));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort(
    (a, b) => (sortOrder === "desc" ? b.id - a.id : a.id - b.id), // กรณี "desc" = b.id - a.id โพสต์ใหม่กว่า ถ้าเท็จก็ a.id - b.id โพสต์เก่ากว่า
  );

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
          onClick={fetchPosts}
          style={{
            // ⭐ ปุ่มโหลดใหม่ — เรียก fetchPosts ตรงๆ
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

      <button
        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")} //ถ้ากดปุ่มและถ้าเป็น "desc" เปลี่ยนเป็น "asc" และกลับกัน
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
        {/*แสดงข้อความตามเงื่อนไข ถ้าจิรงให้แสดงใหม่สุด แต่ถ้าไม่แสดงเก่าสุด*/}
        {sortOrder === "desc" ? "🔽 ใหม่สุดก่อน" : "🔼 เก่าสุดก่อน"}
      </button>

      {sorted.length === 0 && (
        <p style={{ color: "#718096", textAlign: "center", padding: "2rem" }}>
          ไม่พบโพสต์ที่ค้นหา
        </p>
      )}

      {sorted.map(
        (
          post, //ขั้นตอนแรก จะวนลูป sorted แล้วส่งค่า post ไปยัง PostCard แล้ว render PostCard ทีละอัน โดยส่ง id, title, body ไปแสดงผล
        ) => (
          <PostCard
            key={post.id}
            post={post}
            isFavorite={favorites.includes(post.id)} //เช็คว่าโพสต์นั้นถูกใจอยู่ไหมด้วย ถ้ามีให้ส่ง true ถ้าไม่มีให้ส่ง false
            onToggleFavorite={() => onToggleFavorite(post.id)} //แต่ถ้ามี กดถูกใจก็ส่ง id กลับไปให้ App จัดการผ่าน
          />
        ),
      )}
    </div>
  );
}

export default PostList;
