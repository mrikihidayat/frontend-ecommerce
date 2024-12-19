import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserSession } from '../utils/utils'; 

const ProtectedRoute = ({ allowedRole }) => {
  const session = getUserSession();

  if (!session) {
    return <Navigate to="/login" />;
  }

  if (session.role !== allowedRole) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
