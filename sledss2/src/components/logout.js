import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    alert('Logout successful');
    navigate('/'); // Redirect to login page
  };

  return (
    <div style={logoutContainer} onClick={handleLogout}>
      <LogOut size={30} color="white" style={iconStyle} />  
    </div>
  );
};

// Styles



const logoutContainer = {
  position: 'fixed',
  top: '10px',
  right: '1px',
  backgroundColor: '#0E5580',
  padding: '10px',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '30px',
  height: '30px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const iconStyle = {
  cursor: 'pointer',
};

export default Logout;
