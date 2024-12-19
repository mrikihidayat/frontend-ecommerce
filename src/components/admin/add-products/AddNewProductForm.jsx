import React, { useState, useEffect } from "react";
import { apiRequest, HTTP_METHODS } from "../../../utils/utils";

const AddNewProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    brand_id: "",
    category_id: "",
    image: "",
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState("https://placehold.co/600x400");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch Brands and Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          apiRequest(HTTP_METHODS.GET, "/api/brands"),
          apiRequest(HTTP_METHODS.GET, "/api/categories"),
        ]);

        if (brandsRes.code === 0 && categoriesRes.code === 0) {
          setBrands(brandsRes.data);
          setCategories(categoriesRes.data);
        } else {
          setError("Failed to fetch brands and categories.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1048576) {
      setError("Image size must be less than 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result.split(",")[1], 
      });
      setPreview(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await apiRequest(
        HTTP_METHODS.POST,
        "/api/products",
        formData
      );

      if (response.code === 0) {
        setMessage("Product added successfully!");
        setFormData({
          name: "",
          price: "",
          stock: "",
          description: "",
          brand_id: "",
          category_id: "",
          image: "",
        });
        setPreview("https://placehold.co/600x400");
      } else {
        setError("Failed to add product. Please try again.");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Subheader */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Add New Product</h1>
        <p className="text-sm text-gray-600">Home &gt; All Products &gt; Add New Product</p>
      </div>

      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Type name here"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Type description here"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Brand</label>
            <select
              name="brand_id"
              value={formData.brand_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="" disabled>
                Select brand
              </option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div>
          <label className="block text-sm font-medium mb-2">Main Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          <img src={preview} alt="Preview" className="h-40 w-full mt-4 object-cover rounded-lg" />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-6 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProductForm;
