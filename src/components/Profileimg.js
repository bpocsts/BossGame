import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext"; // ดึง Context
import dProfile from "../image/dprofile.png"; // รูป Default
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Firestore methods
import '../style/Profileimg.css'; // นำเข้า CSS สำหรับการจัดรูปแบบ

function Profileimg() {
  const db = getFirestore(); // เชื่อมต่อ Firestore
  const { userData, user } = useUserAuth(); // ดึงข้อมูลผู้ใช้จาก Context
  const [photoURL, setPhotoURL] = useState(dProfile); // State สำหรับ URL รูปภาพ
  const [selectedFile, setSelectedFile] = useState(null); // State สำหรับไฟล์ที่เลือก

  // ฟังก์ชันจัดการการเลือกไฟล์
  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1]; // แปลงรูปภาพเป็น Base64
      setSelectedFile(base64String); // เก็บ Base64 ใน State
    };

    reader.readAsDataURL(file);
  };

  // ฟังก์ชันบันทึกข้อมูลลงใน Firestore
  const handleClick = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const userDocRef = doc(db, "users", user.uid); // อ้างอิงเอกสารใน Firestore
    try {
      await setDoc(
        userDocRef,
        { photoBinary: selectedFile }, // เพิ่มข้อมูล Base64 ลงในฟิลด์ photoBinary
        { merge: true } // merge เพื่อไม่ลบข้อมูลอื่นในเอกสาร
      );
      console.log("Photo saved to Firestore!");
      setPhotoURL(`data:image/jpeg;base64,${selectedFile}`); // แปลง Base64 กลับเป็นรูป
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error saving photo:", error.message);
    }
  };

  // ใช้ useEffect เพื่อตรวจสอบและตั้งค่า photoURL
  useEffect(() => {
    if (userData && userData.photoBinary) {
      const base64String = userData.photoBinary;
      const imageSrc = `data:image/jpeg;base64,${base64String}`; // สร้าง URL รูปภาพจาก Base64
      setPhotoURL(imageSrc);
    } else {
      setPhotoURL(dProfile); // ใช้รูป Default หากไม่มีข้อมูล
    }
  }, [userData]);

  const [showEditCard, setShowEditCard] = useState(false);

  const toggleEditCard = () => {
    setShowEditCard(!showEditCard);
  };



  return (
    <>
    <div className="img-profile">
      <img
        src={photoURL}
        alt="Avatar"
        className="avatar"
        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
      />
      
    </div>

    <button onClick={toggleEditCard}>Edit</button>
      {showEditCard && (
        <>
          <div className="overlay"></div>
          <div className="card">
            <p>This is the Edit Card!</p>
            <input type="file" accept="image/*" onChange={handleChange} />
            <button onClick={handleClick}>Upload</button>
            <button onClick={toggleEditCard}>Close</button>
          </div>
        </>
      )}
    </>
  );
}

export default Profileimg;