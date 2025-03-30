import React from 'react'
import Navbar from './navbar'
import '../style/Home.css' // นำเข้า CSS สำหรับการจัดรูปแบบ
import { useUserAuth } from '../context/UserAuthContext';

function Home() {
  const { signUp, logIn, user, logOut, userData } = useUserAuth();
  return (
    <div>
      <Navbar />
      <div  className="background">
        
      </div>
    </div>
  )
}

export default Home
