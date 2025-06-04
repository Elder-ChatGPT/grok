import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";
import About from "./components/about";
import Contact from "./components/contact";
import Page1 from "./components/page1";
import logo from "./images/cape.png";
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
import MnaResult from "./components/mna";
import StressScale from "./components/stressscale";
import StressScore from "./components/stressscore";
import PITT from "./components/pitt";
import PittScore from "./components/pittscore";
import Activity from "./components/exerciseactivity";
import Activityscore from "./components/exerciseresult";
import Literacy from "./components/literacy";
import Literacyscore from "./components/literacyscore";

const App = () => {
  const [demoDropdown, setDemoDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  const toggleDropdown = () => setDemoDropdown(!demoDropdown);
  const closeDropdown = () => setDemoDropdown(false);
  const handleLinkClick = (link) => {
    setActiveLink(link);
    closeDropdown();
    setMobileMenuOpen(false);
  };

  return (
    <Router>
      <div style={menuStyle}>
        <Link to="/" onClick={() => handleLinkClick("home")}>
          <img src={logo} alt="Logo" style={logoStyle} />
        </Link>

        <Link
          to="/"
          style={{
            ...welcomeStyle,
            textDecoration: 'none',
            color: activeLink === "home" ? "#FFD700" : "gold",
          }}
          onMouseEnter={(e) => e.target.style.color = "#FFD700"}
          onMouseLeave={(e) => e.target.style.color = activeLink === "home" ? "#FFD700" : "gold"}
        >
          Healthy Lifestyle Choices
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={hamburgerStyle}
        >
          ☰
        </button>

       <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
  <Link
    to="/"
    style={{
      ...linkStyle,
      color: activeLink === "home" ? "#FFD700" : "white",
    }}
    onClick={() => handleLinkClick("home")}
  >
    Home
  </Link>
 <div style={{ position: "relative" }}>
            
          <span style={{ ...linkStyle, color: "white" }} onClick={toggleDropdown}>
  My Wellness  Tools
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
                  General Services
                </Link>
                <Link
                  style={{
                    ...dropdownLinkStyle,
                    ...(activeLink === "personalized" ? activeDropdownLinkStyle : {}),
                  }}
                  to="/evaluations"
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
                  My Personalized Plan
                </Link>
              </div>
  )}
</div>

  




  <div style={logoutStyle}>
    <Logout />
  </div>
</div>


        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div style={mobileDropdownStyle}>
            <Link to="/" onClick={() => handleLinkClick("home")} style={linkStyle}>Home</Link>
            <Link to="/login" onClick={() => handleLinkClick("general")} style={linkStyle}>General Services</Link>
            <Link to="/evaluations" onClick={() => handleLinkClick("personal")} style={linkStyle}>My Personalized Plan</Link>
            <Link to="/contact" onClick={() => handleLinkClick("contact")} style={linkStyle}>Contact</Link>
          </div>
        )}
      </div>

      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evaluations" element={<ProtectedRoute><Evaluations /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Page1 />} />
          <Route path="/logout" element={<Logout />} />
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
          <Route path="/mna" element={<ProtectedRoute><MnaResult /></ProtectedRoute>} />
          <Route path="/bmi" element={<ProtectedRoute><BmiEvaluation /></ProtectedRoute>} />
          <Route path="/nurtition" element={<ProtectedRoute><MnaTest/></ProtectedRoute>} />
          <Route path="/socialtest" element={<ProtectedRoute><Socialtest /></ProtectedRoute>} />
          <Route path="/socialanswers" element={<ProtectedRoute><SocialAnswers /></ProtectedRoute>} />
          <Route path="/stressscale" element={<ProtectedRoute><StressScale /></ProtectedRoute>} />
          <Route path="/stressscore" element={<ProtectedRoute><StressScore /> </ProtectedRoute>} />
          <Route path="/pitt" element={<ProtectedRoute><PITT /></ProtectedRoute>} />
          <Route path="/pittscore" element={<ProtectedRoute><PittScore /> </ProtectedRoute>} />
          <Route path="/exerciseactivity" element={<ProtectedRoute><Activity /> </ProtectedRoute>} />
          <Route path="/exerciseresult" element={<ProtectedRoute><Activityscore /> </ProtectedRoute>} />
          <Route path="/literacy" element={<ProtectedRoute><Literacy /> </ProtectedRoute>} />
          <Route path="/literacyscore" element={<ProtectedRoute><Literacyscore /> </ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

// 🌈 STYLES

const menuStyle = {
  background: "linear-gradient(to right, #0e5580, #0e5580)",
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
};

const welcomeStyle = {
  fontSize: "26px",
  fontWeight: "bold",
  textAlign: "left",
  flexGrow: 1,
  transition: "color 0.3s",
};

const hamburgerStyle = {
  background: "none",
  border: "none",
  fontSize: "30px",
  color: "white",
  cursor: "pointer",
  display: "none",
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
  fontSize: "20px",
  marginLeft: "40px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "color 0.3s",
};

const dropdownStyle = {
  position: "absolute",
  top: "100%",
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "10px 0",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  zIndex: 1001,
  width: "200px",
  animation: "fadeIn 0.3s ease-in-out",
};

const dropdownLinkStyle = {
  display: "block",
  padding: "12px 20px",
  color: "#1E3A5F",
  textDecoration: "none",
  fontSize: "18px",
  textAlign: "center",
  transition: "all 0.2s ease-in-out",
  cursor: "pointer",
  backgroundColor: "transparent",
};

const activeDropdownLinkStyle = {
  backgroundColor: " #0e5580",
  color: "white",
  fontWeight: "bold",
};

const mobileDropdownStyle = {
  position: "absolute",
  top: "80px",
  left: 0,
  width: "100%",
  backgroundColor: "#003f5c",
  zIndex: 999,
  padding: "20px",
  display: "flex",
  flexDirection: "column",
};


const logoutStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "80px",
  fontSize: "20px",
  cursor: "pointer",
  color: "white",
};


export default App;
