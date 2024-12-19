import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; 
import ProductCard from "../../components/user/ProductCard";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { apiRequest, HTTP_METHODS } from "../../utils/utils";

const BrandPage = () => {
  const { brandId } = useParams(); 
  const [brandProducts, setBrandProducts] = useState([]);
  const [brandInfo, setBrandInfo] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Ambil Data Brand
  useEffect(() => {
    const fetchBrandInfo = async () => {
      try {
        const response = await apiRequest(
          HTTP_METHODS.GET, 
          `/api/brands/${brandId}`
        );

        if (response.code === 0) {
          setBrandInfo(response.data);
        } else {
          console.error("Failed to fetch brand info:", response.message);
        }
      } catch (error) {
        console.error("Error fetching brand info:", error.message);
      }
    };

    if (brandId) fetchBrandInfo();
  }, [brandId]);

  // Ambil Data Produk
  useEffect(() => {
    const fetchProductsByBrand = async () => {
      setLoading(true); 
      try {
        const response = await apiRequest(
          HTTP_METHODS.GET, 
          `/api/products/brand/${brandId}`
        );

        if (response.code === 0) {
          setBrandProducts(response.data);
        } else {
          console.error("Failed to fetch products:", response.message);
        }
      } catch (error) {
        console.error("Error fetching products by brand:", error.message);
      } finally {
        setLoading(false); 
      }
    };

    if (brandId) fetchProductsByBrand();
  }, [brandId]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Gunakan Memo untuk Filter Produk
  const displayedProducts = useMemo(() => {
    return brandProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [brandProducts, searchQuery]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-8 py-10">
        {/* Header Brand */}
        {brandInfo && (
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-28 h-28 overflow-hidden rounded-full border-2 border-black">
                <img
                  src={`data:image/png;base64,${brandInfo.image}`} 
                  alt={`${brandInfo.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold text-center mt-4 flex items-center space-x-2">
                <span>{brandInfo.name}</span>
                <FaCheckCircle className="text-green-500" />
              </h2>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:w-2/3 lg:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-center"
          />
        </div>

        {/* Products */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading products...</p>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {displayedProducts.map((product) => (
              <div key={product._id} className="relative">
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={`Rp ${product.price.toLocaleString()}`}
                  image={`data:image/png;base64,${product.image}`}
                  rating={product.star}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No products found for "{searchQuery}" in {brandInfo.name}.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BrandPage;
