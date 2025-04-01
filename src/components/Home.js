import React from 'react'
import Navbar from './navbar'
import '../style/Home.css' // นำเข้า CSS สำหรับการจัดรูปแบบ
import { useUserAuth } from '../context/UserAuthContext';
import Carousel from './Carousel';
import imgpromote from '../image/imgpromote.png'
import ChooseGame from './ChooseGame';

const OPTIONS = { loop: true }
const SLIDES = [
  imgpromote,
  imgpromote,
  imgpromote,
];


function Home() {
  const { signUp, logIn, user, logOut, userData } = useUserAuth();
  return (
    <div className='Home'>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className="carousel-image">
        <Carousel slides={SLIDES} options={OPTIONS} />
      </div>
      <div className='background-bar'>
        <div className='background2'></div>
          <div className='background2-1'></div>
          <div class="inverted-triangle"></div>
      </div>
      <div className='container'>
        <p className='head-text'>เลือกเกม</p>
        <div className='ChooseGame'></div>
        <ChooseGame />
      </div>
    </div>
  );
}

export default Home
