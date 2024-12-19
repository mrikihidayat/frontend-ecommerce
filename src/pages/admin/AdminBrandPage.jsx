import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BrandCard from "../../components/admin/all-brand/BrandCard";
import Pagination from "../../components/admin/all-brand/Pagination";
import { apiRequest, HTTP_METHODS } from "../../utils/utils";

const AdminBrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  // Fetch Brands from API
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(HTTP_METHODS.GET, "/api/brands");

      if (response.code === 0 && Array.isArray(response.data)) {
        setBrands(response.data);
      } else {
        alert("Failed to fetch brands.");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      alert("An error occurred while fetching brands.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Calculate Paginated Brands
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">All Brands</h1>
        <Link
          to={"/dashboard/add-brand"}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          + Add New Brand
        </Link>
      </div>

      {/* Brands List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading brands...</p>
      ) : currentBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentBrands.map((brand) => (
            <BrandCard
              key={brand._id}
              brand={brand}
              fetchBrands={fetchBrands}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No brands found.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(brands.length / brandsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminBrandPage;
