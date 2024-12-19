import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, HTTP_METHODS } from "../../../utils/utils";

const EditBrandForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    image: "",
  });

  const [preview, setPreview] = useState("https://placehold.co/600x400");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch brand data
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await apiRequest(
          HTTP_METHODS.GET,
          `/api/brands/${id}`
        );
        if (response.code === 0) {
          setFormData(response.data);
          setPreview(`data:image/png;base64,${response.data.image}`);
        } else {
          setError("Failed to fetch brand data.");
        }
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError("An error occurred. Please try again.");
      }
    };

    fetchBrand();
  }, [id]);

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

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, JPEG, or PNG formats are allowed.");
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

  const handleImageError = () => {
    setPreview("https://placehold.co/600x400");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await apiRequest(
        HTTP_METHODS.PUT,
        `/api/brands/${id}`,
        formData
      );

      if (response.code === 0) {
        setMessage("Brand updated successfully!");
        navigate("/dashboard/all-brands");
      } else {
        setError("Failed to update brand. Please try again.");
      }
    } catch (err) {
      console.error("Error updating brand:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Edit Brand</h1>
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
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <div className="mt-4 flex justify-center">
            <img
              src={preview}
              alt={formData.name}
              className="h-40 w-auto object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 transition"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/all-brands")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBrandForm;
