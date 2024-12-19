import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarLogin from "../../components/user/NavbarLogin";
import Footer from "../../components/user/Footer";
import CardProduct from "../../components/user/CardProduct";
import Banner from "../../components/user/Banner"; // Import the Banner component
import { apiRequest, HTTP_METHODS } from "../../utils/utils";

const Beranda = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data products, categories, and brands from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        apiRequest(HTTP_METHODS.GET, "/api/products"),
        apiRequest(HTTP_METHODS.GET, "/api/categories"),
        apiRequest(HTTP_METHODS.GET, "/api/brands"),
      ]);

      if (productsRes.code === 0) {
        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
      }

      if (categoriesRes.code === 0) {
        setCategories(categoriesRes.data);
      }

      if (brandsRes.code === 0) {
        setBrands(brandsRes.data);
      }
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
  }, [searchQuery, selectedCategory, selectedBrand]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category_id?.name === selectedCategory
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(
        (product) => product.brand_id?.name === selectedBrand
      );
    }

    if (searchQuery.trim()) {
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
      <NavbarLogin />
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

        {/* Categories Section */}
        <section className="container mx-auto px-8 py-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Browse By Category
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category.name)}
                className={`py-2 px-4 rounded-lg ${
                  selectedCategory === category.name
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Browse By Brand */}
        <section className="container mx-auto px-8 py-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Browse By Brand
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {brands.map((brand) => (
              <button
                key={brand._id}
                onClick={() => setSelectedBrand(brand.name)}
                className={`py-2 px-4 rounded-lg ${
                  selectedBrand === brand.name
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </section>

        {/* Product List */}
        <section className="container mx-auto px-8 mt-8">
          <h2 className="text-2xl font-semibold mb-6">Products</h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsToDisplay.length > 0 ? (
                productsToDisplay.map((product) => (
                  <CardProduct
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price.toLocaleString()}
                    image={`data:image/png;base64,${product.image}`}
                    rating={product.star}
                  />
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500">
                  No products found.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Beranda;