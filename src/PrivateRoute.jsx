import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import AuthService from './services/authService';

const PrivateRoute = () => {
  const navigate = useNavigate();
  
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  return <Outlet />;
};

export default PrivateRoute;

