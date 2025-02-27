//import React from "react";
import React, { useState } from "react";
import image from "./images/a6.png";
const Sleep = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ score: "", forumType: "" });

  return (
    <div style={containerStyle}>
      {/* First Row */}
      <div style={rowStyle}>
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle} >Sleep</h2>
          <p wordStyle> Sleep is essential for cognitive processing, memory consolidation, and cellular repair. It regulates the production of melatonin (the sleep hormone) and growth hormones, both of which are crucial for neurological restoration. Sleep also facilitates the removal of beta-amyloid plaques, which are linked to Alzheimer’s disease, through the glymphatic system.</p>
        </div>
        <div style={{ ...columnStyle, flex: 1 }}>
         
          <img src={image} alt="pic" style={imageStyle} />
        </div>
      </div>

      {/* Second Row */}
      <div style={rowStyle}>
        <div style={{ ...columnStyle, flex: 1 }}>
          <div style={smallButtonsContainerStyle}>
            <button style={smallButtonStyle}><a style={{textDecoration:"none",color:"white"}} href="https://youtu.be/_j8jFWVMtaQ" target="_blank">SLEEP VIDEO</a></button>
            
        </div>
          </div>
          
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle}>MORE ABOUT SLEEP</h2>
          <p Style={moreStyle}>Health Facts.<br></br>Cognitive Health: Sleeping less than 6 hours per night increases the risk of Alzheimer’s disease by 30% due to impaired brain detoxification.
Metabolic Effects: Short sleep duration disrupts leptin and ghrelin, the hormones responsible for appetite regulation, leading to a 48% increased risk of obesity.
Heart Disease Prevention: Sleep deprivation elevates blood pressure and inflammatory markers, increasing the risk of stroke and heart disease by 45%.
Immune Function: Deep sleep enhances the production of cytokines, proteins that help the immune system fight infections. Poor sleep is linked to a 70% increased susceptibility to colds and flu. </p>
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




export default Sleep;