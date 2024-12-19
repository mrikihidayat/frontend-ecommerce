import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarLogin from "../../components/user/NavbarLogin";
import Footer from "../../components/user/Footer";
import CardProduct from "../../components/user/CardProduct";
import { apiRequest, HTTP_METHODS, getUserSession } from "../../utils/utils";

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const banners = ["/assets/banner.jpeg", "/assets/banner2.jpeg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const fetchUserByUsername = async (username) => {
      try {
        const response = await apiRequest(
          HTTP_METHODS.POST, 
          `/api/users/username/${username}`
        );
        saveUserSession(response);
        if (response.data.role == 'admin') {
          window.location.href = "/dashboard";
        }else{
          window.location.href = "/home";
        }
        
      } catch (err) {
        console.error("Error fetching user:", err.response?.data?.data?.message || "Something went wrong.");
      }
    };
  
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");
  
    if (token && username) {
      localStorage.setItem("_token", token);
      fetchUserByUsername(username); 
    }

    const usersession = getUserSession();

    if (usersession && usersession.role == 'admin') {
      window.location.href = "/dashboard";
    } else if (usersession && usersession.role == 'user') {
      window.location.href = "/home";
    }

  }, []);  

  return (
    <div className="relative">
      <img
        src={banners[currentIndex]}
        alt={`Banner ${currentIndex + 1}`}
        className="w-full rounded-lg transition-all duration-700"
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-black" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

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
          <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Banner */}
        {!searchQuery && <Banner />}

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
