import React, { useState, useEffect } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getColors, commonStyles } from '../styles/theme';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState({});
  const { theme } = useTheme();
  const c = getColors(theme);

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width <= 640;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status || 'pending',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        status: 'pending',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

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
      maxWidth: '500px',
      padding: '28px',
      boxShadow: commonStyles.shadowXl,
      position: 'relative',
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
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
    },
    logoIcon: {
      color: c.accent,
      strokeWidth: 2.5,
    },
    titleText: {
      fontSize: '1.4rem',
      fontWeight: 700,
      fontFamily: commonStyles.fontHeading,
      color: c.textPrimary,
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
    control: (hasError) => ({
      width: '100%',
      padding: '12px 16px',
      fontFamily: commonStyles.fontBody,
      fontSize: '0.95rem',
      backgroundColor: c.bgTertiary,
      border: `1px solid ${hasError ? c.danger : c.borderColor}`,
      color: c.textPrimary,
      borderRadius: '8px',
      transition: commonStyles.transition,
      outline: 'none',
    }),
    formRow: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '16px',
    },
    flex1: {
      flex: 1,
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '28px',
      borderTop: `1px solid ${c.borderColor}`,
      paddingTop: '20px',
    },
    btnSecondary: {
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
    btnPrimary: {
      backgroundColor: c.accent,
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '0.875rem',
      transition: commonStyles.transition,
      outline: 'none',
    },
    errorFeedback: {
      display: 'block',
      fontSize: '0.75rem',
      color: c.danger,
      marginTop: '5px',
      marginLeft: '2px',
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
          <CheckSquare style={styles.logoIcon} size={24} />
          <h2 style={styles.titleText}>{task ? 'Edit Task' : 'Create Task'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="task-title">Title</label>
            <input
              type="text"
              id="task-title"
              name="title"
              style={styles.control(errors.title)}
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={handleChange}
              autoFocus
              onFocus={(e) => {
                e.target.style.borderColor = c.accent;
                e.target.style.backgroundColor = c.bgSecondary;
                e.target.style.boxShadow = `0 0 0 3px ${c.accentLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.title ? c.danger : c.borderColor;
                e.target.style.backgroundColor = c.bgTertiary;
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.title && <span style={styles.errorFeedback}>{errors.title}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              name="description"
              style={{ ...styles.control(false), resize: 'none' }}
              placeholder="Add more details about this task..."
              value={formData.description}
              onChange={handleChange}
              rows="3"
              onFocus={(e) => {
                e.target.style.borderColor = c.accent;
                e.target.style.backgroundColor = c.bgSecondary;
                e.target.style.boxShadow = `0 0 0 3px ${c.accentLight}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = c.borderColor;
                e.target.style.backgroundColor = c.bgTertiary;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={styles.formRow}>
            <div style={{ ...styles.formGroup, ...styles.flex1 }}>
              <label style={styles.label} htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                name="priority"
                style={styles.control(false)}
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div style={{ ...styles.formGroup, ...styles.flex1 }}>
              <label style={styles.label} htmlFor="task-duedate">Due Date</label>
              <input
                type="date"
                id="task-duedate"
                name="dueDate"
                style={styles.control(false)}
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {task && (
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="task-status">Status</label>
              <select
                id="task-status"
                name="status"
                style={styles.control(false)}
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          <div style={styles.actions}>
            <button 
              type="button" 
              onClick={onClose} 
              style={styles.btnSecondary}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.borderColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.bgTertiary}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={styles.btnPrimary}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = c.accentHover;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = c.accent;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
