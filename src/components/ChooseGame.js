import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../style/ChooseGame.css';
import imgtest from '../image/imgtest.png';
import imgtest2 from '../image/imgtest2.png';
import { useUserAuth } from '../context/UserAuthContext.js';
import { useInvite } from "../context/InviteAuthContext.js";

const images = [imgtest, imgtest2, imgtest, imgtest2, imgtest, imgtest2, imgtest, imgtest2];
const descriptions = [
  "Game 1 description", "Game 2 description", "Game 3 description", "Game 4 description", 
  "Game 5 description", "Game 6 description", "Game 7 description", "Game 8 description"
];
const buttons = [
  "เล่นเกม 1", "เล่นเกม 2", "เล่นเกม 3", "เล่นเกม 4", 
  "เล่นเกม 5", "เล่นเกม 6", "เล่นเกม 7", "เล่นเกม 8"
];

function ChooseGame() {
  const { userData, isLoading, user } = useUserAuth();  // ใช้ UserAuthContext แทน
  const { usageCount: inviteUsageCount } = useInvite();  // ดึง usageCount จาก InviteAuthContext
  const navigate = useNavigate();
  const userVerify = user?.emailVerified
  const usageCount = user?.usageCount || 0;  // ดึงค่า usageCount จาก userData (หรือ 0 หากไม่มี)

  // เพิ่มการตรวจสอบว่า user พร้อมใช้งานหรือไม่
  if (isLoading) {
    return <div>Loading...</div>;  // ถ้ายังไม่เสร็จการโหลดข้อมูลจาก Firestore
  }

  const handleButtonClick = (index) => {
    console.log(user)
    console.log("User email verified:", userVerify); // ตรวจสอบ emailVerified
    console.log("User usageCount:", usageCount); 
    if (!userData) {
      alert('Please log in to play');
      return;
    }
  
    if (!userVerify) {
      alert('Please verify your email to play');
      return;
    }
  
    // ตรวจสอบการใช้งานโค้ดเชิญ (usageCount) จาก InviteAuthContext
    switch (index) {
      case 0:
        if (inviteUsageCount >= 1 || usageCount >= 1) {  // ตรวจสอบจากทั้งสองแหล่ง
          navigate('/game1');
        } else {
          alert('You must reach a usage count of at least 1 to access this game.');
        }
        break;
      case 1:
        if (inviteUsageCount >= 2 || usageCount >= 2) {  // ตรวจสอบจากทั้งสองแหล่ง
          navigate('/game2');
        } else {
          alert('You must reach a usage count of at least 1 to access this game.');
        }
        break;
      case 2:
        navigate('/game3');
        break;
      case 3:
        navigate('/game4');
        break;
      case 4:
        navigate('/game5');
        break;
      case 5:
        navigate('/game6');
        break;
      case 6:
        navigate('/game7');
        break;
      case 7:
        navigate('/game8');
        break;
      default:
        break;
    }
  };
  

  

  return (
    <div className="grid-container">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="card" key={index}>
          <div className="card-image-container">
            <img src={images[index]} alt={`game${index + 1}`} />
          </div>
          <p className="card-des">
            {descriptions[index]}
          </p>
          <button className="card-button" onClick={() => handleButtonClick(index)}>
            {buttons[index]}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ChooseGame;
