import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./Login.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const validateForm = () => {
    if (!name || !email || !password) {
      toast.error("Please fill out all fields");
      return false;
    }
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/users/signup",
          formData
        );
        if (response.data.status) {
          toast.success(response.data.message);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Signup error:", error.message);
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="wrapper signup" id="signupFormContent">
        <form onSubmit={handleSignup}>
          <h2>Register</h2>
          <div className="input-box">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn">
            Register
          </button>
          <p>
            <span className="login-link" onClick={() => navigate("/login")}>
              Already have an account? Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
