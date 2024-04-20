/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const UserForm = ({ fetchUsers }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { name, email, password } = formData;
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill out all fields");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://127.0.0.1:5000/users/signup",
          formData
        );
        if (response.data.status) {
          toast.success(response.data.message);
          setFormData({
            name: "",
            email: "",
            password: "",
          });
          // Call the parent fetchUsers function to update the user list
          fetchUsers();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Signup error:", error.message);
        toast.error("Signup failed. Please try again.");
      } finally {
        setLoading(false);
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
      <h2>Create User</h2>
      <div className="wrapper signup" id="signupFormContent">
        <form onSubmit={handleSignup}>
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
          <button type="submit" className="btn" disabled={loading}>
            Create User
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

export default UserForm;
