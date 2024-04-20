/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TokenContext } from "../TokenContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, token, role, loading } = useContext(TokenContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      await login(email, password);
      if (!loading && token && role) {
        // Check loading state before redirecting
        if (role === "admin") {
          navigate("/admin");
          toast.success("Logged in successfully as admin!");
        } else if (role === "user") {
          navigate("/user");
          toast.success("Logged in successfully as user!");
        } else {
          throw new Error("Invalid role");
        }
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="wrapper login" id="loginFormContent">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}{" "}
            {/* Show loading text during login */}
          </button>
          <p>
            <span className="signup-link" onClick={() => navigate("/signup")}>
              Don't have an account? Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
