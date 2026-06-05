import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Loader } from 'lucide-react';

const AppContent = () => {
  const { user, token, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'register'

  if (loading) {
    return (
      <div className="app-loading">
        <Loader className="spinner" size={40} />
        <p>Loading TaskFlow...</p>
        <style>{`
          .app-loading {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            color: var(--text-secondary);
          }
          .spinner {
            color: var(--accent);
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Route protection
  if (user && token) {
    return (
      <>
        <Navbar />
        <Dashboard />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {currentPage === 'login' ? (
        <Login onNavigate={setCurrentPage} />
      ) : (
        <Register onNavigate={setCurrentPage} />
      )}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
