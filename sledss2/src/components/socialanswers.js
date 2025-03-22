import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const SocialAnswers = () => {
    const [score, setScore] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userID'); // Retrieve user ID

    useEffect(() => {
        const fetchScore = async () => {
            if (!userId) return;

            try {
                const response = await axios.get(`http://184.168.29.119:5009/social-score/${userId}`);
                setScore(response.data.score);
            } catch (error) {
                console.error('Error fetching loneliness score:', error);
                setScore('N/A'); // Handle errors gracefully
            }
        };

        fetchScore();
    }, [userId]);

    const data = [
        { name: 'Score', value: score !== null && score !== 'N/A' ? score : 0, fill: '#4ad9e4' },
        { name: 'Max', value: 11, fill: '#89f0f0' }
    ];

    return (
        <div style={styles.pageContainer}>
            <div style={styles.resultsContainer}>
                <h1 style={styles.header}>Your Social Score</h1>
                <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart cx="50%" cy="100%" innerRadius="70%" outerRadius="100%" startAngle={180} endAngle={0} barSize={20} data={data}>
                        <RadialBar minAngle={15} background clockWise dataKey="value" />
                        <PolarAngleAxis type="number" domain={[0, 11]} angleAxisId={0} />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div style={styles.scoreDisplay}>
                    {score !== null && score !== 'N/A' ? score : ''}
                </div>
                <div style={styles.legend}>
                    <p>✅ Not Lonely: <strong>0–3</strong></p>
                    <p>😐 Moderately Lonely: <strong>4–8</strong></p>
                    <p>⚠️ Severely Lonely: <strong>9–10</strong></p>
                    <p>🚨 Very Severely Lonely: <strong>11</strong></p>
                </div>
            </div>
            <button style={styles.backButton} onClick={() => navigate('/evaluations')}>Back to Evaluations</button>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#ffffff',
        padding: '20px',
        flexDirection: 'row',
    },
    resultsContainer: {
        backgroundColor: '#1e466c',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        textAlign: 'center',
        width: '500px',
        height: '500px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    header: {
        color: '#2ecf80',
        fontSize: '1.5rem',
    },
    scoreDisplay: {
        fontSize: '1.7rem',
        fontWeight: 'bold',
        color: '#4ad9e4',
        marginTop: '-10px',
    },
    legend: {
        textAlign: 'center',
        marginTop: '10px',
        fontSize: '1rem',
    },
    backButton: {
        padding: '12px 15px',
        fontSize: '1rem',
        backgroundColor: '#2ecf80',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        position: 'absolute',
        right: '20px',
        bottom: '20px',
    }
};

export default SocialAnswers;

