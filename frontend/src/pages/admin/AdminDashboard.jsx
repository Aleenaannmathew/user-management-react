import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: null,
  });
  const [editUser, setEditUser] = useState(null);

  // Fetch users data from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/admin/users/', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const filteredUsers = response.data.filter(user => !user.is_superuser);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', newUser.username);
    formData.append('email', newUser.email);
    formData.append('password', newUser.password);
    if (newUser.profileImage) {
      formData.append('profile_image', newUser.profileImage);
    }

    try {
      await axios.post('http://localhost:8000/api/admin/users/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert('User added successfully!');
      fetchUsers();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    }
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', editUser.username);
    formData.append('email', editUser.email);
    if (editUser.profileImage) {
      formData.append('profile_image', editUser.profileImage);
    }

    try {
      await axios.put(`http://localhost:8000/api/admin/users/${editUser.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert('User updated successfully!');
      fetchUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setNewUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (isEdit) {
      setEditUser((prevState) => ({
        ...prevState,
        profileImage: file,
      }));
    } else {
      setNewUser((prevState) => ({
        ...prevState,
        profileImage: file,
      }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filterUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2em' }}>Admin Dashboard</h2>

      <button 
        onClick={() => setIsAddModalOpen(true)}
        style={{
          padding: '10px 20px',
          fontSize: '1.1em',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          transition: 'background-color 0.3s ease',
          marginBottom: '20px',
        }}
      >
        Add User
      </button>

      {isAddModalOpen && (
        <UserModal
          title="Add New User"
          userData={newUser}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onSubmit={handleAddUserSubmit}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <UserModal
          title="Edit User"
          userData={editUser}
          onInputChange={(e) => handleInputChange(e, true)}
          onFileChange={(e) => handleFileChange(e, true)}
          onSubmit={handleEditUserSubmit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto 20px auto',
          display: 'block',
          padding: '10px',
          fontSize: '1em',
          border: '1px solid #ccc',
          borderRadius: '5px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#333' }}>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#f4f4f4' }}>Username</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#f4f4f4' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#f4f4f4' }}>Profile Image</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#f4f4f4' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers?.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.username}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {user.profile_image && <img src={user.profile_image} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{ ...deleteButtonStyle, backgroundColor: '#2196F3', marginRight: '10px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const UserModal = ({ title, userData, onInputChange, onFileChange, onSubmit, onClose }) => (
  <div style={modalStyles.overlay}>
    <div style={modalStyles.modal}>
      <h3>{title}</h3>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '1.1em', marginBottom: '5px' }}>Username:</label>
          <input 
            type="text" 
            name="username"
            value={userData.username}
            onChange={onInputChange}
            required 
            style={inputStyles}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '1.1em', marginBottom: '5px' }}>Email:</label>
          <input 
            type="email" 
            name="email"
            value={userData.email}
            onChange={onInputChange}
            required 
            style={inputStyles}
          />
        </div>
        {title === "Add New User" && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '1.1em', marginBottom: '5px' }}>Password:</label>
            <input 
              type="password" 
              name="password"
              value={userData.password || ''}
              onChange={onInputChange}
              required 
              style={inputStyles}
            />
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '1.1em', marginBottom: '5px' }}>Profile Image:</label>
          <input 
            type="file" 
            onChange={onFileChange}
            style={inputStyles}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '1.1em',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px',
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '10px 20px',
            fontSize: '1.1em',
            cursor: 'pointer',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px',
          }}
        >
          Close
        </button>
      </form>
    </div>
  </div>
);

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
};

const inputStyles = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  fontSize: '1em',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const deleteButtonStyle = {
  padding: '8px 15px',
  fontSize: '1em',
  cursor: 'pointer',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

export default AdminDashboard;
