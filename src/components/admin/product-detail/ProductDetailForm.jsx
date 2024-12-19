import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, HTTP_METHODS } from "../../../utils/utils";

const ProductDetailForm = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    stock: 0,
    price: 0,
    image: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch product by ID
  const fetchProduct = async () => {
    try {
      const response = await apiRequest(HTTP_METHODS.GET, `/api/products/${id}`);
      if (response.code === 0) {
        const productData = response.data;
        setProduct({
          name: productData.name,
          description: productData.description,
          category: productData.category_id?.name || "Uncategorized",
          brand: productData.brand_id?.name || "No Brand",
          stock: productData.stock,
          price: productData.price,
          image: productData.image,
        });
        setPreviewImage(`data:image/png;base64,${productData.image}`);
      } else {
        setError("Failed to fetch product data.");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("An error occurred while fetching product.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran gambar
    if (file.size > 1048576) {
      setError("Image size must be less than 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result.split(",")[1];
      setProduct({ ...product, image: base64Image });
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  // Handle Update
  const handleUpdate = async () => {
    setUpdating(true);
    setMessage("");
    setError("");

    try {
      const response = await apiRequest(HTTP_METHODS.PUT, `/api/products/${id}`, product);
      if (response.code === 0) {
        setMessage("Product updated successfully!");
      } else {
        setError("Failed to update product.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError("An error occurred while updating product.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmDelete) return;

    setDeleting(true);
    setMessage("");
    setError("");

    try {
      const response = await apiRequest(HTTP_METHODS.DELETE, `/api/products/${id}`);
      if (response.code === 0) {
        alert("Product deleted successfully!");
        navigate("/dashboard/all-products");
      } else {
        setError("Failed to delete product.");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("An error occurred while deleting product.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center">Loading product data...</p>;

  return (
    <div className="p-4 sm:p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      {/* Message */}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2"
              rows="4"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Stock</label>
              <input
                type="number"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mb-4"
          />
          <img
            src={previewImage || "https://placehold.co/600x400"}
            alt="Product"
            className="border border-gray-300 rounded-lg h-40 object-cover mb-4"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
        >
          {updating ? "Updating..." : "Update Product"}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
        >
          {deleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailForm;
