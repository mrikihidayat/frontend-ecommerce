import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest, HTTP_METHODS } from "../../utils/utils";
import OrderDetails from "../../components/admin/order-details/OrderDetails";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, `/api/transactions/get/${id}`);
        if (response && response.code === 0 && response.data) {
          const data = response.data;
          const userId = data.user_id?._id || null;

          let addressData = null;
          if (userId) {
            const userResponse = await apiRequest(HTTP_METHODS.POST, `/api/users/detail/${userId}`);
            if (userResponse && userResponse.data && userResponse.data.extra1 && userResponse.data.extra1.address) {
              addressData = `${userResponse.data.extra1.address.street}, ${userResponse.data.extra1.address.village}, ${userResponse.data.extra1.address.district}, ${userResponse.data.extra1.address.regency}, ${userResponse.data.extra1.address.province}, ${userResponse.data.extra1.address.zipCode}`;
            }
          }

          const customer = {
            name: data.user_id?.name || null,
            email: data.user_id?.email || null,
            phone: data.user_id?.phone || null
          };

          const products = data.product_id.map((p) => {
            const prodName = p.product_id?.name || null;
            const prodPrice = p.product_id?.price || 0;
            const quantity = p.quantity || 0;
            return {
              name: prodName,
              orderId: data.order_id || null,
              quantity: quantity,
              total: prodPrice * quantity
            };
          });

          const transformedOrder = {
            id: data._id,
            status: data.shipping && typeof data.shipping === "object" ? data.shipping.status : data.status || "Unknown",
            date: data.createdAt ? new Date(data.createdAt).toLocaleString() : null,
            customer: customer,
            shipping: null,
            paymentMethod: data.payment_type || null,
            deliveryAddress: addressData || null,
            products: products,
            subtotal: data.amount || null,
            tax: null,
            discount: null,
            shippingRate: null,
            total: data.amount || null
          };

          setOrderData(transformedOrder);
        }
      } catch (error) {}
    };
    fetchOrder();
  }, [id]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return <OrderDetails order={orderData} />;
};

export default OrderDetailsPage;
