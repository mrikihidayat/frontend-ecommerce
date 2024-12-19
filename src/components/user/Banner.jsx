// src/components/user/Banner.js
import React, { useState, useEffect } from "react";

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const banners = [
    "/public/banner.jpeg", 
    "/public/banner2.jpeg", 
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); 

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      <img
        src={banners[currentIndex]}
        alt={`Banner ${currentIndex + 1}`}
        className="w-full rounded-lg transition-all duration-700"
      />

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition"
      >
        &lt; 
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition"
      >
        &gt; 
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? "bg-black" : "bg-gray-400"} transition-all`}
            onClick={() => setCurrentIndex(index)} 
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Banner;