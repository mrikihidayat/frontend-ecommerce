import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser , FaBars, FaTimes } from "react-icons/fa";
import { apiRequest, HTTP_METHODS, clearUserSession } from "../../utils/utils";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutPopupOpen, setIsAboutPopupOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Fungsi untuk toggle dropdown profil
  const handleProfileClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Fungsi untuk toggle menu mobile
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  // Fungsi untuk membuka pop-up About
  const handleAboutClick = (e) => {
    e.preventDefault(); // Mencegah navigasi ke halaman About
    setIsAboutPopupOpen(true);
  };

  // Fungsi untuk menutup pop-up About
  const closeAboutPopup = () => {
    setIsAboutPopupOpen(false);
  };

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      await apiRequest(HTTP_METHODS.POST, "/api/auth/signout");
    } catch (error) {
      console.error("Signout failed:", error);
    } finally {
      clearUserSession();
      window.location.href = "/login";
    }
  };

  // Effect untuk menutup dropdown dan mobile menu ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-black text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-8">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/public/logo.png" alt="Logo" className="h-10 mr-3" />
        </div>

        {/* Navigation Links */}
        <nav
          ref={mobileMenuRef}
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-black lg:relative lg:top-0 lg:left-auto lg:w-auto lg:flex lg:items-center lg:space-x-6`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
            <Link
              to="/home"
              className="px-4 py-2 lg:px-0 lg:py-0 text-white hover:text-gray-300"
            >
              Home
            </Link>
            <Link
              to="https://wa.wizard.id/32620f"
              className="px-4 py-2 lg:px-0 lg:py-0 text-white hover:text-gray-300"
            >
              Contact
            </Link>
            <Link
              to="/about"
              onClick={handleAboutClick} // Menggunakan fungsi handleAboutClick
              className="px-4 py-2 lg:px-0 lg:py-0 text-white hover:text-gray-300"
            >
              About
            </Link>
          </div>
        </nav>

        {/* Right Section: Cart & Profile */}
        <div className="flex items-center space-x-6">
          {/* Cart */}
          <Link to="/cart" className="flex items-center text-white hover:text-gray-300">
            <FaShoppingCart className="mr-2" />
          </Link>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={handleProfileClick} className="flex items-center">
              <FaUser  className="mr-2" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white text-black shadow-lg rounded-lg w-40 z-50">
                <Link
                  to="/edit-profile"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  My Profile
                </Link>
                <Link
                  to="/my-address"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  My Address
                </Link>
                <Link
                  to="/my-orders"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  My Order
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileMenuToggle}
            className="lg:hidden text-white text-xl"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Pop-up About */}
      {isAboutPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black rounded-lg p-6 w-11/12 max-w-md relative">
            <button
              onClick={closeAboutPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">About Us</h2>
            <p className="text-justify">
              One Step Store adalah sebuah perusahaan jasa yang bekerja sama dengan berbagai brand elektronik di Indonesia untuk menjual produk-produk mereka melalui platform e-commerce. Tujuan utama dari One Step Store adalah memberikan akses kepada masyarakat terhadap barang elektronik berkualitas dengan harga yang lebih terjangkau (tangan pertama).
            </p>
            <p className="mt-4">
              Terimakasih telah berbelanja di OneStepStore!
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;