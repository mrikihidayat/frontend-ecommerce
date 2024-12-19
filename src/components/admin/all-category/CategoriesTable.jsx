import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { apiRequest, HTTP_METHODS } from "../../../utils/utils";

const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, "/api/categories");
        if (response.code === 0) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle Delete
  const handleDelete = async (categoryId, categoryName) => {
    const confirmDelete = window.confirm(`Delete category ${categoryName}?`);
    if (!confirmDelete) return;

    try {
      const response = await apiRequest(
        HTTP_METHODS.DELETE,
        `/api/categories/${categoryId}`
      );
      if (response.code === 0) {
        setCategories((prev) =>
          prev.filter((category) => category._id !== categoryId)
        );
        alert(`Category ${categoryName} deleted successfully.`);
      } else {
        alert("Failed to delete category.");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("An error occurred while deleting the category.");
    }
  };

  // Handle Edit - Navigate with State
  const handleEdit = (category) => {
    navigate(`/dashboard/edit-category/${category._id}`, {
      state: { category },
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
      {/* Header */}
      <div className="border-b-2 flex justify-between items-center pb-4 mb-4">
        <h1 className="font-semibold text-lg">All Categories</h1>
        <Link
          to="/dashboard/add-category"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          + Add New Category
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Category Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-t even:bg-gray-50 hover:bg-gray-100"
                >
                  <td className="px-4 py-3">{category.name}</td>
                  <td className="px-4 py-3">{category.description}</td>
                  <td className="px-4 py-3 text-center flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex items-center justify-center group relative"
                    >
                      <FaEdit className="text-blue-500 text-lg group-hover:opacity-0 transition-opacity duration-200" />
                      <span className="absolute inset-0 flex items-center justify-center text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Edit
                      </span>
                    </button>

                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      className="flex items-center justify-center group relative"
                    >
                      <FaTrashAlt className="text-red-500 text-lg group-hover:opacity-0 transition-opacity duration-200" />
                      <span className="absolute inset-0 flex items-center justify-center text-red-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesTable;
