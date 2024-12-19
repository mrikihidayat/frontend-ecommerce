import React, { useState, useEffect } from "react";
import { apiRequest, HTTP_METHODS } from "../../utils/utils";
import { useSearchParams } from "react-router-dom";
import NavbarLogin from "../../components/user/NavbarLogin";
import Footer from "../../components/user/Footer";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("_token", token);
    } else {
      setError("Invalid or missing token.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== retypePassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await apiRequest(HTTP_METHODS.POST, "/api/auth/reset-password/process", {
        newPassword,
        retypePassword,
      });

      setSuccess(true);
    } catch (err) {
      const errorMessage = err.response?.data?.data?.message || "Password reset failed.";
      setError(errorMessage);
    }
  };

  return (
      <div>
      <NavbarLogin />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded-lg w-11/12 md:w-3/5 lg:w-1/3 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Reset Your Password
        </h1>

        {success ? (
          <div className="text-center">
            <p className="text-green-500 font-semibold">Password reset successful!</p>
            <p className="text-sm text-gray-600 mt-2">
              You can now <a href="/login" className="text-blue-500 hover:underline">login here</a>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="retypePassword" className="block text-sm font-medium text-gray-700">
                Retype New Password
              </label>
              <input
                type="password"
                id="retypePassword"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                placeholder="Retype new password"
                required
                className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-bold"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default ResetPassword;
