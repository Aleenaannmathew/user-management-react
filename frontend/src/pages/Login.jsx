import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login/', formData);
            dispatch(
                login({
                    user: { username: formData.username },
                    token: response.data.access,
                })
            );

            alert('Logged in successfully');
            navigate("/profile");
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg,rgb(105, 111, 141),rgb(35, 125, 152))',
            }}
        >
            <div
                style={{
                    padding: '20px',
                    width: '350px',
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ marginBottom: '20px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                    Login
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })
                        }
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
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        style={{
                            padding: '10px',
                            margin: '10px 0',
                            fontSize: '16px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            outline: 'none',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '10px',
                            marginTop: '15px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            border: 'none',
                            background: '#4CAF50',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => (e.target.style.background = '#45a049')}
                        onMouseOut={(e) => (e.target.style.background = '#4CAF50')}
                    >
                        Login
                    </button>
                </form>
                <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                    Don't have an account? <a href="/" style={{ color: '#2575fc' }}>Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
