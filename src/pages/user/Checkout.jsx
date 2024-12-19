import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { apiRequest, HTTP_METHODS, getUserSession } from "../../utils/utils";

const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [supportedBanks, setSupportedBanks] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [sellerMessage, setSellerMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [checkPaymentError, setCheckPaymentError] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserAddress = async () => {
      const user = getUserSession();
      if (!user) return;
      try {
        const response = await apiRequest(HTTP_METHODS.POST, `/api/users/detail/${user._id}`);
        if (response.data.extra1 && response.data.extra1.address) {
          setSelectedAddress(response.data.extra1.address);
        } else {
          setSelectedAddress(null);
        }
      } catch (error) {}
    };

    const fetchCart = async () => {
      const user = getUserSession();
      if (!user) return;
      try {
        const cartResponse = await apiRequest(HTTP_METHODS.GET, `/api/cart/user/${user._id}`);
        const updatedOrderDetails = cartResponse.data.map((item) => ({
          id: item._id,
          productId: item.product_id._id,
          name: item.product_id.name,
          quantity: item.quantity,
          price: item.product_id.price,
          image: `data:image/jpeg;base64,${item.product_id.image}`,
        }));
        setOrderDetails(updatedOrderDetails || []);
      } catch (error) {}
    };

    const fetchSupportedBanks = async () => {
      try {
        const banksResponse = await apiRequest(HTTP_METHODS.GET, "/api/transactions/supported-banks");
        setSupportedBanks(banksResponse.data || []);
      } catch (error) {}
    };

    fetchUserAddress();
    fetchCart();
    fetchSupportedBanks();
  }, []);

  const handleCheckout = async () => {
    if (!selectedAddress || !deliveryOption || !paymentOption) {
      alert("Please complete all the selections.");
      return;
    }

    const user = getUserSession();
    const orderId = `ORDER${Date.now()}`;
    const totalAmount = getTotalAmount();

    const transactionDataRequest = {
      order_id: orderId,
      user_id: user._id,
      product_id: orderDetails.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      bank: paymentOption,
      amount: totalAmount,
      payment_type: "bank_transfer",
      description: sellerMessage || "Transaction from checkout page",
    };

    try {
      const response = await apiRequest(HTTP_METHODS.POST, "/api/transactions/create", transactionDataRequest);
      if (response.data) {
        setTransactionData(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {}
  };

  const getTotalAmount = () => {
    return orderDetails.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  useEffect(() => {
    if (transactionData && transactionData.expiry_time) {
      const targetTime = new Date(transactionData.expiry_time).getTime();
      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetTime - now;
        if (distance < 0) {
          setTimeRemaining("Expired");
          clearInterval(timerInterval);
        } else {
          const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((distance / (1000 * 60)) % 60);
          const seconds = Math.floor((distance / 1000) % 60);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      };
      updateCountdown();
      const timerInterval = setInterval(updateCountdown, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [transactionData]);

  const handleCheckPayment = async () => {
    setCheckPaymentError(null);
    if (!transactionData || !transactionData.order_id) return;
    const orderId = transactionData.order_id;
    try {
      const response = await apiRequest(HTTP_METHODS.GET, `/api/transactions/status/${orderId}`);
      if (response.data && response.code === 0 && response.data.status_code === "200") {
        await deleteAllCartItems();
        setIsModalOpen(false);
        alert("Pembayaran Success.");
      } else {
        setCheckPaymentError("Pembayaran belum berhasil, silakan coba lagi nanti.");
      }
    } catch (error) {
      setCheckPaymentError("Terjadi kesalahan saat memeriksa pembayaran.");
    }
  };

  const deleteAllCartItems = async () => {
    const user = getUserSession();
    if (!user) return;
    for (const item of orderDetails) {
      await apiRequest(HTTP_METHODS.DELETE, `/api/cart/${item.id}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/3 bg-white shadow-xl rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Delivery Address</h2>
              {selectedAddress ? (
                <div className="space-y-4">
                  <p><span className="font-semibold">Street:</span> {selectedAddress.street}</p>
                  <p><span className="font-semibold">Province:</span> {selectedAddress.province}</p>
                  <p><span className="font-semibold">Regency:</span> {selectedAddress.regency}</p>
                  <p><span className="font-semibold">District:</span> {selectedAddress.district}</p>
                  <p><span className="font-semibold">Village:</span> {selectedAddress.village}</p>
                  <p><span className="font-semibold">Zip Code:</span> {selectedAddress.zipCode}</p>
                </div>
              ) : (
                <p className="text-gray-500">
                  No address found. Please go to <strong>My Address</strong> to add one.
                </p>
              )}
            </div>
            <div className="w-full lg:w-2/3 bg-white shadow-xl rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {orderDetails.map((item) => (
                  <div key={item.id} className="flex justify-between items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <span>{item.name}</span>
                    </div>
                    <span>{item.quantity} x Rp. {item.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-6">
                  <span>Total:</span>
                  <span>Rp. {getTotalAmount().toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Add Note (Optional)</h3>
                <textarea
                  value={sellerMessage}
                  onChange={(e) => setSellerMessage(e.target.value)}
                  placeholder="Color, Size, Pattern, etc."
                  className="w-full p-3 bg-gray-50 border rounded-md shadow-sm"
                  rows="4"
                ></textarea>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Delivery Option</h3>
                <select
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="w-full p-3 bg-gray-50 border rounded-md shadow-sm"
                  required
                >
                  <option value="">Select Delivery Option</option>
                  <option value="Standard Delivery">Standard Delivery 1-2 Days (Free Shipping)</option>
                </select>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Payment Option</h3>
                <select
                  value={paymentOption}
                  onChange={(e) => setPaymentOption(e.target.value)}
                  className="w-full p-3 bg-gray-50 border rounded-md shadow-sm"
                  required
                >
                  <option value="">Select Payment Option</option>
                  {supportedBanks.map((bank) => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-black text-white px-6 py-2 rounded-md mt-6"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-md w-full">
          {!transactionData ? (
            <div>Loading...</div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Transaction Created Successfully</h2>
              <div className="space-y-2">
                <p><strong>Order ID:</strong> {transactionData.order_id}</p>

                {transactionData.va_numbers && transactionData.va_numbers.length > 0 ? (
                  <>
                    <p><strong>Bank:</strong> {transactionData.va_numbers[0].bank}</p>
                    <p><strong>VA Number:</strong> {transactionData.va_numbers[0].va_number}</p>
                  </>
                ) : transactionData.bill_key && transactionData.biller_code ? (
                  <>
                    <p><strong>Bank:</strong> Mandiri Bill</p>
                    <p><strong>Bill Key:</strong> {transactionData.bill_key}</p>
                    <p><strong>Biller Code:</strong> {transactionData.biller_code}</p>
                  </>
                ) : transactionData.permata_va_number ? (
                  <>
                    <p><strong>Bank:</strong> {transactionData.va_numbers[0].bank}</p>
                    <p><strong>VA Number:</strong> {transactionData.permata_va_number}</p>
                  </>
                ) : (
                  <p className="text-red-500">Payment Information Not Available</p>
                )}

                <p><strong>Gross Amount:</strong> Rp. {parseInt(transactionData.gross_amount).toLocaleString()}</p>
                <p><strong>Time Remaining to Expire:</strong> {timeRemaining ? timeRemaining : "Calculating..."}</p>
              </div>

              {checkPaymentError && (
                <p className="text-red-500 mt-2">{checkPaymentError}</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCheckPayment}
                  className="bg-black text-white px-4 py-2 rounded-md"
                >
                  Cek Pembayaran
                </button>
              </div>
            </>
          )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
