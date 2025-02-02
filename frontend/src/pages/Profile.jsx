import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const [profileData, setProfileData] = useState(null);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_image", image);

    try {
      const response = await axios.patch(
        "http://localhost:8000/api/profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfileData(response.data);
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  if (!profileData) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
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
        <h1 style={{ marginBottom: "20px", color: "#333", fontSize: "1.8em" }}>
          Welcome, {profileData.username}
        </h1>
        <p style={{ fontSize: "1.2em", color: "#666", marginBottom: "20px" }}>
          Email: {profileData.email}
        </p>
        <div style={{ marginBottom: "20px" }}>
          <img
            src={`http://localhost:8000${profileData.profile_image}`}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "4px solid #66a6ff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
        <form onSubmit={handleImageSubmit} style={{ marginBottom: "20px" }}>
          <input
            type="file"
            onChange={handleImageChange}
            style={{
              marginBottom: "10px",
              fontSize: "0.9em",
              cursor: "pointer",
              color: "#666",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "1em",
              cursor: "pointer",
              backgroundColor: "#66a6ff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#5a8fd1")}
            onMouseOut={(e) => (e.target.style.background = "#66a6ff")}
          >
            Update Profile Image
          </button>
        </form>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            fontSize: "1em",
            cursor: "pointer",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#d4362c")}
          onMouseOut={(e) => (e.target.style.background = "#f44336")}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
