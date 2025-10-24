import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import './App.css';

function PrivateRoute({ children, allowedRoles }) {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

function AppRoutes() {
  const { currentUser, userRole, logout } = useAuth();

  return (
    <div className="App">
      {currentUser && (
        <header className="app-header">
          <h1>Golf Leaderboard</h1>
          <div className="user-info">
            <span>{currentUser.email} ({userRole})</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </header>
      )}

      <main className="app-content">
        <Routes>
          <Route path="/login" element={
            currentUser ? <Navigate to="/" /> : <LoginScreen />
          } />

          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          <Route path="/" element={
            <PrivateRoute>
              {userRole === 'admin' ? (
                <Navigate to="/admin" />
              ) : (
                <OrganizerDashboard />
              )}
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
