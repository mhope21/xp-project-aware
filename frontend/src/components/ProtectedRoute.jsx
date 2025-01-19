import React from 'react';
import { AuthContext } from './auth/AuthContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { loggedIn, loading } = useContext(AuthContext);
  console.log("ProtectedRoute loggedIn: ", loggedIn)

  if (loading) {
    return <div>Loading ...</div>
  }

  return loggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
