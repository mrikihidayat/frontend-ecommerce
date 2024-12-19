import React, { useState } from 'react';
import { apiRequest, HTTP_METHODS } from '../../../utils/utils';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    role: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await apiRequest(HTTP_METHODS.POST, '/api/users/create', formData);

      if (response.code === 0) {
        setMessage('User created successfully!');
        setFormData({
          name: '',
          phone: '',
          email: '',
          username: '',
          password: '',
          role: '',
        });
      } else {
        setError('Failed to create user. Please try again.');
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Type name here"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Enter phone number"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Enter username"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Enter password"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
        >
          <option value="" disabled>
            Select role
          </option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
      >
        Create User
      </button>
    </form>
  );
};

export default AddUserForm;
