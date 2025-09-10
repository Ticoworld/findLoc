import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";

import ModernHome from "./pages/modernHome";
import AuthGate from "./pages/AuthGate";

const isAuthenticated = () => !!localStorage.getItem('findloc.token');

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AuthEventBridge = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handler = () => navigate('/login');
    window.addEventListener('auth:required', handler);
    return () => window.removeEventListener('auth:required', handler);
  }, [navigate]);
  return null;
};

const App = () => {
  return (
    <main id="app_main_cont">
      <BrowserRouter>
        <AuthEventBridge />
        <Routes>
          <Route path="/login" element={<AuthGate />} />
          <Route path="/" element={<ProtectedRoute><ModernHome /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><ModernHome /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default App;