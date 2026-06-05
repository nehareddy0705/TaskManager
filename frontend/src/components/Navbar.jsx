import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, CheckSquare } from 'lucide-react';
import { getColors, commonStyles } from '../styles/theme';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const c = getColors(theme);

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width <= 640;

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const styles = {
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: `1px solid ${c.borderColor}`,
      backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      transition: commonStyles.transition,
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoBox: {
      background: `linear-gradient(135deg, ${c.accent}, ${c.accentHover})`,
      color: 'white',
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
    },
    brandText: {
      fontFamily: commonStyles.fontHeading,
      fontSize: '1.35rem',
      fontWeight: 800,
      background: `linear-gradient(135deg, ${c.textPrimary}, ${c.textSecondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '10px' : '18px',
    },
    themeToggle: {
      background: 'none',
      border: 'none',
      color: c.textSecondary,
      cursor: 'pointer',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: commonStyles.transition,
      outline: 'none',
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    avatar: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
      color: 'white',
      fontWeight: 600,
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    userName: {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: c.textSecondary,
      display: isMobile ? 'none' : 'block',
    },
    logoutBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'transparent',
      border: `1px solid ${c.borderColor}`,
      color: c.textSecondary,
      padding: isMobile ? '8px' : '8px 14px',
      borderRadius: '8px',
      fontSize: '0.85rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: commonStyles.transition,
      outline: 'none',
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <div style={styles.logoBox}>
            <CheckSquare style={{ strokeWidth: 2.5 }} size={24} />
          </div>
          <span style={styles.brandText}>TaskFlow</span>
        </div>

        {user && (
          <div style={styles.actions}>
            <button 
              onClick={toggleTheme} 
              style={styles.themeToggle}
              aria-label="Toggle theme"
              onMouseEnter={(e) => e.target.style.backgroundColor = c.bgTertiary}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div style={styles.userProfile}>
              <div style={styles.avatar} title={user.name}>
                {getInitials(user.name)}
              </div>
              <span style={styles.userName}>{user.name}</span>
            </div>

            <button 
              onClick={logout} 
              style={styles.logoutBtn} 
              title="Logout"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = c.dangerLight;
                e.currentTarget.style.color = c.danger;
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = c.textSecondary;
                e.currentTarget.style.borderColor = c.borderColor;
              }}
            >
              <LogOut size={18} />
              {!isMobile && <span>Logout</span>}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
