import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../image/logomain.png';
import '../style/navbar.css';

function NavbarComponent() {
  return (
    <div >
      <Navbar expand="lg" bg="black" fixed="top" style={{ zIndex: 1000 }}>
        <Container className="navbar-container">
          {/* Left section */}
          <div className="left-section">
            <Navbar.Brand href="#">
              <img
                src={logo}
                alt="Logo"
                width="40"
                height="40"
                className="d-inline-block align-top"
              />
            </Navbar.Brand>
            <h1 className='titlenav'>LoveGame</h1>
          </div>

          {/* Center section */}
          <div className="center-section">
            <div className="InputContainer">
              <input
                placeholder="SearchGame"
                id="input"
                className="input"
                name="text"
                type="text"
              />
              <label className="labelforsearch" htmlFor="input">
                <svg className="searchIcon" viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                </svg>
              </label>
            </div>
          </div>

          {/* Right section */}
          <div className="right-section">
            <Navbar id="navbarNav">
              <Nav className="ms-auto">

              <button class="buttonlogin">Login</button>

              </Nav>
            </Navbar>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavbarComponent;