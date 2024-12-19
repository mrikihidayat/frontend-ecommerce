import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { apiRequest, HTTP_METHODS, getUserSession } from "../../utils/utils";

const ProductCard = ({ id, name, price, image, rating }) => {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const user = getUserSession();
      if (!user) {
        console.error("User  not logged in");
        return;
      }

      const requestData = {
        product_id: id,
        user_id: user._id,
        quantity: 1,
      };

      const response = await apiRequest(
        HTTP_METHODS.POST,
        "/api/cart",
        requestData
      );

      if (response.code === 0) {
        alert('Product added to cart');
      }
      
      console.log(`Product ${name} added to cart`, response);
    } catch (error) {
      console.error("Failed to add product to cart", error);
    }
  };

  const handleBuyNow = async () => {
    try {
      const user = getUserSession();
      if (!user) {
        console.error("User  not logged in");
        return;
      }

      const requestData = {
        product_id: id,
        user_id: user._id,
        quantity: 1,
      };

      const response = await apiRequest(
        HTTP_METHODS.POST,
        "/api/cart",
        requestData
      );

      if (response.code === 0) {
        alert('Product added to cart');
        navigate(`/checkout`);
      }
      
      console.log(`Product ${name} added to cart`, response);
    } catch (error) {
      console.error("Failed to add product to cart", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
      <Link to={`/product/${id}`} className="block">
        <img src={image} alt={name} className="w-full h-48 object-contain mb-4" />
        <h3 className="text-lg font-semibold">{name}</h3>
      </Link>
      <p className="text-sm text-gray-600">{rating} ★</p>
      <p className="text-xl font-bold text-black">{price}</p>

      <div className="mt-4 flex flex-col md:flex-row justify-between gap-4">
        <button
          onClick={handleAddToCart}
          className="flex items-center bg-black text-white p-2 rounded-md hover:bg-gray-800"
        >
          <FaShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="bg-red-600 text-white px-5 py-2 rounded-md text-sm hover:bg-red-700 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;