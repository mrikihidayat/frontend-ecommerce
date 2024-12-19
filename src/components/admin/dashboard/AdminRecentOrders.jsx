import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { apiRequest, HTTP_METHODS } from "../../../utils/utils"; // Pastikan path utils sesuai

function AdminRecentOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, "/api/transactions/get");
        if (response && response.code === 0) {
          setOrders(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-[16px] overflow-hidden p-6">
      <div className="border-b-2 flex justify-between items-center pb-4 mb-4">
        <span className="text-gray-500">&#x1F37F;</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-[40px]">Details</th>
              <th className="px-4 py-3">Product(s)</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Shipping Status</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <tr key={order._id} className="border-t even:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/dashboard/order-details/${order._id}`}
                        className="flex items-center justify-center text-blue-500 group relative"
                      >
                        <FaEye className="text-blue-500 transition-opacity duration-200 opacity-100 group-hover:opacity-0" />
                        <span className="absolute transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                          View Details
                        </span>
                      </NavLink>
                    </td>
                    <td className="px-4 py-3">
                      {order.product_id && order.product_id.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {order.product_id.map((prodItem, idx) => (
                            <li key={idx}>
                              {prodItem.product_id.name} (x{prodItem.quantity})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{order.order_id}</td>
                    <td className="px-4 py-3">{date}</td>
                    <td className="px-4 py-3">{order.user_id?.name || "-"}</td>
                    <td className="px-4 py-3">
                      {order.status === "pending" ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                          Pending
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          {order.shipping && typeof order.shipping === "object" ? order.shipping.status : order.status || "Unknown"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">Rp {order.amount.toLocaleString()}</td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t even:bg-gray-50">
                <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRecentOrders;
