import React from "react";
import CategoriesTable from "../../components/admin/all-category/CategoriesTable";

const AdminCategoriesPage = () => {
  const categories = [
    { id: 1, name: "Handphone", onDelete: (id) => alert(`Delete category ${id}`) },
    { id: 2, name: "Laptop", onDelete: (id) => alert(`Delete category ${id}`) },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <CategoriesTable categories={categories} />
    </div>
  );
};

export default AdminCategoriesPage;
