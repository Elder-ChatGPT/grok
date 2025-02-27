//import React from "react";
import React, { useState } from "react";
import image from "./images/a5.png";
const Stress = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ score: "", forumType: "" });

  return (
    <div style={containerStyle}>
      {/* First Row */}
      <div style={rowStyle}>
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle}>Stress</h2>
          <p Style={moreStyle}>
          Stress is the body's natural response to challenges, but chronic stress disrupts hormonal balance, weakens the immune system, and increases inflammation. The hormone cortisol, released during stress, plays a vital role in energy regulation and immune response. However, prolonged cortisol elevation is linked to mood disorders, cardiovascular issues, and cognitive decline.
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
            <button style={smallButtonStyle}><a style={{textDecoration:"none",color:"white"}} href="https://youtu.be/n19HXmN-bMg" target="_blank">STRESS VIDEO</a></button>
            
        </div>
          </div>
          
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle}>MORE ABOUT STRESS</h2>
          <p Style={moreStyle}>Health Facts<br></br>Cortisol Regulation: Normal morning cortisol levels should range between 10–20 mcg/dL. Chronically elevated cortisol contributes to memory loss and weakened immune function.
Cardiovascular Risk: Chronic stress is associated with a 57% increased risk of heart disease and 50% higher likelihood of hypertension.
Cognitive Decline: Long-term stress leads to shrinkage of the hippocampus (the brain’s memory center), increasing the risk of Alzheimer’s disease by 30%.
Mental Health Impact: Individuals experiencing chronic stress have a 40% higher risk of depression and anxiety disorders due to dysregulation of dopamine and serotonin levels. </p>
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




export default Stress;