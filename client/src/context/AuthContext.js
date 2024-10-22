import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Call an API to validate the token
          const res = await axios.post("/api/validate-token", { token });

          if (res.data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            navigate("/login"); // Redirect to login if token is invalid
          }
        }
      } catch (error) {
        console.error("Error validating token:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login"); // Redirect to login on error
      } finally {
        setIsAuthInitialized(true);
      }
    };

    validateToken();
  }, [navigate]);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      navigate("/medical-term-app"); // Redirect to the medical-term-app after login
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAuthInitialized, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
