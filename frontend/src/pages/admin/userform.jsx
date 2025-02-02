import React, { useState } from 'react';
import axios from 'axios';

const AddUserForm = ({ token, onUserAdded }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) formData.append('profile_image', profileImage);

        try {
            await axios.post('http://localhost:8000/api/admin/users', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            onUserAdded();
            setUsername('');
            setEmail('');
            setPassword('');
            setProfileImage(null);
        } catch (error) {
            console.error(error);
            alert('Failed to create user');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add New User</h3>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
                <label>Profile Image:</label>
                <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
            </div>
            <button type="submit">Add User</button>
        </form>
    );
};

export default AddUserForm;
