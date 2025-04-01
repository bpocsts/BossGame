import React from 'react'
import Navbar from './navbar'
import '../style/Home.css' // นำเข้า CSS สำหรับการจัดรูปแบบ
import { useUserAuth } from '../context/UserAuthContext';
import Carousel from './Carousel';
import imgtest from '../image/imgtest.png'
import imgtest2 from '../image/imgtest2.png'
import ChooseGame from './ChooseGame';

const OPTIONS = { loop: true }
const SLIDES = [
  imgtest,
  imgtest2,
  imgtest,
  imgtest2,
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
