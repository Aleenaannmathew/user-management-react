import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset form state on component mount
    setUsername('');
    setEmail('');
    setPassword('');
    setProfileImage(null);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/register/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
      }}
    >
      <div
        style={{
          padding: '20px',
          width: '400px',
          background: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
          Register
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: '10px',
              margin: '10px 0',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '10px',
              margin: '10px 0',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '10px',
              margin: '10px 0',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
            style={{
              padding: '5px',
              margin: '10px 0',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#f5576c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              transition: 'background-color 0.3s ease',
              marginTop: '15px',
            }}
            onMouseOver={(e) => (e.target.style.background = '#e6494a')}
            onMouseOut={(e) => (e.target.style.background = '#f5576c')}
          >
            Register
          </button>
        </form>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
          Already have an account? <a href="/login" style={{ color: '#f093fb' }}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
