import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { apiRequest, HTTP_METHODS, getUserSession } from "../../utils/utils";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [reviewData, setReviewData] = useState({ orderId: null, review: "", rating: 0 });

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = getUserSession();
        if (!user) {
          alert("User not logged in.");
          return;
        }

        const response = await apiRequest(HTTP_METHODS.GET, "/api/transactions/get");

        if (response && response.code === 0 && response.data) {
          const userOrders = response.data.filter(
            (order) => order.user_id && order.user_id._id === user._id
          );

          const formattedOrders = userOrders.map((order) => ({
            id: order._id,
            product: order.product_id.map((p) => p.product_id.name).join(", "),
            products: order.product_id,
            status: order.shipping?.status || order.status || "Pending",
            price: `Rp ${order.amount.toLocaleString()}`,
            date: new Date(order.createdAt).toLocaleString(),
            rating: 0,
            review: "",
          }));

          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleContactUs = (id) => {
    alert(`Hubungi kami untuk order ID: ${id}`);
  };

  const handleOrderReceived = async (id) => {
    const user = getUserSession();
    if (!user) {
      alert("User not logged in.");
      return;
    }

    try {
      await apiRequest(
        HTTP_METHODS.PUT,
        `/api/transactions/update/${id}`,
        {
          status: "Selesai",
          description: "Order marked as completed by the user.",
        }
      );
      
      await apiRequest(
        HTTP_METHODS.POST,
        "/api/shippings",
        {
          order_id: id,
          user_id: user._id,
          status: "Selesai",
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: "Selesai" } : order
        )
      );

      alert(`Pesanan ID: ${id} telah diterima.`);
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Gagal memperbarui status pesanan.");
    }
  };

  const handleReview = (id) => {
    setReviewData({ orderId: id, review: "", rating: 0 });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleStarClick = (rating) => {
    setReviewData((prevState) => ({ ...prevState, rating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const user = getUserSession();

    try {
      const order = orders.find((order) => order.id === reviewData.orderId);
      for (const product of order.products) {
        await apiRequest(HTTP_METHODS.POST, "/api/reviews", {
          product_id: product.product_id._id,
          user_id: user._id,
          comment: reviewData.review,
          rate: reviewData.rating,
          is_love: reviewData.rating >= 4,
        });
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === reviewData.orderId
            ? { ...order, rating: reviewData.rating, review: reviewData.review }
            : order
        )
      );

      alert(
        `Ulasan untuk Order ID ${reviewData.orderId} telah dikirim:\nRating: ${reviewData.rating}\nUlasan: ${reviewData.review}`
      );
      setReviewData({ orderId: null, review: "", rating: 0 });
    } catch (error) {
      console.error("Failed to submit review", error);
      alert("Gagal mengirim ulasan.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="bg-gray-100 flex-grow py-10">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="w-full bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">My Orders</h3>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 bg-gray-100 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-lg font-medium">{order.product}</h4>
                        <p className="text-sm text-gray-500">Order Date: {order.date}</p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <span
                            className={`font-semibold ${
                              order.status === "Selesai"
                                ? "text-green-600"
                                : order.status === "Diproses"
                                ? "text-yellow-600"
                                : order.status === "Dikirim"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">Price: {order.price}</p>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                    <a
                      href="https://wa.wizard.id/a69a87"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white px-6 py-2 rounded-md inline-block"
                    >
                      Hubungi Kami
                    </a>

                      {order.status === "Dikirim" && (
                        <button
                          onClick={() => handleOrderReceived(order.id)}
                          className="bg-black text-white px-6 py-2 rounded-md"
                        >
                          Pesanan Diterima
                        </button>
                      )}

                      {order.status === "Selesai" && (
                        <button
                          onClick={() => handleReview(order.id)}
                          className="bg-black text-white px-6 py-2 rounded-md"
                        >
                          Kasih Ulasan
                        </button>
                      )}
                    </div>

                    {reviewData.orderId === order.id && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-4">Tulis Ulasan</h4>
                        <form onSubmit={handleReviewSubmit}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium">Rating:</label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  onClick={() => handleStarClick(star)}
                                  className={`cursor-pointer ${
                                    star <= reviewData.rating
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {star <= reviewData.rating ? <FaStar /> : <FaRegStar />}
                                </div>
                              ))}
                            </div>
                          </div>
                          <textarea
                            name="review"
                            value={reviewData.review}
                            onChange={handleReviewChange}
                            placeholder="Tulis ulasan Anda"
                            className="w-full p-4 bg-gray-50 border rounded-md"
                            rows="4"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-black text-white px-6 py-2 rounded-md"
                          >
                            Kirim Ulasan
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrder;
