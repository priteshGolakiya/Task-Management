/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { createContext, useState } from "react";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const login = async (email, password) => {
    try {
      setLoading(true); // Set loading state to true during login process

      const response = await axios.post("http://127.0.0.1:5000/users/login", {
        email,
        password,
      });

      if (!response || !response.data || !response.data.token) {
        throw new Error("Invalid server response or missing access token");
      }

      const tokenData = response.data;
      const accessToken = tokenData.token;

      // console.log("Received Access Token:", accessToken);
      const decoded = JSON.parse(atob(accessToken.split(".")[1]));
      // console.log("Decoded Token Data:", decoded);

      // Update token, decoded token, and role synchronously
      setToken(accessToken);
      setDecodedToken(decoded);
      setRole(decoded.role);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Set loading state to false after login process
    }
  };

  const logout = () => {
    setToken(null);
    setDecodedToken(null);
    setRole(null);
  };

  return (
    <TokenContext.Provider value={{ token, decodedToken, role, login, logout }}>
      {children}
    </TokenContext.Provider>
  );
};
