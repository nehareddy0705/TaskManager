import React from 'react';
import { Calendar, Edit, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getColors, commonStyles } from '../styles/theme';

const TaskCard = ({ task, onToggleStatus, onEditClick, onDeleteClick }) => {
  const { title, description, status, priority, dueDate } = task;
  const isCompleted = status === 'completed';
  const { theme } = useTheme();
  const c = getColors(theme);

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDueDateStatus = (dateStr) => {
    if (!dateStr || isCompleted) return 'normal';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);

    if (due < today) return 'overdue';
    if (due.getTime() === today.getTime()) return 'today';
    return 'normal';
  };

  const dueStatus = getDueDateStatus(dueDate);
  const formattedDate = formatDate(dueDate);

  // Colors for priorities
  const priorityColors = {
    low: {
      bg: c.successLight,
      color: c.success,
    },
    medium: {
      bg: c.warningLight,
      color: c.warning,
    },
    high: {
      bg: c.dangerLight,
      color: c.danger,
    }
  };

  const styles = {
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px',
      minHeight: '150px',
      gap: '16px',
      backgroundColor: c.bgSecondary,
      border: `1px solid ${c.borderColor}`,
      borderLeft: `4px solid ${isCompleted ? c.success : c.accent}`,
      borderRadius: '12px',
      boxShadow: commonStyles.shadowMd,
      opacity: isCompleted ? 0.75 : 1,
      transition: commonStyles.transition,
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '4px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      marginRight: '12px',
    },
    checkmark: {
      height: '22px',
      width: '22px',
      border: `2px solid ${isCompleted ? c.success : c.textMuted}`,
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isCompleted ? c.success : 'transparent',
      transition: commonStyles.transition,
    },
    titleArea: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    title: {
      fontSize: '1.1rem',
      fontWeight: 600,
      fontFamily: commonStyles.fontHeading,
      color: isCompleted ? c.textMuted : c.textPrimary,
      textDecoration: isCompleted ? 'line-through' : 'none',
      lineHeight: 1.3,
      wordBreak: 'break-word',
    },
    desc: {
      fontSize: '0.85rem',
      color: c.textSecondary,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: `1px solid ${c.borderColor}`,
      paddingTop: '14px',
      gap: '10px',
    },
    metadata: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'capitalize',
      backgroundColor: priorityColors[priority]?.bg,
      color: priorityColors[priority]?.color,
    },
    dueBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.75rem',
      padding: '4px 8px',
      borderRadius: '6px',
      backgroundColor: dueStatus === 'overdue' 
        ? c.dangerLight 
        : dueStatus === 'today' 
          ? c.warningLight 
          : c.bgTertiary,
      color: dueStatus === 'overdue' 
        ? c.danger 
        : dueStatus === 'today' 
          ? c.warning 
          : c.textSecondary,
      fontWeight: ['overdue', 'today'].includes(dueStatus) ? 600 : 'normal',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    actionBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: c.textSecondary,
      transition: commonStyles.transition,
      outline: 'none',
    }
  };

  return (
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
      <div style={styles.header}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleStatus(task)}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          />
          <span style={styles.checkmark}>
            {isCompleted && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4.5L3.5 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
        </label>
        
        <div style={styles.titleArea}>
          <h3 style={styles.title} title={title}>{title}</h3>
          {description && <p style={styles.desc}>{description}</p>}
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.metadata}>
          <span style={styles.badge}>{priority}</span>
          
          {formattedDate && (
            <span style={styles.dueBadge}>
              {dueStatus === 'overdue' && <AlertTriangle size={14} />}
              {dueStatus === 'today' && <Clock size={14} />}
              {!['overdue', 'today'].includes(dueStatus) && <Calendar size={14} />}
              <span>
                {dueStatus === 'overdue' ? 'Overdue: ' : dueStatus === 'today' ? 'Due Today: ' : ''}
                {formattedDate}
              </span>
            </span>
          )}
        </div>

        <div style={styles.actions}>
          <button 
            onClick={() => onEditClick(task)} 
            style={styles.actionBtn}
            title="Edit Task"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.accentLight;
              e.currentTarget.style.color = c.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = c.textSecondary;
            }}
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDeleteClick(task._id)} 
            style={styles.actionBtn}
            title="Delete Task"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.dangerLight;
              e.currentTarget.style.color = c.danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = c.textSecondary;
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
