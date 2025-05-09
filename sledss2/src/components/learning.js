import React from 'react';
import { useNavigate } from 'react-router-dom';
import image from './images/learning.png';
import Literacy from './literacy';

const Learning = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/literacy');
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>Learning</h1>
        <div style={styles.content}>
          <div style={styles.textSection}>
            <h2 style={styles.subtitle}>More information*</h2>
            <p style={styles.description}>
            Staying mentally active is key to preserving
 cognitive health as we age, but abilities like
 memory and attention may decline over time.
 Early assessment helps identify changes and
 support lifelong mental sharpness.
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
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#D38F5D',
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
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '15px'
  },
  description: {
    fontSize: '20px',
    color: '#4B5563',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  button: {
    backgroundColor: '#D38F5D',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: '20px',
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

export default Learning;
