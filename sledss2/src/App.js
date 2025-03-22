import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";
import About from "./components/about";
import Contact from "./components/contact";
import Page1 from "./components/page1";
import logo from "./images/cape.png";
import About1 from "./components/about1";
import About2 from "./components/about2";
import About3 from "./components/about3";
import About4 from "./components/about4";
import About5 from "./components/about5";
import Login from "./components/login";
import Socializtion from "./components/socalization";
import Learning from "./components/learning";
import Exercise from "./components/exercise";
import Diet from "./components/diet";
import Stress from "./components/stress";
import Sleep from "./components/sleep";
import ProtectedRoute from "./components/protected";
import Logout from "./components/logout";
import Socialtest from "./components/socialtest";
import SocialAnswers from "./components/socialanswers";
import Evaluations from "./components/evaluations";
import BmiEvaluation from "./components/bmi";
import MnaTest from "./components/nurtition";

const App = () => {
  const [demoDropdown, setDemoDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleDropdown = () => {
    setDemoDropdown(!demoDropdown);
  };

  const closeDropdown = () => {
    setDemoDropdown(false);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    closeDropdown();
  };

  return (
    <Router>
      <div style={menuStyle}>
    <Link to="/">
        <img src={logo} alt="Logo" style={logoStyle} />
    </Link>
        <span style={welcomeStyle}>S.L.E.D.S.S.</span>
        <div style={menuLinksStyle}>
          <Logout />
          <div style={{ position: "relative" }}>
            <span style={linkStyle} onClick={toggleDropdown}>
              Services
            </span>
            {demoDropdown && (
              <div style={dropdownStyle} onMouseLeave={closeDropdown}>
                <Link
                  style={{
                    ...dropdownLinkStyle,
                    ...(activeLink === "free" ? activeDropdownLinkStyle : {}),
                  }}
                  to="/login"
                  onClick={() => handleLinkClick("free")}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0E5580";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#1E3A5F";
                  }}
                >
                  Free Services
                </Link>
                <Link
                  style={{
                    ...dropdownLinkStyle,
                    ...(activeLink === "personalized" ? activeDropdownLinkStyle : {}),
                  }}
                  to="/about"
                  onClick={() => handleLinkClick("personalized")}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0E5580";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#1E3A5F";
                  }}
                >
                  Personalized Services
                </Link>
              </div>
            )}
          </div>
          <Link style={linkStyle} to="/evaluations"></Link>
          <Link style={linkStyle} to="/evaluation"></Link>
          <Link style={linkStyle} to="/evaluation"></Link>
        </div>
      </div>

      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evaluations" element={<ProtectedRoute><Evaluations /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Page1 />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about1" element={<ProtectedRoute><About1 /></ProtectedRoute>} />
          <Route path="/about2" element={<ProtectedRoute><About2 /></ProtectedRoute>} />
          <Route path="/about3" element={<ProtectedRoute><About3 /></ProtectedRoute>} />
          <Route path="/about4" element={<ProtectedRoute><About4 /></ProtectedRoute>} />
          <Route path="/about5" element={<About5 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/socialization" element={<Socializtion />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/stress" element={<Stress />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/bmi" element={<ProtectedRoute><BmiEvaluation /></ProtectedRoute>} />
          <Route path="/nurtition" element={<ProtectedRoute><MnaTest/></ProtectedRoute>} />
          <Route path="/socialtest" element={<ProtectedRoute><Socialtest /></ProtectedRoute>} />
          <Route path="/socialanswers" element={<ProtectedRoute><SocialAnswers /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

const menuStyle = {
  backgroundColor: "#0E5580",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "98%",
  position: "fixed",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
  padding: "0 25px",
};

const logoStyle = {
  height: "80px",
  marginRight: "-1px",
};

const welcomeStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "gold",
  textAlign: "left",
  flexGrow: 1,
};

const menuLinksStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "auto",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  marginLeft: "40px",
  cursor: "pointer",
};

const dropdownStyle = {
  position: "absolute",
  top: "100%",
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "10px 0",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  zIndex: 1001,
  width: "180px",
};

const dropdownLinkStyle = {
  display: "block",
  padding: "12px 20px",
  color: "#1E3A5F",
  textDecoration: "none",
  fontSize: "16px",
  textAlign: "center",
  transition: "background-color 0.2s ease-in-out",
  cursor: "pointer",
};

const activeDropdownLinkStyle = {
  ...dropdownLinkStyle,
  backgroundColor: "#0E5580",
  color: "white",
};

export default App;
