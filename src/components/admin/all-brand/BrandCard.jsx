import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { apiRequest, HTTP_METHODS } from "../../../utils/utils";

const BrandCard = ({ brand, fetchBrands }) => {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Delete brand ${brand.name}?`);
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await apiRequest(
        HTTP_METHODS.DELETE,
        `/api/brands/${brand._id}`
      );

      if (response.code === 0) {
        alert(`Brand ${brand.name} deleted successfully.`);
        fetchBrands(); 
      } else {
        alert("Failed to delete brand.");
      }
    } catch (error) {
      console.error("Failed to delete brand:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center gap-4 transform transition-transform hover:scale-105 hover:shadow-lg">
      {/* Brand Image */}
      <div className="h-40 w-full flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
        <img
          src={
            imageError
              ? "https://placehold.co/600x400"
              : `data:image/png;base64,${brand.image}`
          }
          alt={brand.name}
          className="h-full w-full object-cover rounded-md"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Brand Name */}
      <h3 className="text-lg font-bold text-center text-gray-800 hover:text-blue-500 transition-colors">
        {brand.name}
      </h3>

      <div className="flex justify-between w-full mt-4">
        {/* Edit Button */}
        <Link
          to={`/dashboard/edit-brand/${brand._id}`}
          state={{ brand }}
          className="relative flex items-center justify-center group"
        >
          <FaEdit className="text-blue-500 text-lg group-hover:opacity-0 transition-opacity duration-200" />
          <span className="absolute inset-0 flex items-center justify-center text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Edit
          </span>
        </Link>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`relative flex items-center justify-center group ${
            loading ? "cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="text-red-500 font-medium">Deleting...</span>
          ) : (
            <>
              <FaTrashAlt className="text-red-500 text-lg group-hover:opacity-0 transition-opacity duration-200" />
              <span className="absolute inset-0 flex items-center justify-center text-red-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Delete
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BrandCard;
