import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/login/",
        formData
      );
      const user = response.data.user;

      if (user && user.is_superuser) {
        localStorage.setItem('access_token', response.data.access);
        dispatch(
          login({
            user: { username: formData.username, role: "admin" },
            token: response.data.access,
          })
        );
        alert("Admin logged in successfully");
        navigate("/admin/dashboard");
      } else {
        alert("Only admins can log into the admin panel");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
      }}
    >
      <div
        style={{
          padding: "30px",
          width: "400px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "1.8em", color: "#333" }}>
          Admin Login
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Admin Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            style={{
              padding: "12px",
              marginBottom: "15px",
              width: "100%",
              fontSize: "1em",
              border: "1px solid #ddd",
              borderRadius: "5px",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9a9e")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            style={{
              padding: "12px",
              marginBottom: "20px",
              width: "100%",
              fontSize: "1em",
              border: "1px solid #ddd",
              borderRadius: "5px",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9a9e")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
          <button
            type="submit"
            style={{
              padding: "12px 20px",
              fontSize: "1em",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              transition: "background-color 0.3s ease",
              width: "100%",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
