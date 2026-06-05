import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CheckSquare, User, Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { getColors, commonStyles } from '../styles/theme';

const Register = ({ onNavigate }) => {
  const { register } = useAuth();
  const { theme } = useTheme();
  const c = getColors(theme);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    wrapper: {
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    card: {
      width: '100%',
      maxWidth: '440px',
      borderRadius: '16px',
      padding: '40px 30px',
      backgroundColor: c.bgSecondary,
      border: `1px solid ${c.borderColor}`,
      boxShadow: commonStyles.shadowXl,
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    logo: {
      width: '54px',
      height: '54px',
      borderRadius: '14px',
      background: `linear-gradient(135deg, ${c.accent}, ${c.accentHover})`,
      color: 'white',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
    },
    headerTitle: {
      fontSize: '1.75rem',
      fontWeight: 700,
      fontFamily: commonStyles.fontHeading,
      marginBottom: '8px',
      color: c.textPrimary,
    },
    headerSub: {
      color: c.textSecondary,
      fontSize: '0.9rem',
    },
    alert: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: c.dangerLight,
      color: c.danger,
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '0.85rem',
      marginBottom: '24px',
      border: `1px solid rgba(239, 68, 68, 0.2)`,
    },
    formGroup: {
      marginBottom: '20px',
      position: 'relative',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '6px',
      color: c.textSecondary,
    },
    inputBox: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: c.textMuted,
      pointerEvents: 'none',
      transition: commonStyles.transition,
    },
    control: (hasError) => ({
      width: '100%',
      padding: '12px 16px 12px 44px',
      fontFamily: commonStyles.fontBody,
      fontSize: '0.95rem',
      backgroundColor: c.bgTertiary,
      border: `1px solid ${hasError ? c.danger : c.borderColor}`,
      color: c.textPrimary,
      borderRadius: '8px',
      transition: commonStyles.transition,
      outline: 'none',
    }),
    btnBlock: {
      width: '100%',
      padding: '12px',
      fontSize: '0.95rem',
      marginTop: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: commonStyles.fontBody,
      fontWeight: 500,
      borderRadius: '8px',
      backgroundColor: c.accent,
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      transition: commonStyles.transition,
      outline: 'none',
    },
    errorFeedback: {
      display: 'block',
      fontSize: '0.75rem',
      color: c.danger,
      marginTop: '5px',
      marginLeft: '2px',
    },
    footer: {
      marginTop: '24px',
      textAlign: 'center',
      fontSize: '0.9rem',
      color: c.textSecondary,
    },
    linkBtn: {
      background: 'none',
      border: 'none',
      color: c.accent,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'inherit',
      padding: 0,
      transition: commonStyles.transition,
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <CheckSquare style={{ strokeWidth: 2.5 }} size={32} />
          </div>
          <h2 style={styles.headerTitle}>Create Account</h2>
          <p style={styles.headerSub}>Join TaskFlow today and get organized</p>
        </div>

        {apiError && (
          <div style={styles.alert}>
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Full Name</label>
            <div style={styles.inputBox}>
              <User style={styles.inputIcon} size={18} id="name-icon-id" />
              <input
                type="text"
                id="name"
                name="name"
                style={styles.control(errors.name)}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                onFocus={(e) => {
                  e.target.style.borderColor = c.accent;
                  e.target.style.backgroundColor = c.bgSecondary;
                  e.target.style.boxShadow = `0 0 0 3px ${c.accentLight}`;
                  const icon = document.getElementById('name-icon-id');
                  if (icon) icon.style.color = c.accent;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.name ? c.danger : c.borderColor;
                  e.target.style.backgroundColor = c.bgTertiary;
                  e.target.style.boxShadow = 'none';
                  const icon = document.getElementById('name-icon-id');
                  if (icon) icon.style.color = c.textMuted;
                }}
              />
            </div>
            {errors.name && <span style={styles.errorFeedback}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <div style={styles.inputBox}>
              <Mail style={styles.inputIcon} size={18} id="mail-icon-id" />
              <input
                type="email"
                id="email"
                name="email"
                style={styles.control(errors.email)}
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                onFocus={(e) => {
                  e.target.style.borderColor = c.accent;
                  e.target.style.backgroundColor = c.bgSecondary;
                  e.target.style.boxShadow = `0 0 0 3px ${c.accentLight}`;
                  const icon = document.getElementById('mail-icon-id');
                  if (icon) icon.style.color = c.accent;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? c.danger : c.borderColor;
                  e.target.style.backgroundColor = c.bgTertiary;
                  e.target.style.boxShadow = 'none';
                  const icon = document.getElementById('mail-icon-id');
                  if (icon) icon.style.color = c.textMuted;
                }}
              />
            </div>
            {errors.email && <span style={styles.errorFeedback}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <div style={styles.inputBox}>
              <Lock style={styles.inputIcon} size={18} id="lock-icon-id" />
              <input
                type="password"
                id="password"
                name="password"
                style={styles.control(errors.password)}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                onFocus={(e) => {
                  e.target.style.borderColor = c.accent;
                  e.target.style.backgroundColor = c.bgSecondary;
                  e.target.style.boxShadow = `0 0 0 3px ${c.accentLight}`;
                  const icon = document.getElementById('lock-icon-id');
                  if (icon) icon.style.color = c.accent;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? c.danger : c.borderColor;
                  e.target.style.backgroundColor = c.bgTertiary;
                  e.target.style.boxShadow = 'none';
                  const icon = document.getElementById('lock-icon-id');
                  if (icon) icon.style.color = c.textMuted;
                }}
              />
            </div>
            {errors.password && <span style={styles.errorFeedback}>{errors.password}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
            <div style={styles.inputBox}>
              <Lock style={styles.inputIcon} size={18} id="confirm-icon-id" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                style={styles.control(errors.confirmPassword)}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                onFocus={(e) => {
                  e.target.style.borderColor = c.accent;
                  e.target.style.backgroundColor = c.bgSecondary;
                  e.target.style.boxShadow = `0 0 0 3px ${c.accentLight}`;
                  const icon = document.getElementById('confirm-icon-id');
                  if (icon) icon.style.color = c.accent;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.confirmPassword ? c.danger : c.borderColor;
                  e.target.style.backgroundColor = c.bgTertiary;
                  e.target.style.boxShadow = 'none';
                  const icon = document.getElementById('confirm-icon-id');
                  if (icon) icon.style.color = c.textMuted;
                }}
              />
            </div>
            {errors.confirmPassword && <span style={styles.errorFeedback}>{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            style={styles.btnBlock}
            disabled={isSubmitting}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = c.accentHover;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = c.accent;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {isSubmitting ? (
              <Loader style={{ animation: 'spin 1s linear infinite' }} size={18} />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={() => onNavigate('login')}
            style={styles.linkBtn}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
