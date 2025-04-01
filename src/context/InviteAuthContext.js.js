import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { auth } from "../fierbase"; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง
import { onAuthStateChanged } from "firebase/auth";

const db = getFirestore(); // Firestore instance

const InviteContext = createContext();

export const InviteProvider = ({ children }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userInput, setUserInput] = useState("");

  // ✅ สร้างโค้ดเชิญใหม่หรือใช้โค้ดที่มีอยู่
  const generateInviteCode = async () => {
    setIsLoading(true);
    if (!auth.currentUser) {
      setErrorMessage("กรุณาเข้าสู่ระบบก่อนสร้างโค้ดเชิญ");
      setIsLoading(false);
      return;
    }

    try {
      const refCode = auth.currentUser.uid; // ใช้ UID เป็นโค้ดเชิญ
      const existingInvitesQuery = query(
        collection(db, "invites"),
        where("userId", "==", refCode)
      );

      const existingInvitesSnapshot = await getDocs(existingInvitesQuery);

      if (!existingInvitesSnapshot.empty) {
        setInviteCode(refCode); // ใช้โค้ดเดิม
      } else {
        await setDoc(doc(db, "invites", refCode), {
          userId: refCode,
          inviteCode: refCode,
          createdAt: new Date(),
          usageCount: 0,
          usedBy: [],
        });
        setInviteCode(refCode);
      }
    } catch (error) {
      setErrorMessage("ไม่สามารถสร้างโค้ดเชิญได้");
      console.error("เกิดข้อผิดพลาดในการสร้างโค้ด:", error);
    }
    setIsLoading(false);
  };

  // ✅ ดึงจำนวนการใช้งานโค้ดเชิญแบบเรียลไทม์
  const getInviteUsage = () => {
    if (!inviteCode) return;
    
    const docRef = doc(db, "invites", inviteCode);
    
    // ใช้ onSnapshot เพื่อรับข้อมูลแบบเรียลไทม์
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("🔥 Firestore data (real-time):", docSnap.data()); // ✅ ตรวจสอบข้อมูลจาก Firestore
        setUsageCount(docSnap.data().usageCount || 0);
      } else {
        console.log("❌ Document ไม่พบใน Firestore");
      }
    });

    // Clean up เมื่อ component unmount หรือค่า inviteCode เปลี่ยน
    return unsubscribe;
  };

  // ✅ เช็คโค้ดเชิญและเพิ่มจำนวนการใช้งาน
  const checkInviteCode = async (userInput) => {
    if (!auth.currentUser) {
      console.error("auth.currentUser ไม่มีค่า");
      setMessage("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
  
    if (!userInput) {
      console.error("userInput เป็น undefined หรือว่าง");
      setMessage("โปรดกรอกโค้ดเชิญก่อน");
      return;
    }
  
    console.log("กำลังตรวจสอบโค้ด:", userInput);
  
    try {
      const invitesQuery = query(
        collection(db, "invites"),
        where("inviteCode", "==", userInput)
      );
  
      // ใช้ onSnapshot เพื่อฟังการเปลี่ยนแปลงของ collection นี้
      const unsubscribe = onSnapshot(invitesQuery, (snapshot) => {
        if (!snapshot.empty) {
          const inviteDoc = snapshot.docs[0];
          const inviteData = inviteDoc.data();
  
          // อัปเดต Firestore: เพิ่มจำนวนการใช้งาน
          updateDoc(inviteDoc.ref, {
            usageCount: (inviteData.usageCount || 0) + 1,
            usedBy: [...(inviteData.usedBy || []), auth.currentUser.uid],
          });
  
          console.log("โค้ดถูกต้อง:", userInput);
          setMessage("โค้ดเชิญถูกต้อง!");
        } else {
          console.error("โค้ดเชิญไม่ถูกต้อง");
          setMessage("โค้ดเชิญไม่ถูกต้อง!");
        }
  
        setTimeout(() => setMessage(""), 5000);
      });
  
      // Clean up เมื่อไม่ต้องการฟังต่อ
      return unsubscribe;
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error.message);
      setMessage("เกิดข้อผิดพลาดในการตรวจสอบโค้ด");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      generateInviteCode();
    }
  }, []);

  useEffect(() => {
    if (inviteCode) {
      console.log("📌 ดึงข้อมูล usageCount สำหรับ inviteCode:", inviteCode);
      const unsubscribe = getInviteUsage();
      
      // Return unsubscribe function to clean up when inviteCode changes
      return () => unsubscribe();
    }
  }, [inviteCode]);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        generateInviteCode();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <InviteContext.Provider value={{ inviteCode, usageCount, generateInviteCode, getInviteUsage, checkInviteCode, isLoading, errorMessage,
        userInput, // ✅ ตรวจสอบว่ามี userInput จริง ๆ
        setUserInput // ✅ ต้องคืนค่า setUserInput ไปด้วย
     }}>
      {children}
    </InviteContext.Provider>
  );
};

export const useInvite = () => {
  return useContext(InviteContext);
};
