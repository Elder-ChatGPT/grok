import React from 'react';
import { useNavigate } from 'react-router-dom';
import image from './images/exercise.jpeg';

function Exercise() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/exerciseactivity');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💪 Exercise</h1>
        <div style={styles.inner}>
          <div style={styles.textSection}>
            <h2 style={styles.subtitle}>Why Physical Activity Matters</h2>
            <p style={styles.description}>
              Physical activity boosts energy, improves mood, and prevents decline as we age. Regular exercise reduces the risk of chronic conditions like heart disease and strengthens the body and mind. Let’s begin by evaluating how active your lifestyle is.
            </p>
            <div style={styles.button} onClick={handleClick}>
              🏃 Start Your Evaluation
            </div>
          </div>
          <div style={styles.imageContainer}>
            <img src={image} alt="Exercise illustration" style={styles.image} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: '#fff',
    maxWidth: '1000px',
    width: '100%',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#E8C547',
    marginBottom: '30px',
    textAlign: 'center',
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    gap: '40px',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textSection: {
    flex: 1,
    minWidth: '300px',
  },
  subtitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '15px',
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.7',
    color: '#4B5563',
    marginBottom: '25px',
  },
  button: {
    backgroundColor: '#E8C547',
    color: '#fff',
    padding: '14px 30px',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-block',
    transition: 'transform 0.2s, background 0.3s',
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '250px',
  },
  image: {
    width: '100%',
    maxWidth: '320px',
    height: 'auto',
    borderRadius: '16px',
    objectFit: 'cover',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  }
};

export default Exercise;