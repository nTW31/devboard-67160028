import { useState } from "react";
import Navbar from "./components/Navbar";
import PostList from "./components/PostList";
import UserList from "./components/UserList";
import AddPostForm from "./components/AddPostForm";

function App() {
  // ลบ posts ออก เพราะ Task3 posts อยู่ใน PostList แล้ว
  const [favorites, setFavorites] = useState(
    // อ่านค่าจาก localStorage ถ้าไม่มีให้ใช้ [] แทน แล้วแปลง string กลับเป็น array
    JSON.parse(localStorage.getItem("favorites") || "[]"),
  );

  function handleToggleFavorite(postId) {
    // ลบ setFavorites อันเก่าออก เหลือแค่อันที่มี localStorage
    setFavorites((prev) => {
      const updated = prev.includes(postId) // เก็บผลลัพธ์ใหม่ไว้ใน updated ก่อน
        ? prev.filter((id) => id !== postId) // เอาออก
        : [...prev, postId]; // เพิ่มเข้า
      localStorage.setItem("favorites", JSON.stringify(updated)); // บันทึกลง localStorage ทันที
      return updated;
    });
  }

  return (
    <div>
      <Navbar favoriteCount={favorites.length} />
      <div
        style={{
          maxWidth: "900px",
          margin: "2rem auto",
          padding: "0 1rem",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
        }}
      >
        <div>
          <AddPostForm onAddPost={() => {}} />
          <PostList
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
        <div>
          <UserList />
        </div>
      </div>
    </div>
  );
}

export default App;
