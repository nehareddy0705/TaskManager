import React, { useState, useEffect } from 'react';
import { ListTodo, CheckCircle, Clock, Percent } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getColors, commonStyles } from '../styles/theme';

const Stats = ({ tasksSummary = { total: 0, completed: 0, pending: 0 } }) => {
  const { total, completed, pending } = tasksSummary;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const { theme } = useTheme();
  const c = getColors(theme);

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = width <= 1024;
  const isMobile = width <= 640;

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? '1fr' 
        : isTablet 
          ? 'repeat(2, 1fr)' 
          : 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '30px',
    },
    card: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '20px 24px',
      backgroundColor: c.bgSecondary,
      border: `1px solid ${c.borderColor}`,
      borderRadius: '12px',
      boxShadow: commonStyles.shadowMd,
      transition: commonStyles.transition,
    },
    rateCard: {
      gridColumn: isMobile ? '1 / -1' : 'auto',
    },
    iconWrapper: (gradient, shadowColor) => ({
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      background: gradient,
      boxShadow: `0 4px 10px ${shadowColor}`,
    }),
    content: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    label: {
      fontSize: '0.85rem',
      fontWeight: 500,
      color: c.textSecondary,
    },
    value: {
      fontSize: '1.65rem',
      fontWeight: 700,
      fontFamily: commonStyles.fontHeading,
      lineHeight: 1.2,
      marginTop: '2px',
      color: c.textPrimary,
    },
    progressContainer: {
      width: '100%',
      height: '6px',
      backgroundColor: c.bgTertiary,
      borderRadius: '999px',
      marginTop: '8px',
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      background: 'linear-gradient(90deg, #ec4899, #db2777)',
      borderRadius: '999px',
      transition: 'width 0.4s ease-out',
    }
  };

  return (
    <div style={styles.grid}>
      <div 
        style={styles.card}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = commonStyles.shadowLg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = commonStyles.shadowMd;
        }}
      >
        <div style={styles.iconWrapper('linear-gradient(135deg, #6366f1, #4f46e5)', 'rgba(99, 102, 241, 0.2)')}>
          <ListTodo size={24} />
        </div>
        <div style={styles.content}>
          <span style={styles.label}>Total Tasks</span>
          <span style={styles.value}>{total}</span>
        </div>
      </div>

      <div 
        style={styles.card}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = commonStyles.shadowLg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = commonStyles.shadowMd;
        }}
      >
        <div style={styles.iconWrapper('linear-gradient(135deg, #f59e0b, #d97706)', 'rgba(245, 158, 11, 0.2)')}>
          <Clock size={24} />
        </div>
        <div style={styles.content}>
          <span style={styles.label}>Pending Tasks</span>
          <span style={styles.value}>{pending}</span>
        </div>
      </div>

      <div 
        style={styles.card}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = commonStyles.shadowLg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = commonStyles.shadowMd;
        }}
      >
        <div style={styles.iconWrapper('linear-gradient(135deg, #10b981, #059669)', 'rgba(16, 185, 129, 0.2)')}>
          <CheckCircle size={24} />
        </div>
        <div style={styles.content}>
          <span style={styles.label}>Completed Tasks</span>
          <span style={styles.value}>{completed}</span>
        </div>
      </div>

      <div 
        style={{ ...styles.card, ...styles.rateCard }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = commonStyles.shadowLg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = commonStyles.shadowMd;
        }}
      >
        <div style={styles.iconWrapper('linear-gradient(135deg, #ec4899, #db2777)', 'rgba(236, 72, 153, 0.2)')}>
          <Percent size={24} />
        </div>
        <div style={styles.content}>
          <span style={styles.label}>Completion Rate</span>
          <span style={styles.value}>{completionRate}%</span>
          <div style={styles.progressContainer}>
            <div 
              style={{ ...styles.progressBar, width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
