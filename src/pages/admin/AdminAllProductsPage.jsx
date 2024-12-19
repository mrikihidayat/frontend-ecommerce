import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/admin/all-products/ProductCard";
import Pagination from "../../components/admin/all-products/Pagination";
import { apiRequest, HTTP_METHODS } from "../../utils/utils";

const AdminAllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(HTTP_METHODS.GET, "/api/products");
      if (response.code === 0) {
        const productList = response.data.map((product) => ({
          id: product._id,
          name: product.name,
          category: product.category_id?.name || "Uncategorized",
          price: product.price.toLocaleString(), // Format number
          remaining: product.stock,
          image: `data:image/png;base64,${product.image}` || "https://placehold.co/600x400",
        }));
        setProducts(productList);
      } else {
        console.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Link
          to="/dashboard/add-product"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          + Add New Product
        </Link>
      </div>

      {/* Product List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default AdminAllProductsPage;
