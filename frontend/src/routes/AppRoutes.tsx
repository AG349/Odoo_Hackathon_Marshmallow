import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import { MainLayout } from '../components/layout/MainLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { OTP } from '../pages/auth/OTP';

// Core Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { EmployeeDirectory } from '../pages/admin/EmployeeDirectory';
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { EmployeeProfile } from '../pages/employee/EmployeeProfile';
import { Attendance } from '../pages/attendance/Attendance';
import { LeaveManagement } from '../pages/leave/LeaveManagement';
import { Payroll } from '../pages/payroll/Payroll';
import { Settings } from '../pages/settings/Settings';
import { NotFound } from '../pages/errors/NotFound';

// Dashboard role redirect router
const HomeRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'admin' 
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/employee/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OTP />} />

      {/* Main Core Dashboards (Protected inside MainLayout) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomeRedirect />} />
        
        {/* Admin Specific */}
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/employees" element={<EmployeeDirectory />} />
        
        {/* Employee Specific */}
        <Route path="employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="employee/profile" element={<EmployeeProfile />} />
        
        {/* Common Modules */}
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<LeaveManagement />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
export default AppRoutes;
