import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem('authToken');
  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem('authToken');
  const role = localStorage.getItem("role") || sessionStorage.getItem('role');
  
  // Not authenticated at all - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'ADMIN') {
    return <Navigate to="/not-found" replace />;
  }
  
  return <Outlet />;
};

const ManagerRoute = () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem('authToken');
  const role = localStorage.getItem("role") || sessionStorage.getItem('role');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if ( role !== 'MANAGER') {
    return <Navigate to="/not-found" replace />;
  }
  
  return <Outlet />;
};




export { PrivateRoute, AdminRoute, ManagerRoute };