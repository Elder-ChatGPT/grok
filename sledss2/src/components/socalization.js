import React from 'react';
import { useNavigate } from 'react-router-dom';
import image from './images/ruben15.png';

const Socialization = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/socialtest');
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>Socialization</h1>
        <div style={styles.content}>
          <div style={styles.textSection}>
            <h2 style={styles.subtitle}>More information*</h2>
            <p style={styles.description}>
              As social beings, our connections with others help us thrive. However, aging often leads to more isolation and loneliness, which can cause health issues like cognitive decline, depression, and heart disease. Thankfully, there are ways to combat these negative effects. Let’s start by assessing how connected you are to family and friends.
            </p>
            <div style={styles.button} onClick={handleClick}>
              Start Your Evaluation
            </div>
          </div>
          <div style={styles.imageContainer}>
            <img src={image} alt="Hands joined together" style={styles.image} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* CSS Styles */
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'white'
  },
  wrapper: {
    maxWidth: '900px',
    padding: '20px',
    backgroundColor: 'white'
  },
  title: {
    fontSize: '24px', // Increased font size here
    fontWeight: 'bold',
    color: '#B91C1C',
    marginBottom: '30px',
    textAlign: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textSection: {
    flex: 1,
    paddingRight: '20px'
  },
  subtitle: {
    fontSize: '20px', // Increased font size here
    fontWeight: '600',
    marginBottom: '15px'
  },
  description: {
    fontSize: '20px', // Increased font size here
    color: '#4B5563',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  button: {
    backgroundColor: '#B91C1C',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: '800',
    width: 'fit-content'
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '320px',
    height: '320px'
  }
};

export default Socialization;
