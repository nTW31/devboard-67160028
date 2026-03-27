import { createContext, useContext, useState, useEffect } from "react";

// 1. สร้าง context object
const FavoritesContext = createContext();

// 2. Provider component — ครอบ App ทั้งหมด
export function FavoritesProvider({ children }) {
  // ⭐⭐⭐ ระดับ 3 — Favorites คงอยู่หลัง Refresh
  // อ่านค่าเริ่มต้นจาก localStorage (ถ้ามี) แทนที่จะเริ่มจาก [] ทุกครั้ง
  // JSON.parse แปลง string กลับเป็น array
  // ถ้ายังไม่เคยบันทึก (null) → ใช้ '[]' เป็นค่าเริ่มต้น
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]"),
  );

  // ⭐⭐⭐ ระดับ 3 — ทุกครั้งที่ favorites เปลี่ยน → บันทึกลง localStorage ทันที
  // JSON.stringify แปลง array เป็น string เพราะ localStorage เก็บได้แค่ string
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(postId) {
    setFavorites((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId],
    );
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// 3. Custom hook สำหรับใช้งาน context ง่าย ๆ
export function useFavorites() {
  return useContext(FavoritesContext);
}
