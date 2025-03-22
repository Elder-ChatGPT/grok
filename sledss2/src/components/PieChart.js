import React from "react";
import "./PieChart.css";

const PieChart = () => {
  return (
    <div className="pie-chart">
      <div className="section-label socialization">
      <a style={{color:"black"}} href="http://localhost:3000/socialization" target="_blank">
      Socialization 
      </a>
      </div>
      <div className="section-label learning">
      <a style={{color:"black"}} href="http://localhost:3000/learning" target="_blank" >
      Learning 
      </a>
      </div>
      <div className="section-label exercise">
      <a style={{color:"black"}} href="http://localhost:3000/exercise" target="_blank">
      Exercise 
      </a>
      </div>
      <div className="section-label diet">
      <a style={{color:"black"}} href="http://localhost:3000/diet" target="_blank">
      Diet 
      </a>
      </div>
      <div className="section-label stress">
      <a style={{color:"black"}} href="http://localhost:3000/stress" target="_blank">
      Stress 
      </a>
      </div>
      <div className="section-label sleep">
      <a style={{color:"black"}} href="http://localhost:3000/sleep" target="_blank">
      Sleep
      </a>
      </div>
      <div className="center">SLEDSS</div>
    </div>
  );
};

export default PieChart;

