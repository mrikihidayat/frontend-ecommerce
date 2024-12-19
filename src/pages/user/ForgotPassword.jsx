import React, { useState } from "react";
import NavbarLogin from "../../components/user/NavbarLogin";
import Footer from "../../components/user/Footer";
import { apiRequest, HTTP_METHODS } from "../../utils/utils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const redirectUrl = `${window.location.origin}/reset-password`;

    try {
      await apiRequest(HTTP_METHODS.POST, "/api/auth/reset-password", {
        email,
        redirectUrl,
      });

      setSubmitted(true);
    } catch (err) {
      const errorMessage = err.response?.data?.data?.message || "Failed to send reset link.";
      setError(errorMessage);
    }
  };

  return (
    <div>
      <NavbarLogin />
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded-lg w-11/12 md:w-3/5 lg:w-1/3 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Forgot Your Password?
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Enter your email address, and we'll send you instructions to reset
          your password.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@example.com"
                required
                className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-bold"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-500 font-semibold">
              A reset link has been sent to your email!
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Please check your inbox or spam folder.
            </p>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Remember your password?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Login here
        </a>
      </p>
    </div>
    <Footer />
    </div>
  );
};

export default ForgotPassword;
