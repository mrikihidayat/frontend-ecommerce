import React, { useState } from "react";
import NavbarLogin from "../../components/user/NavbarLogin";
import Footer from "../../components/user/Footer";
import { apiRequest, HTTP_METHODS, saveUserSession } from "../../utils/utils";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(HTTP_METHODS.POST, "/api/auth/signin", {
        username: email,
        password,
      });

      console.log("Login successful:", response);

      saveUserSession(response);

      if (response.data.code == 'admin') {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/home";
      }
    } catch (err) {
      const errorMessage = err.response?.data?.data?.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const frontendBaseUrl = window.location.origin;
    const redirectUrl = `${frontendBaseUrl}/home`;
    const googleAuthUrl = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google?redirect=${redirectUrl}`;
    console.log(googleAuthUrl)
    window.location.href = googleAuthUrl;
  };
  

  return (
    <>
    <NavbarLogin />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col lg:flex-row w-11/12 lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
            <img
              src="/public/mockup2.png"
              alt="Login Illustration"
              className="w-3/4"
            />
          </div>

          <div className="w-full lg:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Log in to One Step Store
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Enter your details below:
            </p>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-blue-500 text-white py-3 mt-4 rounded-lg font-bold hover:bg-blue-600 transition"
            >
              Sign In with Google
            </button>
            <div className="flex items-center justify-between mt-4">
              <a
                href="/forgot-password"
                className="text-blue-500 hover:underline text-sm"
              >
                Forgot Password?
              </a>
              <a
                href="/signup"
                className="text-blue-500 hover:underline text-sm"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
