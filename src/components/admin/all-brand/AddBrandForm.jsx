import React, { useState } from "react";
import { apiRequest, HTTP_METHODS } from "../../../utils/utils";
import imageCompression from "browser-image-compression";

const AddBrandForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    image: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 1048576) {
      setError("Image size must be less than 1MB.");
      return;
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result.split(",")[1], // Base64 string
        });
        setError("");
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error("Error compressing image:", err);
      setError("Failed to process image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest(
        HTTP_METHODS.POST,
        "/api/brands",
        formData
      );

      if (response.code === 0) {
        setMessage("Brand added successfully!");
        setFormData({
          name: "",
          tagline: "",
          description: "",
          image: "",
        });
      } else {
        setError("Failed to add brand. Please try again.");
      }
    } catch (err) {
      console.error("Error adding brand:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Add New Brand</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Brand Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Brand Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter brand name"
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Tagline */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tagline</label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="Enter brand tagline"
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter brand description"
            required
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Brand Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Brand Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800 transition"
            }`}
          >
            {loading ? "Submitting..." : "Add Brand"}
          </button>
          <button
            type="reset"
            onClick={() =>
              setFormData({
                name: "",
                tagline: "",
                description: "",
                image: "",
              })
            }
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrandForm;
