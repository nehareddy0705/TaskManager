import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getColors, commonStyles } from '../styles/theme';

const Filters = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  onAddTaskClick,
}) => {
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
    container: {
      display: 'flex',
      flexDirection: isTablet ? 'column' : 'row',
      alignItems: isTablet ? 'stretch' : 'center',
      justifyContent: 'space-between',
      gap: '20px',
      padding: '16px 20px',
      marginBottom: '24px',
      backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: `1px solid ${c.borderColor}`,
      borderRadius: '12px',
      boxShadow: commonStyles.shadowMd,
    },
    searchBox: {
      position: 'relative',
      flexGrow: 1,
      maxWidth: isTablet ? 'none' : '380px',
    },
    searchIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: c.textMuted,
      pointerEvents: 'none',
    },
    searchInput: {
      paddingLeft: '42px',
      width: '100%',
      padding: '12px 16px 12px 42px',
      fontFamily: commonStyles.fontBody,
      fontSize: '0.95rem',
      backgroundColor: c.bgTertiary,
      border: `1px solid ${c.borderColor}`,
      color: c.textPrimary,
      borderRadius: '8px',
      transition: commonStyles.transition,
      outline: 'none',
    },
    controlsBox: {
      display: isMobile ? 'grid' : 'flex',
      gridTemplateColumns: isMobile ? '1fr' : 'none',
      alignItems: 'center',
      justifyContent: isTablet ? 'space-between' : 'flex-end',
      gap: '16px',
      flexWrap: 'wrap',
    },
    filterItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isMobile ? 'space-between' : 'flex-start',
      gap: '8px',
    },
    label: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: c.textSecondary,
      whiteSpace: 'nowrap',
    },
    selectControl: {
      padding: '8px 12px',
      fontSize: '0.85rem',
      backgroundColor: c.bgTertiary,
      border: `1px solid ${c.borderColor}`,
      color: c.textPrimary,
      borderRadius: '8px',
      cursor: 'pointer',
      minWidth: isMobile ? '70%' : '130px',
      outline: 'none',
      fontFamily: commonStyles.fontBody,
    },
    addTaskBtn: {
      fontSize: '0.85rem',
      padding: '9px 16px',
      width: isMobile ? '100%' : 'auto',
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
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <Search style={styles.searchIcon} size={18} />
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      <div style={styles.controlsBox}>
        <div style={styles.filterItem}>
          <label htmlFor="status-select" style={styles.label}>Status</label>
          <select
            id="status-select"
            style={styles.selectControl}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div style={styles.filterItem}>
          <label htmlFor="priority-select" style={styles.label}>Priority</label>
          <select
            id="priority-select"
            style={styles.selectControl}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={styles.filterItem}>
          <label htmlFor="sort-select" style={styles.label}>Sort By</label>
          <select
            id="sort-select"
            style={styles.selectControl}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="dueDate:asc">Due Date (Soonest)</option>
            <option value="dueDate:desc">Due Date (Furthest)</option>
            <option value="title:asc">Alphabetical (A-Z)</option>
          </select>
        </div>

        <button 
          onClick={onAddTaskClick} 
          style={styles.addTaskBtn}
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
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'none';
          }}
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
};

export default Filters;
