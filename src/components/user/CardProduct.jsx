import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const CardProduct = ({ id, name, price, image, rating = 0 }) => {
  // Validasi jika harga dan gambar tidak ada atau tidak valid
  const validPrice = price ? `Rp ${price.toLocaleString()}` : "Harga Tidak Tersedia";
  const validImage = image ? image : "default-image.jpg"; // Gambar default jika image tidak ada
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition hover:scale-105">
      <Link to={`/product/${id}`}>
        <img
          src={validImage}
          alt={name}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-green-600 text-lg font-bold mt-2">{validPrice}</p>
      </Link>
      <div className="flex items-center mt-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>
            {index < rating ? (
              <FaStar className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
          </span>
        ))}
        <p className="ml-2 text-sm text-gray-500">{rating} / 5</p>
      </div>
    </div>
  );
};

export default CardProduct
