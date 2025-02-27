//import React from "react";
import React, { useState } from "react";
import image from "./images/a1.png";
const Socialization = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ score: "", forumType: "" });

  return (
    <div style={containerStyle}>
      {/* First Row */}
      <div style={rowStyle}>
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle}>Socialization</h2>
          <p style={wordStyle}>Socialization is the process of engaging in meaningful interactions with family, friends, and communities. It plays a crucial role in mental well-being, emotional stability, and cognitive function. Strong social networks can help lower stress, improve immune function, and even reduce the risk of neurodegenerative diseases like Alzheimer's and dementia. Social engagement stimulates brain activity, strengthens neural pathways, and fosters emotional resilience
 
</p>
        </div>
        <div style={{ ...columnStyle, flex: 1 }}>
         
          <img src={image} alt="pic" style={imageStyle} />
        </div>
      </div>

      {/* Second Row */}
      <div style={rowStyle}>
        <div style={{ ...columnStyle, flex: 1 }}>
          <div style={smallButtonsContainerStyle}>
            <button style={smallButtonStyle}><a style={{textDecoration:"none",color:"white"}} href="https://youtu.be/ZqX_7oP6riM" target="_blank">SOCIALIZATION VIDEO</a></button>
            
        </div>
          </div>
          
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle}>MORE ABOUT SOCALIZATION</h2>
          <p style={moreStyle}>Health Facts<br></br>

Brain Health: Engaging in social activities at least 3–5 times per week has been shown to reduce the risk of cognitive decline by up to 40%. Socializing activates brain regions responsible for memory and problem-solving, promoting neuroplasticity.
Hormonal Balance: Positive social interactions trigger the release of oxytocin, which helps reduce stress and lower cortisol (the stress hormone) levels.
Immune Function: Individuals with strong social ties have higher natural killer cell activity, which boosts immune response and lowers inflammation.
Cardiovascular Health: Loneliness and social isolation increase the risk of heart disease and stroke by 29% and 32%, respectively, due to chronic stress and elevated blood pressure.</p>
        </div>
      </div>

    </div>
  );
};

// Styles
const wordStyle = {
  fontSize: "16px",
    
};
const moreStyle = {
  fontSize: "16px",
    
};



const titleStyle = {
    color: "#0E5580",  
}
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "40px",
  padding: "20px",
  height: "100vh",
};

const rowStyle = {
  display: "flex",
  gap: "20px",
};

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const imageStyle = {
  width: "75%",
  height: "auto",
  borderRadius: "100px",
};

const bigButtonStyle = {
  backgroundColor: " #C05A0E",
  color: "black",
  fontSize: "18px",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginBottom: "10px",
};

const smallButtonsContainerStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "10px",
};

const smallButtonStyle = {
  backgroundColor: "#0E5580",
  color: "white",
  fontSize: "16px",
  padding: "8px 16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  width: "400px",
  textAlign: "center",
};

const formFieldStyle = {
  marginBottom: "15px",
  textAlign: "left",
};

const formButtonStyle = {
  backgroundColor: "green",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px",
};

const cancelButtonStyle = {
  backgroundColor: "red",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const modalButtonsStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};




export default Socialization;