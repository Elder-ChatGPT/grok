import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import heroImg from "./images/ruben9.png";
import lifestyleImg from "./images/SLEDSS Healthy Lifestyles.jpg";
import logo from "./images/cape1.png";
import "./Home.css";

const useUserId = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return queryParams.get("userId");
};

const Home = () => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const navigate = useNavigate();
  const userId = useUserId();

  useEffect(() => {
    if (userId) localStorage.setItem("userID", userId);
  }, [userId]);

  useEffect(() => {
    const img = new Image();
    img.src = require("./images/pexel.png"); // Preload background image
    img.onload = () => setBackgroundLoaded(true);
  }, []);


  const handleEvaluationClick = () => {
    navigate("/evaluations");
  };

    if (!backgroundLoaded) {
    return <div style={{ height: "100vh", backgroundColor: "#f9fdfc" }} />;
  }


  return (
    <div className="home-root">
      {/* HERO SECTION */}
   <section className="hero">
  <div className="hero-overlay">
    <div className="hero-content">
      <h1 className="hero-title">Welcome to S.L.E.D.S.S</h1>
      <p className="hero-subtitle">
        Your journey to a healthier mind and lifestyle starts here.
      </p>
      <button className="hero-button" onClick={handleEvaluationClick}>
        Start Lifestyle Assessment Here
      </button>
    </div>
  </div>
</section>



      {/* HOW IT WORKS */}
      <section className="steps-section">
        <h2 className="section-heading">How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Choose Your Mode</h3>
            <p>Get advice as a guest or register for personalized coaching.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Take Your Evaluation</h3>
            <p>Assess your habits in six lifestyle domains.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Get Your Plan</h3>
            <p>SmartCoach generates a personalized lifestyle guide for you.</p>
          </div>
        </div>
      </section>

      {/* SERVICE MODES */}
      <section className="services-section">
        <h2 className="section-heading">Select Your Experience</h2>
        <div className="service-options">
          <div className="service-tile">
            <h3>🧭 General Services</h3>
            <p><Link to="/login">Explore healthy living tips</Link> without signing in.</p>
          </div>
          <div className="service-tile">
            <h3>🔐 My Services</h3>
            <p><Link to="/evaluations">Get personalized coaching</Link> after registering.</p>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="info-section">
        <h2 className="section-heading">Why It Matters</h2>
        <p>
          Research shows that stress, sleep, diet, and inactivity can contribute to memory loss.
          But healthy habits can protect and even improve brain function.
        </p>
        <div className="research-citations">
          <p><strong>Dr. Rudolph Tanzi</strong> – Harvard Medical School</p>
          <p><strong>Dr. Dean Ornish</strong> – Preventive Medicine Research Institute</p>
        </div>
        <img src={lifestyleImg} className="info-image" alt="Healthy lifestyle" />
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <img src={logo} alt="Kin-Keepers" />
          <p>Kin-Keepers® – Smarter Health, Brighter Minds</p>
        </div>
        <div className="footer-links">
          <a href="/">Home</a>
           <a href="https://familycircle.elderchatgpt.com/" target="_blank" rel="noopener noreferrer">Family-Circle</a>
          <a href="https://elderchatgpt.com/memorytest/" target="_blank" rel="noopener noreferrer">ElderCHAT</a>

        </div>
      </footer>
    </div>
  );
};

export default Home;


