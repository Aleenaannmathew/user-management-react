import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';





const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
      path="/admin/dashboard"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
    
  );
};

export default App;
