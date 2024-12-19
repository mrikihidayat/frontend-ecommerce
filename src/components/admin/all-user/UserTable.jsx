import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import { apiRequest, HTTP_METHODS } from '../../../utils/utils';

const UserTable = () => {
  const [users, setUsers] = useState([]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiRequest(HTTP_METHODS.POST, '/api/users');
        if (response.code === 0) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle Delete
  const handleDelete = async (userId, userName) => {
    const confirmDelete = window.confirm(`Hapus akun ${userName}?`);
    if (!confirmDelete) return;

    try {
      const response = await apiRequest(HTTP_METHODS.POST, `/api/users/delete/${userId}`);
      if (response.code === 0) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        alert(`Akun ${userName} berhasil dihapus.`);
      } else {
        alert("Gagal menghapus akun.");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Terjadi kesalahan saat menghapus akun.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="border-b-2 flex justify-between items-center pb-4 mb-4">
        <h1 className="font-semibold text-lg">All Users</h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/add-user"
            className="flex items-center bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            <FaPlus className="mr-2" />
            Add User
          </Link>
          <span className="text-gray-500 text-xl">&#x1F465;</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone Number</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-center">Hapus Akun</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-t ${
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="flex items-center justify-center mx-auto w-10 h-10 bg-red-100 rounded-full hover:bg-red-200"
                      onClick={() => handleDelete(user._id, user.name)}
                    >
                      <FaTrashAlt className="text-red-500 text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
