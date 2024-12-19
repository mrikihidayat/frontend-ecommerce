import React from "react";

const UserDetail = ({ user }) => {
  return (
    <div className="p-4 sm:p-6 bg-gray-100 w-full max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center">User Detail</h1>
      </div>

      {/* User Details */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">User Information</h3>
        <p className="text-gray-700">
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p className="text-gray-700 mt-2">
          <span className="font-semibold">Phone:</span> {user.phone}
        </p>
        <p className="text-gray-700 mt-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
      </div>
      
    </div>
  );
};

export default UserDetail;
