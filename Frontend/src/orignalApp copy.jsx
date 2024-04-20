import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { TokenContext } from "./TokenContext";

function App() {
  const { data, setData } = useContext(TokenContext);
  const { isLoggedIn, userRole, accessToken } = data || {}; // Handle undefined

  useEffect(() => {
    const userToken = accessToken;
    if (userToken) {
      try {
        const tokenParts = userToken.split(".");
        if (tokenParts.length === 3) {
          const decodedToken = JSON.parse(atob(tokenParts[1]));
          console.log("decodedToken", decodedToken);
          setData((prevData) => ({
            ...prevData,
            isLoggedIn: true,
            userRole: decodedToken.role,
            accessToken: userToken,
          }));
        } else {
          console.error("Invalid token format");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle error appropriately
      }
    }
  }, [accessToken, setData]); // Include only accessToken in the dependency array

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes */}
        <Route
          path="/admin"
          element={
            isLoggedIn && userRole === "admin" ? (
              <AdminDashboard accessToken={accessToken} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/user"
          element={
            isLoggedIn && userRole === "user" ? (
              <UserDashboard accessToken={accessToken} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Home Route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              userRole === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/user" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default Route */}
        <Route element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
