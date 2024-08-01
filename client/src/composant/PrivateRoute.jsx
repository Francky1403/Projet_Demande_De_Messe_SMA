import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = window.localStorage.getItem('userAcces');

  if (!token) {
    return <Navigate to="/Login-Admin" />;
  }

  return children;
};

export default PrivateRoute;
