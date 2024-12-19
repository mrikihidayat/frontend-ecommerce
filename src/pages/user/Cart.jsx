import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { apiRequest, HTTP_METHODS, getUserSession } from "../../utils/utils";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const user = getUserSession();
      if (!user) {
        console.error("User not logged in");
        return;
      }
      try {
        const response = await apiRequest(
          HTTP_METHODS.GET,
          `/api/cart/user/${user._id}`
        );
        const updatedCart = response.data.map((item) => ({
          id: item._id,
          name: item.product_id.name,
          price: item.product_id.price,
          quantity: item.quantity,
          image: `data:image/jpeg;base64,${item.product_id.image}`,
        }));
        setCart(updatedCart || []);
      } catch (error) {
        console.error("Failed to fetch cart data", error);
      }
    };
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await apiRequest(HTTP_METHODS.DELETE, `/api/cart/${productId}`);
      const updatedCart = cart.filter((item) => item.id !== productId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await apiRequest(HTTP_METHODS.PUT, `/api/cart/${productId}`, {
        quantity: newQuantity,
      });
      const updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const increaseQuantity = (productId) => {
    const product = cart.find((item) => item.id === productId);
    if (!product) return;
    const newQuantity = product.quantity + 1;
    updateQuantity(productId, newQuantity);
  };

  const decreaseQuantity = (productId) => {
    const product = cart.find((item) => item.id === productId);
    if (!product || product.quantity <= 1) return;
    const newQuantity = product.quantity - 1;
    updateQuantity(productId, newQuantity);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, product) => total + (product.price * product.quantity || 0),
      0
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
          Your Shopping Cart
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {cart.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="py-3 px-4 text-left">Product</th>
                      <th className="py-3 px-4 text-left">Price</th>
                      <th className="py-3 px-4 text-left">Quantity</th>
                      <th className="py-3 px-4 text-left">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-sm sm:text-lg">
                              {product.name}
                            </h3>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-green-600 font-semibold">
                          Rp{" "}
                          {(
                            (product.price || 0) * product.quantity
                          ).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 flex items-center gap-2 sm:gap-4">
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={() => decreaseQuantity(product.id)}
                          >
                            <AiOutlineMinus className="text-lg sm:text-xl" />
                          </button>
                          <span className="text-sm sm:text-lg font-semibold">
                            {product.quantity}
                          </span>
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={() => increaseQuantity(product.id)}
                          >
                            <AiOutlinePlus className="text-lg sm:text-xl" />
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => removeFromCart(product.id)}
                          >
                            <FaTrashAlt className="text-lg sm:text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 mt-6 text-center lg:text-left">
                Your cart is currently empty.
              </p>
            )}
          </div>
          <div className="w-full lg:w-1/3 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center lg:text-left">
              Order Summary
            </h2>
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-lg">Total:</span>
              <span className="text-xl sm:text-2xl font-semibold text-green-600">
                Rp {getTotalPrice().toLocaleString()}
              </span>
            </div>
            <div className="mt-6 text-center lg:text-left">
              {cart.length > 0 ? (
                <button
                  className="bg-black text-white py-3 px-6 sm:px-8 rounded-lg hover:bg-gray-800 transition"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              ) : (
                <button
                  className="bg-gray-300 text-white py-3 px-6 sm:px-8 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Your cart is empty
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
