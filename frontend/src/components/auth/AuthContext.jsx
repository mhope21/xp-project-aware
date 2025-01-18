import React, { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { API_URL2 } from '../../constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('jwt');
      console.log("Retrieved token: ", token);
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp > now) {
            const response = await fetch(`${API_URL2}/current_user`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                  const data = await response.json();
                  setUser(data);
                  console.log("Current user data: ", data)
                  setLoggedIn(true);
                  console.log("Logged in: true")
                } else {
                  throw new Error('Invalid response format');
                }
            } else {
              handleUnauthorized();
            }
          } else {
            handleUnauthorized();
          }
        } catch (error) {
          console.error('Token decoding failed:', error);
          handleUnauthorized();
        }
      } else {
        console.log("No token found")
        handleUnauthorized();
      }
      setLoading(false);
    };

    const handleUnauthorized = () => {
      console.log("Handling unauthorized access")
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem('jwt');
      // Redirect only if on a protected route
      if (isProtectedRoute(location.pathname)) {
        console.log("Redirecting to login from: ", location.pathname);
        navigate("/login");
        }
    };

    const isProtectedRoute = (path) => { 
      const protectedRoutes = ["/authenticated"];
      const isProtected = protectedRoutes.some(route => path.startsWith(route));
      console.log("Is protected route: ", isProtected, "for path: ", path);
      return isProtected;
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const logout = () => {
    console.log("Logging out")
    setLoggedIn(false);
    setUser(null);
    localStorage.removeItem('jwt');
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, setLoggedIn, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};