import React from 'react';
import { useNavigate } from 'react-router-dom';
import image from './images/sleep.png';

const Sleep = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/pitt');
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>Sleep</h1>
        <div style={styles.content}>
          <div style={styles.textSection}>
            <h2 style={styles.subtitle}>More information*</h2>
            <p style={styles.description}>
          Sleep is vital for good health, but aging can
 bring sleep difficulties that affect energy,
 memory, and quality of life. Early awareness
 can lead to better rest—starting with a simple
 assessment of your sleep habits.
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
    color: '#A685E2',
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
    backgroundColor: '#A685E2',
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

export default Sleep;




