//import React from "react";
import React, { useState } from "react";
import image from "./images/a2.png";
const Learning = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ score: "", forumType: "" });

  return (
    <div style={containerStyle}>
      {/* First Row */}
      <div style={rowStyle}>
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle}>Learning</h2>
          <p style={wordStyle}>Lifelong learning plays a crucial role in maintaining cognitive health by stimulating neurogenesis (the formation of new neurons) and enhancing synaptic plasticity. Engaging in mental exercises such as reading, problem-solving, or acquiring new skills strengthens brain connections, delays cognitive decline, and improves memory retention. Learning also stimulates the production of brain-derived neurotrophic factor (BDNF), a protein essential for neuron survival.</p>
        </div>
        <div style={{ ...columnStyle, flex: 1 }}>
         
          <img src={image} alt="pic" style={imageStyle} />
        </div>
      </div>

      {/* Second Row */}
      <div style={rowStyle}>
        <div style={{ ...columnStyle, flex: 1 }}>
          <div style={smallButtonsContainerStyle}>
            <button style={smallButtonStyle}><a style={{textDecoration:"none",color:"white"}} href="https://youtu.be/V6m79zMpQzc">LEARNING VIDEO</a></button>
            
        </div>
          </div>
          
        <div style={{ ...columnStyle, flex: 2 }}>
          <h2 style={titleStyle}>MORE ABOUT LEARNING</h2>
          <p style={moreStyle}> Health Facts<br></br>

Cognitive Protection: Adults who engage in regular cognitive activities have a 30% lower risk of developing Alzheimer’s disease.
Brain Efficiency: Continuous learning increases the density of dendritic spines, which enhances information processing and memory retrieval.
Dementia Prevention: Studies show that learning a new language or playing a musical instrument can delay the onset of dementia by up to 5 years.
Mental Resilience: Challenging the brain with puzzles, reading, or problem-solving for at least 1 hour daily significantly reduces the risk of mild cognitive impairment (MCI). </p>
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




export default Learning;