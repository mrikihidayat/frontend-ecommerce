import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const NavbarLogin = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutPopupOpen, setIsAboutPopupOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const handleAboutClick = (e) => {
    e.preventDefault(); // Mencegah navigasi ke halaman About
    setIsAboutPopupOpen(true);
  };

  const closeAboutPopup = () => {
    setIsAboutPopupOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    <header className="bg-black text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-8">
        <img src="/public/logo.png" alt="Logo" className="h-10 mr-3" />
        
        <button
          onClick={handleMobileMenuToggle}
          className="lg:hidden text-white text-xl"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav
          ref={mobileMenuRef}
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-black lg:relative lg:top-0 lg:left-auto lg:w-auto lg:flex lg:items-center lg:space-x-6`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
            <Link
              to="https://wa.wizard.id/32620f"
              className="px-4 py-2 lg:px-0 lg:py-0 text-white hover:text-gray-300"
            >
              Contact
            </Link>
            <Link
              to="/about"
              onClick={handleAboutClick}
              className="px-4 py-2 lg:px-0 lg:py-0 text-white hover:text-gray-300"
            >
              About
            </Link>
            <Link to="/SignUp" className="px-4 py-2 lg:px-0 lg:py-0 text-white hover:text-gray-300">Sign Up</Link>
            <Link to="/Login" className="px-4 py-2 lg:px-0 lg:py-0 text-white hover:text-gray-300">Login</Link>
          </div>
        </nav>
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

export default NavbarLogin;