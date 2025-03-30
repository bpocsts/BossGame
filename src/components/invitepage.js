import React, { useState, useEffect } from "react";
import "../style/navbar.css";
import { collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { auth } from "../fierbase";
import logo from '../image/logomain.png'

function InvitePage() {
  const [inviteCode, setInviteCode] = useState(""); // สถานะเก็บโค้ดเชิญ
  const [isLoading, setIsLoading] = useState(true); // สถานะกำลังโหลด
  const [errorMessage, setErrorMessage] = useState(""); // ข้อผิดพลาด
  const db = getFirestore(); // Firestore instance
  const [userInput, setUserInput] = useState(""); // ข้อมูลที่ผู้ใช้กรอก
  const [message, setMessage] = useState(""); // ข้อความสถานะ
  const [usageCount, setUsageCount] = useState(0); // จำนวนการใช้งานโค้ดเชิญ
  const maxCount = 5;
  const percentage = Math.min((usageCount / maxCount) * 100, 100);

  const [isCardVisible, setIsCardVisible] = useState(false);

  const toggleCard = () => {
    setIsCardVisible(!isCardVisible);
  };

  const closeCard = () => {
    setIsCardVisible(false);
  };


  // สร้างโค้ดเชิญใหม่หรือใช้โค้ดที่มีอยู่
  const generateInviteCode = async () => {
    if (!auth.currentUser) {
      console.error("ผู้ใช้ยังไม่ได้ล็อกอิน");
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

      // ตรวจสอบว่าผู้ใช้มีโค้ดอยู่แล้วหรือไม่
      if (!existingInvitesSnapshot.empty) {
        const existingInvite = existingInvitesSnapshot.docs[0].data();
        setInviteCode(refCode); // ใช้โค้ดเดิม
      } else {
        // สร้างโค้ดใหม่
        await addDoc(collection(db, "invites"), {
          userId: refCode,
          inviteCode: refCode,
          createdAt: new Date(),
          usageCount: 0, // เริ่มต้นจำนวนการใช้งานที่ 0
          usedBy: [], // รายชื่อผู้ใช้ที่ใช้โค้ด
        });
        setInviteCode(refCode); // เก็บโค้ดใน State
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสร้างโค้ด:", error.message);
      setErrorMessage("ไม่สามารถสร้างโค้ดเชิญได้");
    } finally {
      setIsLoading(false); // ยกเลิกสถานะโหลด
    }
  };

  // ดึงจำนวนการใช้งานโค้ดเชิญจาก Firestore
  const getInviteUsage = async () => {
    try {
      const invitesQuery = query(
        collection(db, "invites"),
        where("inviteCode", "==", inviteCode)
      );
      const invitesSnapshot = await getDocs(invitesQuery);

      if (!invitesSnapshot.empty) {
        const inviteData = invitesSnapshot.docs[0].data();
        setUsageCount(inviteData.usageCount || 0); // ตั้งค่า usageCount
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error.message);
    }
  };

  // ตรวจสอบโค้ดเชิญ
  const checkInviteCode = async () => {
    setIsLoading(true);
    try {
      const invitesQuery = query(
        collection(db, "invites"),
        where("inviteCode", "==", userInput)
      );
      const invitesSnapshot = await getDocs(invitesQuery);

      if (!invitesSnapshot.empty) {
        const inviteDoc = invitesSnapshot.docs[0];
        const inviteData = inviteDoc.data();

        // อัปเดต Firestore: เพิ่มจำนวนการใช้งาน
        await updateDoc(inviteDoc.ref, {
          usageCount: (inviteData.usageCount || 0) + 1,
          usedBy: [...(inviteData.usedBy || []), auth.currentUser.uid],
        });

        setMessage("โค้ดเชิญถูกต้อง!");
        setUserInput(""); // ล้าง input
      } else {
        setMessage("โค้ดเชิญไม่ถูกต้อง!");
      }

      // ล้างข้อความหลัง 5 วินาที
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบโค้ด:", error.message);
      setMessage("เกิดข้อผิดพลาดในการตรวจสอบโค้ด");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateInviteCode(); // สร้างโค้ดเมื่อโหลดครั้งแรก
  }, []);

  useEffect(() => {
    if (inviteCode) {
      getInviteUsage(); // ดึงข้อมูลการใช้งานเมื่อมีโค้ด
    }
  }, [inviteCode]);

  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
  };


  return (
    <>
      <button onClick={toggleCard} className="button4">
        <span className="span3">
          {/* SVG Icon */}
          <svg
            className="svg2 w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
            />
          </svg>
        </span>
      </button>

      {isCardVisible && (
        <div className="fullScreenCard">
          <button onClick={closeCard} className="buttonClose2">
            <svg className="Closesvg2 w-[30px] h-[30px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
          </button>
          <br/>
          <ul style={{listStyle: "none", padding: "0", margin: "0"}}>
            <li className="text-title-invite" >REDEEM CODE</li>
            <li className="text-logo-invite" style={{marginTop: "10px"}}>
              <div className="neon-container">
                  <h1 className="neon-text">LOVE GAME</h1>
              </div>
              
            </li>
            <li className="text-title-invite2" style={{marginTop: "10px"}}>ชวนเพื่อนมาร่วมสนุก</li>
            <li className="text-title-invite2">เพื่อรับของรางวัล</li>
          </ul>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "120px",
            }}
          >
            
          <div
            style={{
              width: "200px",
              border: "3px solid #2d1f75",
              borderRadius: "5px",
              padding: "5px",
              position: "relative",
              height: "30px",
            }}
          >
            {/* แถบเปอร์เซ็นต์ */}
            <div
              style={{
                width: `${percentage}%`,
                backgroundColor: "#4CAF50",
                height: "100%",
              }}
            ></div>

            {/* เส้นแบ่งแนวตั้งทุก 20% */}
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: `${index * 20}%`,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  backgroundColor: "#2d1f75",
                }}
              />
            ))}

            {/* Tooltip at 10% with upward arrow */}
            <div
              style={{
                position: "absolute",
                left: "10%", // Tooltip at 10%
                transform: "translateX(-50%)",
                top: "-85px", // Adjust to position above the progress bar
                backgroundColor: "#2d1f75",
                border: "1px solid #2d1f75",
                borderRadius: "5px",
                width: "75px", // Width
                height: "75px", // Height
                fontSize: "12px",
                color: "#ffffff",
                whiteSpace: "nowrap",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Tooltip: 10%
              {/* Upward Arrow */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-7px", // Position below tooltip
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "0",
                  height: "0",
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid #2d1f75", // Match tooltip background
                }}
              ></div>

            </div>

            {/* Tooltip at 90% with upward arrow */}
            <div
              style={{
                position: "absolute",
                left: "90%", // Tooltip at 90%
                transform: "translateX(-50%)",
                top: "-85px", // Adjust to position above the progress bar
                backgroundColor: "#2d1f75",
                border: "1px solid #2d1f75",
                borderRadius: "5px",
                width: "75px", // Width
                height: "75px", // Height
                fontSize: "12px",
                color: "#ffffff",
                whiteSpace: "nowrap",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Tooltip: 90%
              {/* Upward Arrow */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-7px", // Position below tooltip
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "0",
                  height: "0",
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid #2d1f75", // Match tooltip background
                }}
              ></div>

            </div>
            <div className="count-invite">
              <span>
                {`${usageCount}/5`}
              </span>
            </div>
          </div>
        </div>


        {isLoading ? (
          <p>กำลังโหลด...</p>
        ) : errorMessage ? (
          <p style={{ color: "red" }}>{errorMessage}</p>
        ) : null}

        <div className="container" style={{marginTop: "50px"}}>
          <div className="row">
            <div className="col" style={{color: "#2d1f75", fontSize: "20px", fontWeight: "bold"}}>
              โค้ดชวนเพื่อน
            </div>
          </div>
          <div className="row">
            {inviteCode && (
            <div className="col" style={{display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "10px", marginRight: "10px"}}>
                <div className="border-invite">
                  <div class="col-md-10" style={{left: "10px", color: "#ffffff"}}>
                    {inviteCode.length > 10 ? `${inviteCode.slice(0, 20)}...` : inviteCode}
                  </div>
                  
                  <div class="col-4 col-md-2" style={{marginRight: "5px"}}>
                    <button onClick={copyToClipboard} className="end-invite">
                      <svg class="Subscribe-svg w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/>
                      </svg>
                      </button>
                  </div>
                </div>
            </div>
            )}
          </div>



          <div className="row" style={{marginTop: "10px"}}>
            <div className="col" style={{color: "#2d1f75", fontSize: "20px", fontWeight: "bold"}}>
              กรอกโค้ดชวนเพื่อน
            </div>
          </div>
          <div className="row">
            <div className="col" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div className="border-invite">
                  <div class="col-md-10" style={{left: "10px", color: "#ffffff"}}>
                    <input 
                      type="text"
                      placeholder="กรอกโค้ด"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                  </div>
                  
                  <div class="col-4 col-md-2" style={{marginRight: "5px"}}>
                    <button onClick={checkInviteCode} className="end-invite">
                      <svg class="Subscribe-svg w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M20.337 3.664c.213.212.354.486.404.782.294 1.711.657 5.195-.906 6.76-1.77 1.768-8.485 5.517-10.611 6.683a.987.987 0 0 1-1.176-.173l-.882-.88-.877-.884a.988.988 0 0 1-.173-1.177c1.165-2.126 4.913-8.841 6.682-10.611 1.562-1.563 5.046-1.198 6.757-.904.296.05.57.191.782.404ZM5.407 7.576l4-.341-2.69 4.48-2.857-.334a.996.996 0 0 1-.565-1.694l2.112-2.111Zm11.357 7.02-.34 4-2.111 2.113a.996.996 0 0 1-1.69-.565l-.422-2.807 4.563-2.74Zm.84-6.21a1.99 1.99 0 1 1-3.98 0 1.99 1.99 0 0 1 3.98 0Z" clip-rule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>  
            </div>
          </div>
        </div>
          
          
          

        </div>
      )}
    </>
  );
}

export default InvitePage;