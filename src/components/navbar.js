import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Modal, Button } from 'react-bootstrap';
import logo from '../image/logomain.png';
import '../style/navbar.css';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import dProfile from '../image/dprofile.png';
import Profileimg from './Profileimg'; // นำเข้า Component Profileimg
import Invitepage from './invitepage'
import { auth } from "../fierbase";
import { sendEmailVerification } from 'firebase/auth';

function Navbarcomponent() {
  const [currentPage, setCurrentPage] = useState("login");
  const [showVerificationCard, setShowVerificationCard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { signUp, logIn, user, logOut, userData } = useUserAuth(); // รวม signUp และ logIn ในการเรียกครั้งเดียว
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifly, setisVerifly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [photoURL, setPhotoURL] = useState(dProfile); // State สำหรับ URL รูปภาพ
  const userVerify = user?.emailVerified

   // ฟังก์ชันเปลี่ยนหน้า
   const handleRegister = () => setCurrentPage("register");
   const handleVerify = () => setCurrentPage("verify");
   const handleBackToLogin = () => setCurrentPage("login");
 
 
  

  useEffect(() => {
    console.log("UserData:", userData);
    console.log("Photo URL:", photoURL);

    if (userData && userData.photoBinary) {
      const base64String = userData.photoBinary;
      const imageSrc = `data:image/jpeg;base64,${base64String}`;
      console.log("Image Source:", imageSrc);
      setPhotoURL(imageSrc);
    } else {
      setPhotoURL(dProfile);
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
        await logOut();
        setShowModal(false)
        navigate('/');
    } catch(err) {
        console.log(err.message);
    }
}

  const SubmitRegisterVerify = async (e) => {
    e.preventDefault();
    setError("");

    // เปลี่ยนหน้าไปยังหน้า Verify
    setCurrentPage("verify");

    try {
      await signUp(email, password, name);
      const user = auth.currentUser;

      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        console.log('Verification email sent!');
      }
    } catch (err) {
        setError(err.message);
        console.log(err);
    }
  };

  

  
  const handleSubmitVerify = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
    setError(""); // รีเซ็ตค่าข้อผิดพลาด
  
    try {
      const user = auth.currentUser; // รับข้อมูลผู้ใช้ปัจจุบัน
      if (user) {
        // โหลดข้อมูลผู้ใช้ใหม่ เพื่ออัปเดตสถานะล่าสุด
        await user.reload();
  
        // ตรวจสอบสถานะการยืนยัน
        if (user.emailVerified === true) {
          setShowModal(false); // ปิด Modal หากยืนยันอีเมลแล้ว
          console.log("Email is verified. Modal closed.");
        } else {
          setShowModal(true); // แสดง Modal หากยังไม่ยืนยันอีเมล
          console.log("Email is not verified. Modal remains open.");
        }
      } else {
        setError("User not found. Please log in again."); // กรณีไม่มีผู้ใช้ในระบบ
      }
    } catch (error) {
      setError("An error occurred while verifying the email."); // แสดงข้อผิดพลาด
      console.error("Verification error:", error);
    }
  };

  


  
  // ฟังก์ชันเข้าสู่ระบบ
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await logIn(email, password); // ใช้ email และ password ในการเข้าสู่ระบบ
      setShowModal(false)
      navigate("/"); // เปลี่ยนหน้าไป Dashboard หลังจาก Login สำเร็จ
    } catch (err) {
      setError(err.message); // แสดงข้อความข้อผิดพลาด
      console.log(err);
    }
  };

  const profileRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen); // สลับสถานะ Dropdown
  };

  

  // ฟังก์ชันตรวจสอบการคลิกนอก container
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      // ตรวจสอบว่าการคลิกเกิดขึ้นนอก profile-container
      setShowProfile(false);
      setIsOpen(false);
    }
  };


  useEffect(() => {
    // เพิ่ม Event Listener เมื่อ component ถูก mount
    window.addEventListener("click", handleClickOutside);

    return () => {
      // ลบ Event Listener เมื่อ component ถูก unmount
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  console.log(user)
  return (
    <div className='navbar'>
      <Navbar expand="lg" className='navcolor' fixed="top" style={{ zIndex: 1000 }}>
        <Container className="navbar-container">
          <div className="left-section">
            <Navbar.Brand href="#">
              <img src={logo} alt="Logo" width="40" height="40" />
            </Navbar.Brand>
            <h1 className="titlenav">LoveGame</h1>
          </div>
          <div className="right-section">
          <Invitepage />

      {userVerify ? (
        <div
          ref={profileRef} // กำหนด Ref ที่ profile-container
          className="profile-container itim-regular"
          style={{ position: "relative", display: "inline-block" }}
        >
          <img
            src={photoURL}
            alt="Profile"
            className="profile-image"
            style={{ cursor: "pointer", borderRadius: "50%" }}
            onClick={toggleDropdown} // เปิด Dropdown
          />

          {isOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "#f9f9f9",
                minWidth: "160px",
                boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                zIndex: 1,
                borderRadius: "8px",
              }}
            >
              <div>
                <a
                  href="#"
                  className="dropProfile"
                  onClick={(e) => {
                    e.preventDefault(); // ป้องกันการเปลี่ยนหน้า
                    setShowProfile(!showProfile); // Toggle Card Profile
                  }}
                >
                  Profile
                </a>

                {/* Card Profile */}
                {showProfile && (
                  <div className="card-profile-overlay">
                    <div className="card-profile">
                      {/* เงื่อนไขแสดงผลปุ่ม close-button1 */}
                      {currentPage !== "verify" && (
                        <button
                          className="close-button1"
                          onClick={() => setShowProfile(false)} // ฟังก์ชันปิด Card Profile
                        >
                          ×
                        </button>
                      )}

                      <div className="card-border-top"></div>




                      <Profileimg />
                      


                      
                      <span>
                        {userData?.username || "No username provided"}
                      </span>
                      <p className="job">
                        {userData?.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <a href="#" className="dropProfile">
                Event
              </a>
              <a href="#" onClick={handleLogout } className="dropProfile">
                Logout
              </a>
            </div>
          )}
        </div>
      ) : (
        <button
          className="buttonlogin itim-regular"
          onClick={() => setShowModal(true)} // เปิด Modal Login
        >
          Login
        </button>
      )}

          </div>
        </Container>
      </Navbar>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
        <Modal.Title className="itim-regular" style={{ fontWeight: "bold" }}>
          {currentPage === "login"
            ? "Login"
            : currentPage === "register"
            ? "Register"
            : "Verify"}
        </Modal.Title>
        </Modal.Header >
        <Modal.Body>
        {currentPage === "login" && (
            <>
              {/* Card Login */}
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group itim-regular">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // ใช้ email
                  />
                </div>
                <div className="form-group itim-regular">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control itim-regular"
                    id="password"
                    placeholder="Enter password"
                    value={password} // ใช้ password
                    onChange={(e) => setPassword(e.target.value)} // อัปเดต State password
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <Button variant="primary" type="submit" className='itim-regular'>
                  <span className='itim-regular'>Login</span>
                </Button>
              </form>
              <p className="signup itim-regular">
                Don't have an account? <span className='m-1'></span>{"  "}
                <a
                  rel="noopener noreferrer"
                  href="#"
                  onClick={handleRegister} // เปลี่ยนไปหน้า Register
                  className=""
                >
                  Sign up
                </a>
              </p>
            </>
          )}

          {currentPage === "register" && (
            <>
              {/* Card Register */}
              <form 
              // onSubmit={handleSubmitRegister }
              onSubmit= {SubmitRegisterVerify}
              >
                <div className="form-group itim-regular">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // อัปเดต State name
                  />
                </div>
                <div className="form-group itim-regular">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // อัปเดต State email
                  />
                </div>
                <div className="form-group itim-regular">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // อัปเดต State password
                  />
                </div>
                {error && <p className="text-danger itim-regular">{error}</p>}
                <div className="form-actions">
                  <Button variant="secondary" onClick={handleBackToLogin}>
                    <span className="itim-regular">Back to Login</span>
                  </Button>
                  
                  <Button variant="primary" type="submit">
                    <span className="itim-regular">Register</span>
                  </Button>
                </div>
              </form>
            </>
          )}
          {currentPage === "verify" && (
            <>
              {/* Card verify */}
              <div className='con-verify'
                // onSubmit={handleSubmitVerify}
               >
              <div class="card-Verify">
                <div class="header-Verify">
                  <div class="image-Verify">
                    <svg
                      aria-hidden="true"
                      stroke="currentColor"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                      ></path>
                    </svg>
                  </div>
                  <div class="content-Verify">
                    <span class="title-Verify">กรุณากรุณายืนยันอีเมลของคุณ</span>
                    <p class="message-Verify">
                      โปรดตรวจสอบอีเมลของคุณและคลิกลิงก์เพื่อยืนยัน
                    </p>
                  </div>
                  <div class="actions-Verify">
                    
                  </div>
                </div>
                <Button className='desactivate-Verify' type="submit" onClick={handleSubmitVerify}>
                  <span className="itim-regular">Verify</span>
                </Button>
              </div>










                {/* <div className="form-group itim-regular">
                  <div className='container'>
                  <div className='row'>
                    <div className='col-2 center-svg'>
                        <p>กรุณากรุณายืนยันอีเมลของคุณ</p>
                        <svg fill="none" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
                          <path d="m13 14h-2v-5h2zm0 4h-2v-2h2zm-12 3h22l-11-19z" fill="#393a37"></path>
                          <p>โปรดตรวจสอบอีเมลของคุณและคลิกลิงก์เพื่อยืนยัน</p>
                        </svg>
                    </div>
                    <div className='col-10'>
                      
                      
                    </div>
                  </div>
                  </div>
                </div>
                <Button variant="primary" type="submit" onClick={handleSubmitVerify}>
                  <span className="itim-regular">Verify</span>
                </Button> */}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Navbarcomponent;