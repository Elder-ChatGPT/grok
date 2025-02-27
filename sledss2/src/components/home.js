import React from "react";
import PieChart from './PieChart';



const Home = () => {
  return (
<div>
<div style={flexcontainer}>
      <div style={flexcolumn}>
        <h2><div><span style={{color:"Turquoise",fontSize:35}}>S.</span>
        <span style={{fontSize:20}}></span>
        <span style={{color:"Turquoise",fontSize:35}}>L.</span>
        <span style={{fontSize:20}}></span>
        <span style={{color:"Turquoise",fontSize:35}}>E.</span>
        <span style={{fontSize:20}}></span>
        <span style={{color:"Turquoise",fontSize:35}}>D.</span>
        <span style={{fontSize:20}}></span>
        <span style={{color:"Turquoise",fontSize:35}}>S.</span>
        <span style={{fontSize:20}}></span>
        <span style={{color:"Turquoise",fontSize:35}}>S</span>
        <span style={{fontSize:20}}></span>
        <span style={{color:"red",fontSize:35}}>*</span>
        </div>
        
        </h2>
        <div><span style={{color:"red",fontSize:25}}>S</span>
        <span style={{fontSize:15}}>ocialization</span>
        </div><br></br><br></br>
        <div><span style={{color:"red",fontSize:25}}>L</span>
        <span style={{fontSize:15}}>earning</span>
        </div><br></br><br></br>
        <div><span style={{color:"red",fontSize:25}}>E</span>
        <span style={{fontSize:15}}>xercise</span>
        </div><br></br><br></br>
        <div><span style={{color:"red",fontSize:25}}>D</span>
        <span style={{fontSize:15}}>iet</span>
        </div><br></br><br></br>
        <div><span style={{color:"red",fontSize:25}}>S</span>
        <span style={{fontSize:15}}>tress</span>
        </div><br></br><br></br>
        <div><span style={{color:"red",fontSize:25}}>S</span>
        <span style={{fontSize:15}}>leep</span>
        </div>
       
      </div>
      <div style={flexcolumn}>
        <h2></h2>
        <p>Please click on the forum names in the pie to findout more about each forum of S.L.E.D.S.S</p>
        <p><PieChart /></p>
      </div>
      <div style={flexcolumn}>
        <h2>What is S.L.E.D.S.S? </h2>
        <p>S.L.E.D.S.S.
        stands for Socialization, Learning, Exercise, Diet, Stress, and Sleep. 
        Coined by Dr. Rudy Tanzi, a Professor of Neurology at Harvard University and Massachusetts General Hospital. 
        Also, studied and published by Dr. Dean Ornish at UCSF.
         Make healthy lifestyle choices, and then go back and retake a Cognitive Test to see how you are doing. 
         Together with family and friends make healthy lifestyle choices, then go back and measure how your cognitive health has improved. 
         You can also join support groups to learn from their selections.
          Finally, you can avail yourself of Cognitive Behavioral Therapies (CBTs) to combat stress, anxiety, or depression. </p>
      </div>  
    </div>
    </div>
  );
};

const bodyStyle = {
  backgroundColor: "#f5f5f5",
  padding: "5px",
  minHeight: "25vh",
  display: "flex",
  justifyContent: "centre",
  alignItems: "centre",
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "20px",
};

const flexcontainer = {
  backgroundColor: "white",
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
}

const flexcolumn ={
  flex:"1",
  padding:"50px",
  backgroundColor:"",
  color:"",
  borderradius:"20px",
  boxshadow:"0 4px 6px rgba(0, 0, 0, 0.1)",
  maxwidth:"30%",

}








export default Home;
