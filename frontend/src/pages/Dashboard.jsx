import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Stats from '../components/Stats';
import Filters from '../components/Filters';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, Inbox } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getColors, commonStyles } from '../styles/theme';

const Dashboard = () => {
  const { theme } = useTheme();
  const c = getColors(theme);

  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt:desc');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = width <= 1024;
  const isMobile = width <= 640;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [status, priority, sortBy]);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/tasks', {
        params: {
          search: debouncedSearch,
          status,
          priority,
          sortBy,
          page: currentPage,
          limit: 6,
        },
      });

      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
      setSummary(response.data.summary || { total: 0, completed: 0, pending: 0 });
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err.response?.data?.message || 'Failed to retrieve tasks.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, priority, sortBy, currentPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle toggle task status
  const handleToggleStatus = async (task) => {
    const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      setTasks(prevTasks =>
        prevTasks.map(t => (t._id === task._id ? { ...t, status: updatedStatus } : t))
      );
      
      await api.put(`/tasks/${task._id}`, { status: updatedStatus });
      const response = await api.get('/tasks', {
        params: {
          search: debouncedSearch,
          status,
          priority,
          sortBy,
          page: currentPage,
          limit: 6,
        },
      });
      setSummary(response.data.summary);
    } catch (err) {
      console.error('Toggle status error:', err);
      fetchTasks();
    }
  };

  const handleAddTaskClick = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }
      setIsTaskModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error('Task submit error:', err);
      alert(err.response?.data?.message || 'Failed to save task.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingTaskId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/tasks/${deletingTaskId}`);
      setIsConfirmModalOpen(false);
      setDeletingTaskId(null);
      if (tasks.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchTasks();
      }
    } catch (err) {
      console.error('Delete task error:', err);
      alert(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const styles = {
    main: {
      paddingBottom: '60px',
      maxWidth: '1200px',
      margin: '0 auto',
      paddingLeft: '24px',
      paddingRight: '24px',
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
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? '1fr' 
        : isTablet 
          ? 'repeat(2, 1fr)' 
          : 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '35px',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 40px',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '40px auto',
      backgroundColor: c.bgSecondary,
      border: `1px solid ${c.borderColor}`,
      borderRadius: '12px',
      boxShadow: commonStyles.shadowMd,
    },
    emptyIconBox: {
      backgroundColor: c.bgTertiary,
      color: c.textMuted,
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    emptyTitle: {
      fontSize: '1.3rem',
      fontWeight: 700,
      fontFamily: commonStyles.fontHeading,
      marginBottom: '8px',
      color: c.textPrimary,
    },
    emptyText: {
      color: c.textSecondary,
      fontSize: '0.9rem',
      marginBottom: '24px',
      maxWidth: '400px',
    },
    skeletonLoader: {
      height: '150px',
      display: 'flex',
      gap: '16px',
      backgroundColor: c.bgSecondary,
      border: `1px solid ${c.borderColor}`,
      borderRadius: '12px',
      padding: '20px',
      animation: 'pulse 1.5s infinite',
    },
    skeletonCheckbox: {
      width: '22px',
      height: '22px',
      borderRadius: '6px',
      backgroundColor: c.bgTertiary,
      flexShrink: 0,
    },
    skeletonTextBlock: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    skeletonTitle: {
      width: '60%',
      height: '16px',
      backgroundColor: c.bgTertiary,
      borderRadius: '4px',
    },
    skeletonDesc: {
      width: '85%',
      height: '14px',
      backgroundColor: c.bgTertiary,
      borderRadius: '4px',
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '30px',
    },
    btnPagination: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.85rem',
      padding: '8px 14px',
      backgroundColor: c.bgTertiary,
      color: c.textPrimary,
      border: `1px solid ${c.borderColor}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: commonStyles.transition,
      outline: 'none',
      fontWeight: 500,
    },
    pageNumbers: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    pageNumBtn: (isActive) => ({
      width: '36px',
      height: '36px',
      padding: 0,
      fontSize: '0.85rem',
      fontWeight: 500,
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: isActive ? 'none' : `1px solid ${c.borderColor}`,
      backgroundColor: isActive ? c.accent : c.bgTertiary,
      color: isActive ? 'white' : c.textPrimary,
      transition: commonStyles.transition,
      outline: 'none',
    })
  };

  return (
    <main style={styles.main}>
      <Stats tasksSummary={summary} />

      <Filters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddTaskClick={handleAddTaskClick}
      />

      {error && (
        <div style={styles.alert}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={styles.skeletonLoader}>
              <div style={styles.skeletonCheckbox}></div>
              <div style={styles.skeletonTextBlock}>
                <div style={styles.skeletonTitle}></div>
                <div style={styles.skeletonDesc}></div>
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIconBox}>
            <Inbox size={48} />
          </div>
          <h3 style={styles.emptyTitle}>No tasks found</h3>
          <p style={styles.emptyText}>
            {debouncedSearch || status !== 'all' || priority !== 'all'
              ? "We couldn't find any tasks matching your filters. Try adjusting them."
              : 'You have no tasks scheduled yet. Start by creating a task now.'}
          </p>
          {(debouncedSearch || status !== 'all' || priority !== 'all') ? (
            <button 
              onClick={() => { setSearch(''); setStatus('all'); setPriority('all'); }} 
              style={styles.btnPagination}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.borderColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.bgTertiary}
            >
              Reset Filters
            </button>
          ) : (
            <button 
              onClick={handleAddTaskClick} 
              style={{
                ...styles.btnPagination,
                backgroundColor: c.accent,
                color: 'white',
                border: 'none',
                padding: '10px 18px',
              }}
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
              <Plus size={18} />
              <span>Add Your First Task</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  ...styles.btnPagination,
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) e.currentTarget.style.backgroundColor = c.borderColor;
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) e.currentTarget.style.backgroundColor = c.bgTertiary;
                }}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>
              
              <div style={styles.pageNumbers}>
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  const isActive = currentPage === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      style={styles.pageNumBtn(isActive)}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = c.borderColor;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = c.bgTertiary;
                      }}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  ...styles.btnPagination,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = c.borderColor;
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = c.bgTertiary;
                }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        task={editingTask}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to permanently remove this task? This action cannot be undone."
      />
    </main>
  );
};

export default Dashboard;
