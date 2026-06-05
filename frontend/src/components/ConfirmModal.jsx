import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getColors, commonStyles } from '../styles/theme';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message = 'This action cannot be undone.' }) => {
  const { theme } = useTheme();
  const c = getColors(theme);

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease-out',
    },
    content: {
      backgroundColor: c.bgSecondary,
      border: `1px solid ${c.borderColor}`,
      borderRadius: '16px',
      width: '100%',
      maxWidth: '400px',
      padding: '30px 24px',
      boxShadow: commonStyles.shadowXl,
      position: 'relative',
      textAlign: 'center',
      margin: '20px',
    },
    closeBtn: {
      position: 'absolute',
      right: '20px',
      top: '20px',
      background: 'none',
      border: 'none',
      color: c.textSecondary,
      cursor: 'pointer',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: commonStyles.transition,
      outline: 'none',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '12px',
    },
    warningIconBox: {
      backgroundColor: c.dangerLight,
      color: c.danger,
      width: '58px',
      height: '58px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      fontSize: '1.25rem',
      fontWeight: 700,
      fontFamily: commonStyles.fontHeading,
      color: c.textPrimary,
    },
    bodyText: {
      color: c.textSecondary,
      fontSize: '0.9rem',
      lineHeight: 1.5,
      marginBottom: '24px',
    },
    actions: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
    },
    btnSecondary: {
      flex: 1,
      backgroundColor: c.bgTertiary,
      color: c.textPrimary,
      border: `1px solid ${c.borderColor}`,
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '0.875rem',
      transition: commonStyles.transition,
      outline: 'none',
    },
    btnDanger: {
      flex: 1,
      backgroundColor: c.danger,
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '0.875rem',
      transition: commonStyles.transition,
      outline: 'none',
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <button 
          style={styles.closeBtn} 
          onClick={onClose} 
          aria-label="Close modal"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.bgTertiary}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={20} />
        </button>

        <div style={styles.header}>
          <div style={styles.warningIconBox}>
            <AlertTriangle size={28} />
          </div>
          <h3 style={styles.titleText}>{title}</h3>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={styles.bodyText}>{message}</p>
        </div>

        <div style={styles.actions}>
          <button 
            onClick={onClose} 
            style={styles.btnSecondary}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.borderColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.bgTertiary}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            style={styles.btnDanger}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = c.danger;
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
