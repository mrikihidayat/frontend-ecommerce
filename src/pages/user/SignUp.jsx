import React, { useState } from "react";
import NavbarLogin from "../../components/user/NavbarLogin";
import Footer from "../../components/user/Footer";
import { apiRequest, HTTP_METHODS } from "../../utils/utils";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
  }); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState(""); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest(HTTP_METHODS.POST, "/api/auth/register", formData);

      if (response.code === 0) {
        setSuccess("Berhasil Register! Silakan login.");
        setFormData({
          name: "",
          email: "",
          username: "",
          phone: "",
          password: "",
        });
      } else {
        throw new Error(response.data?.message || "Registration failed.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.data?.message || err.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavbarLogin />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col lg:flex-row w-11/12 lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
            <img
              src="/public/mockup.png"
              alt="Sign Up Illustration"
              className="w-3/4"
            />
          </div>

          <div className="w-full lg:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Sign Up To One Step Store
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Enter your details below:
            </p>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm text-center mb-4">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-gray-600 mt-4 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
