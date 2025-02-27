import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Style3.css'; // Import CSS file

const forums = [
  {
    name: "Socialization",
    description: "This test evaluates your social engagement and interactions.",
    testUrl: "https://artemciy.gitlab.io/loneliness-scale/#/"
  },
  {
    name: "Learning",
    description: "Assess your cognitive engagement and learning habits.",
    testUrl: "https://www.lumosity.com/en/"
  },
  {
    name: "Exercise",
    description: "Measure your physical activity levels and fitness.",
    testUrl: "https://yumuuv.com/blog/physical-activity-level-calculator"
  },
  {
    name: "Diet",
    description: "Evaluate your nutrition and eating habits.",
    testUrl: "https://guthealth.org/free-gut-health-quiz/"
  },
  {
    name: "Stress",
    description: "Determine your stress levels and coping mechanisms.",
    testUrl: "https://www.thorne.com/products/dp/stress-test?gad_source=1&gclid=EAIaIQobChMIsueru4HthQMVnnJHAR0bWg69EAAYAiAAEgI6QvD_BwE"
  },
  {
    name: "Sleep",
    description: "Analyze your sleep quality and habits.",
    testUrl: "https://shop.sleepon.us/products/go2sleep-ai-powered-device-for-restful-sleep?utm_source=google&utm_medium=cpc&utm_campaign=18872972137&gad_source=1&gclid=EAIaIQobChMIxsbJtoDthQMVhEVHAR3QlwFEEAAYASAAEgISRfD_BwE"
  }
];

const About3 = () => {
  const navigate = useNavigate();

  return (
    <div className="forum-container">
      <h2 className="forum-title">Forum Tests</h2>
      <p className="forum-description">
        Take tests in different forums to assess your well-being. Click "Take the Test" to get your score and "Paste All Your Scores" to submit it.
      </p>
      
      {/* Sticky button container for score submission */}
      <div className="score-button-container">
        <button className="score-button" onClick={() => window.open('/about1', '_blank')}>
          Paste All Your Scores
        </button>
      </div>
      
      {forums.map((forum, index) => (
        <div key={index} className="forum-card">
          <h3 className="forum-name">{forum.name} Test</h3>
          <p className="forum-info">{forum.description}</p>
          <div className="button-group">
            <a href={forum.testUrl} target="_blank" rel="noopener noreferrer" className="test-button">
              Take The Test And Paste Your Score.
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default About3;
