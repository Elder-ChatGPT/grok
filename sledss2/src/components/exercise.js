//import React from "react";
import React, { useState } from "react";
import image from "./images/a3.png";
const Exercise = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ score: "", forumType: "" });

  return (
    <div style={containerStyle}>
      {/* First Row */}
      <div style={rowStyle}>
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle}>Exercise</h2>
          <p style={wordStyle}>
          Regular physical activity improves cardiovascular function, strengthens muscles, and supports brain health by increasing blood flow and oxygen delivery. Exercise stimulates the release of dopamine, serotonin, and endorphins, which improve mood, reduce stress, and enhance cognitive function. It also regulates insulin sensitivity, reduces inflammation, and prevents metabolic disorders.
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
            <button style={smallButtonStyle}><a style={{textDecoration:"none",color:"white"}} href="https://youtu.be/U7SCI8h6hM8" target="_blank">EXERCISE  VIDEO</a></button>
            
        </div>
          </div>
          
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle}>MORE ABOUT EXERCISE </h2>
          <p style={moreStyle}>Health Facts.<br></br> Heart Health: Engaging in at least 150 minutes of moderate exercise per week reduces the risk of heart disease by 35% and stroke by 27%.
Cognitive Benefits: Physical activity increases the production of BDNF, promoting neurogenesis and reducing the risk of Alzheimer’s.
Metabolic Regulation: Regular exercise helps lower fasting blood glucose levels and improves insulin sensitivity, reducing the risk of type 2 diabetes by 58%.
Inflammation Control: Sedentary behavior increases systemic inflammation, leading to a 32% higher risk of stroke and a 27% higher risk of diabetes. </p>
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




export default Exercise;