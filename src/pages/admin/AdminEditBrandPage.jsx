import React from "react";
import EditBrandForm from "../../components/admin/all-brand/EditBrandForm";

const AdminEditBrandPage = () => {
  const brand = {
    id: 1,
    name: "SAMSUNG",
    image: "https://via.placeholder.com/150",
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <EditBrandForm brand={brand} />
    </div>
  );
};

export default AdminEditBrandPage;
