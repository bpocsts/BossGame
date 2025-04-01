import React, { createContext, useContext, useEffect, useState } from "react";
import '../style/UserAuthContext.css'; // นำเข้า CSS สำหรับการจัดรูปแบบ
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getAuth
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Storage methods
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Firestore methods
import { auth } from "../fierbase"; // ตรวจสอบ Firebase instance

const UserAuthContext = createContext();
const db = getFirestore(); // เชื่อมต่อ Firestore
const storage = getStorage(); // เชื่อมต่อ Firebase Storage


export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null); // State สำหรับผู้ใช้ที่ล็อกอิน
  const [userData, setUserData] = useState(null); // State สำหรับข้อมูลเพิ่มเติมของผู้ใช้
  const [loading, setLoading] = useState(true); // สถานะ Loading
  const [error, setError] = useState(""); // State สำหรับข้อความข้อผิดพลาด

  

  // ฟังก์ชันสำหรับล็อกอิน
  async function logIn(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      console.error("Error during login:", err.message);
      setError(err.message);
    }
  }

  // ฟังก์ชันสำหรับสมัครสมาชิก
  async function signUp(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // สร้างเอกสารใน Firestore
      await setDoc(doc(db, "users", uid), {
        email: email,
        username: username, // เก็บ username
      });
      console.log("User created and data saved to Firestore!");
      setError("");
    } catch (err) {
      console.error("Error during sign up:", err.message);
      setError(err.message);
    }
  }

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก Firestore
  async function fetchUserData(uid) {
    try {
      const userDocRef = doc(db, "users", uid); // อ้างอิงเอกสาร
      const userDocSnap = await getDoc(userDocRef); // ดึงข้อมูลจาก Firestore

      if (userDocSnap.exists()) {
        console.log("User Data:", userDocSnap.data());
        setUserData(userDocSnap.data()); // อัปเดตข้อมูลใน State
      } else {
        console.error("No such document!");
        setUserData(null); // รีเซ็ต State หากไม่พบเอกสาร
      }
    } catch (err) {
      console.error("Error fetching user data:", err.message);
      setError(err.message);
      setUserData(null); // รีเซ็ต State หากเกิดข้อผิดพลาด
    }
  }

  // ฟังก์ชันสำหรับล็อกเอาท์
  async function logOut() {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null); // รีเซ็ตข้อมูลผู้ใช้
      setError("");
    } catch (err) {
      console.error("Error during logout:", err.message);
      setError(err.message);
    }
  }

  // ตั้งค่าการติดตามสถานะการล็อกอิน
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid); // ดึงข้อมูลเพิ่มเติมจาก Firestore
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false); // หยุด Loading
    });

    return () => unsubscribe(); // ล้าง Listener
  }, []);

  if (loading) {
    return <div className="loader-container">
    <div className="loader">
      <svg viewBox="0 0 80 80">
        <circle r="32" cy="40" cx="40" id="test"></circle>
      </svg>
    </div>
    
    <div className="loader triangle">
      <svg viewBox="0 0 86 80">
        <polygon points="43 8 79 72 7 72"></polygon>
      </svg>
    </div>
    
    <div className="loader">
      <svg viewBox="0 0 80 80">
        <rect height="64" width="64" y="8" x="8"></rect>
      </svg>
    </div>
    </div>; // แสดงสถานะ Loading
  }

  return (
    <UserAuthContext.Provider
  value={{
    user,
    userData,
    logIn,
    signUp,
    logOut,
    error,
     // ส่งฟังก์ชันนี้ใน Context
  }}
>
  {children}
</UserAuthContext.Provider>

  );
}

// Custom hook สำหรับการใช้งาน Context
export function useUserAuth() {
  return useContext(UserAuthContext);
}