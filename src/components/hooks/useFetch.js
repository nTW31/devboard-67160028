// นำเข้า Hook 3 ตัวจาก React:
// useState = สร้างตัวแปรที่เปลี่ยนค่าได้ (state)
// useEffect = สั่งทำอะไรบางอย่างหลัง render (เช่น ดึงข้อมูล)
// useCallback = จำฟังก์ชันไว้ ไม่ต้องสร้างใหม่ทุกรอบ render
import { useState, useEffect, useCallback } from "react";

// Custom Hook สำหรับดึงข้อมูลจาก API
// รับ url เป็น parameter เช่น "https://jsonplaceholder.typicode.com/posts"
function useFetch(url) {
  const [data, setData] = useState([]); // ข้อมูลจาก API (เริ่มต้น = array ว่าง)
  const [loading, setLoading] = useState(true); // สถานะกำลังโหลด (เริ่มต้น = true เพราะยังไม่ได้ข้อมูล)
  const [error, setError] = useState(null); // ข้อผิดพลาด (เริ่มต้น = null คือยังไม่มี error)

  // ใช้ useCallback ห่อฟังก์ชัน → ฟังก์ชันจะถูกสร้างครั้งเดียว
  // และสร้างใหม่เฉพาะเมื่อ url เปลี่ยนเท่านั้น (ดูจาก dependency [url])
  const fetchData = useCallback(async () => {
    try {
      setLoading(true); // บอกว่า "กำลังโหลด"
      setError(null); // ล้าง error เก่าออก
      const res = await fetch(url); // ยิง HTTP request ไป API แล้วรอ response กลับมา
      if (!res.ok) throw new Error("ดึงข้อมูลไม่สำเร็จ"); // ถ้า status ไม่ใช่ 200 → โยน error
      const json = await res.json(); // แปลง response เป็น JSON

      // ถ้า url มีคำว่า "posts" → เก็บแค่ 20 รายการแรก / ถ้าไม่ใช่ → เก็บทั้งหมด
      setData(url.includes("posts") ? json.slice(0, 20) : json);
    } catch (err) {
      setError(err.message); // ถ้า fetch ล้มเหลว → เก็บข้อความ error ไว้ใน state
    } finally {
      setLoading(false); // ไม่ว่าสำเร็จหรือล้มเหลว → ปิดสถานะโหลด
    }
  }, [url]); // dependency: สร้างฟังก์ชันใหม่เมื่อ url เปลี่ยน

  // useEffect → เรียก fetchData() อัตโนมัติตอน component mount ครั้งแรก
  // ถ้า fetchData เปลี่ยน (= url เปลี่ยน) ก็จะเรียกดึงข้อมูลใหม่อีกครั้ง
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ส่งค่ากลับ 4 ตัว ให้ component ที่เรียกใช้ (เช่น PostList):
  // data = ข้อมูลจาก API → PostList เอาไปแสดงรายการโพสต์
  // loading = สถานะโหลด → PostList เอาไปโชว์ LoadingSpinner
  // error = ข้อผิดพลาด → PostList เอาไปโชว์กล่องแจ้ง error
  // refetch = ฟังก์ชัน fetchData → ผูกกับปุ่ม "🔄 โหลดใหม่" กดแล้วดึงข้อมูลซ้ำ
  return { data, loading, error, refetch: fetchData };
}

export default useFetch;
