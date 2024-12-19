import React from 'react';
import AddUserForm from '../../components/admin/all-user/AddUser';
const AdminAddUserPage = () => {
  return (
    <div className="p-6 bg-gray-100">
      {/* Subheader */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Add New User</h1>
        <p className="text-gray-600">Home &gt; All Users &gt; Add New User</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <AddUserForm />
      </div>
    </div>
  );
};

export default AdminAddUserPage;
