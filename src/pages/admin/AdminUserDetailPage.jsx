import React from "react";
import UserDetail from "../../components/admin/all-user/UserDetail";

const AdminUserDetailPage = () => {
  const user = {
    username: "Jhondoe",
    phone: "0812345631",
    email: "jhondoe@gmail.com",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <UserDetail user={user} />
    </div>
  );
};

export default AdminUserDetailPage;
