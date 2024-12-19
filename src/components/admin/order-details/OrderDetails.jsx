import React, { useState } from "react";
import { getUserSession, apiRequest, HTTP_METHODS } from "../../../utils/utils";

const OrderDetails = ({ order }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  
  const handleSaveStatus = async () => {
    const user = getUserSession();
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await apiRequest(
        HTTP_METHODS.PUT,
        `/api/transactions/update/${order.id}`,
        {
          status: 'success',
          description: "Updated transaction description"
        }
      );

      await apiRequest(
        HTTP_METHODS.POST,
        "/api/shippings",
        {
          order_id: order.id,
          user_id: user._id,
          status: selectedStatus
        }
      );

      alert("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const subtotal = order.subtotal || 0;
  const tax = order.tax || 0;
  const discount = order.discount || 0;
  const shippingRate = order.shippingRate || 0;
  const total = order.total || 0;

  return (
    <div className="p-4 bg-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 shadow rounded-lg mb-6">
        <div>
          <p className="text-lg font-bold">
            Orders ID: #{order.id}
            <span
              className={`px-2 py-1 rounded-full text-sm ml-2 ${
                order.status === "Pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {order.status}
            </span>
          </p>
          <div className="flex items-center text-gray-600 mt-2">
            <span>&#x1F4C5;</span>
            <p className="ml-2">{order.date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <select
            className="border px-4 py-2 rounded-md text-gray-700"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Change Status</option>
            <option value="Diproses">Diproses</option>
            <option value="Dikirim">Dikirim</option>
          </select>
          <button
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={handleSaveStatus}
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-bold text-lg mb-2">Customer</h2>
          <p>Full Name: {order.customer.name || "-"}</p>
          <p>Email: {order.customer.email || "-"}</p>
          <p>Phone: {order.customer.phone || "-"}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-bold text-lg mb-2">Order Info</h2>
          <p>Shipping: {order.shipping || "0"}</p>
          <p>Payment Method: {order.paymentMethod || "-"}</p>
          <p>Status: {order.status || "-"}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-bold text-lg mb-2">Deliver to</h2>
          <p>Address: {order.deliveryAddress || "-"}</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="font-bold text-lg mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{product.name || "-"}</td>
                  <td className="px-4 py-2">{product.orderId || "-"}</td>
                  <td className="px-4 py-2">{product.quantity || 0}</td>
                  <td className="px-4 py-2">Rp {product.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-right mt-4">
          <p>Subtotal: Rp {subtotal.toLocaleString()}</p>
          <p>Tax (20%): Rp {tax.toLocaleString()}</p>
          <p>Discount: Rp {discount.toLocaleString()}</p>
          <p>Shipping Rate: Rp {shippingRate.toLocaleString()}</p>
          <h3 className="text-lg font-bold">Total: Rp {total.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
