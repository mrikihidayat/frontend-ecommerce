import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import ProductCard from "../../components/user/ProductCard";
import Banner from "../../components/user/Banner"; // Import the Banner component
import { apiRequest, HTTP_METHODS } from "../../utils/utils";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, brandsRes, categoriesRes] = await Promise.all([
        apiRequest(HTTP_METHODS.GET, "/api/products"),
        apiRequest(HTTP_METHODS.GET, "/api/brands"),
        apiRequest(HTTP_METHODS.GET, "/api/categories"),
      ]);

      if (productsRes.code === 0) setProducts(productsRes.data);
      if (brandsRes.code === 0) setBrands(brandsRes.data);
      if (categoriesRes.code === 0) setCategories(categoriesRes.data);

      setFilteredProducts(productsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category_id?.name === selectedCategory
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleViewAll = () => setShowAll(true);

  const productsToDisplay = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 10);

  return (
    <>
      <Navbar />
      <main className="bg-gray-100">
        {/* Search Bar */}
        <div className="py-6 shadow-sm">
          <div className="container mx-auto px-4 flex items-center justify-center gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full md:w-1/2 p-2 border border-gray-300 rounded-l-lg"
            />
            <button
              className="bg-black text-white px-4 py-2 rounded-r-lg"
              onClick={filterProducts}
            >
              Search
            </button>
          </div>
        </div>

        {/* Banner */}
        {!searchQuery && (
          <section className="container mx-auto px-8 mt-4">
            <Banner />
          </section>
        )}

        {/* Categories */}
        {!searchQuery && (
          <section className="container mx-auto px-8 py-10">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Browse By Category
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`py-2 px-4 rounded-md ${
                    selectedCategory === category.name
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } border`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Browse By Brand */}
        {!searchQuery && (
          <section className="container mx-auto px-8 py-10">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Browse By Brand
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  to={`/brand/${brand._id}`}
                  className="bg-white p-2 border rounded-md shadow-sm hover:bg-gray-200"
                >
                  <img
                    src={`data:image/png;base64,${brand.image}`}
                    alt={brand.name}
                    className="w-16 h-16 object-contain"
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        <section className="container mx-auto px-8 py-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Explore Our Products
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsToDisplay.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={`Rp ${product.price.toLocaleString()}`}
                  image={`data:image/png;base64,${product.image}`}
                  rating={product.star}
                />
              ))}
            </div>
          )}

          {!showAll && filteredProducts.length > 10 && (
            <div className="flex justify-center mt-6">
              <button
                className="bg-black text-white px-6 py-2 rounded-md"
                onClick={handleViewAll}
              >
                View All Products
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;