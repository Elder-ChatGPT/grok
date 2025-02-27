import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, } from "react-router-dom";
import Home from "./components/home";
import About from "./components/about";
import Contact from "./components/contact";
import Page1 from "./components/page1";
import logo from "./images/favicon192.png"; // Update the path to your logo
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

const App = () => {
  return (
    <Router>
      {/* Menu Bar */}
      <div style={menuStyle}>
        <img src={logo} alt="Logo" style={logoStyle} />
        <div>
      <Logout /> {/* Logout icon appears on every page */}
      
      {/* Your other routes */}
    </div>
        <span style={welcomeStyle}>Welcome to S.L.E.D.S.S</span>
        <div style={menuLinksStyle}>
        
          <Link style={linkStyle} to="/">Home</Link>
          <Link style={linkStyle} to="/login">Demo</Link>
          <Link style={linkStyle} to="/about">Login</Link>
          <Link style={linkStyle} to="/about4"></Link>
          <Link style={linkStyle} to="/contact"></Link>
         
          
          
        </div>
        
      </div>
      

      {/* Routes */}
      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Page1 />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about1" element={
            <ProtectedRoute><About1 />
            </ProtectedRoute>} />
          <Route path="/about2" element={<ProtectedRoute>
            <About2 />
            </ProtectedRoute>} />
          <Route path="/about3" element={<ProtectedRoute>
            <About3 /> 
            </ProtectedRoute>} />
          <Route path="/about4" element={<ProtectedRoute>
            <About4 />
            </ProtectedRoute>} />
          <Route path="/about5" element={<About5 />} />
          <Route path="/login" element={
            <Login />}/>
            
          <Route path="/socialization" element={<Socializtion/>} />
          <Route path="/learning" element={<Learning/>} />
          <Route path="/exercise" element={<Exercise/>} />
          <Route path="/diet" element={<Diet/>} />
          <Route path="/stress" element={<Stress/>} />
          <Route path="/sleep" element={<Sleep/>} />
          
        </Routes>
      </div>
    </Router>
  );
};

// Styles for Menu Bar
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
  marginRight: "-2px",
};

const welcomeStyle = {
  fontSize: "24px", // Make the text big
  fontWeight: "bold",
  color: "gold", // Gold color for the text
  textAlign: "left",
  flexGrow: 1, // Let it take up space between the logo and links
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
  marginLeft: "24px",
};

export default App;