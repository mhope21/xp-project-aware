import React, { useState } from "react";
import { API_URL2 } from "../../constants";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

export default function Logout({ setLoggedIn, setUser }) {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Stretch Goal: Alert user to token expiration and allow auto re-login
  // Handles log out, fetches api with token and logs out of account. If there is no token, it redirects to login page. It also checks for token expiration.
  const handleLogout = async () => {
    const logoutUrl = `${API_URL2}/logout`
    const jwt = localStorage.getItem('jwt');
    console.log(jwt)

    if (!jwt) {
      alert('You are already logged out or your session has expired.');
      setLoggedIn(false);
      setUser(null);
      navigate('/login')
      return;
    }

    try {

      // Decode the token to check expiration
      const decoded = jwtDecode(jwt);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        navigate('/login');
        return;
      }
        const response = await fetch(logoutUrl, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
        });

      if (response.ok) {
        alert('Logged out successfully.');
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        setUser(null);
        
        console.log("Logout successful.")

      } else {
        const message = response.json();
        setErrorMessage(message.error.message);
        console.error(errorMessage);
        alert("Your session has expired, please sign in again.");
        setLoggedIn(false);
        setUser(null);
        navigate("/login")

    }

    } catch (error) {
        console.error("An error occurred:", error.message);
        alert(error.message)
    }
    
  };

  return (
    <>    
    <button className="btn btn-primary" onClick={handleLogout}>
      Logout
    </button>
    </>
  );
}
