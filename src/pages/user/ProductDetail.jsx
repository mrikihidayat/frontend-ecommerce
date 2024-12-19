import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { apiRequest, HTTP_METHODS } from "../../utils/utils";
import { FaStar, FaRegStar } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    return savedCart || [];
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(""); 
  const [reviews, setReviews] = useState([]); // State untuk ulasan produk

    useEffect(() => {
    const fetchProductById = async () => {
      setLoading(true);
      try {
        const response = await apiRequest(HTTP_METHODS.GET, `/api/products/${id}`);
        if (response.code === 0) {
          setProduct(response.data);
          await fetchReviews(response.data._id); // Ambil ulasan setelah produk berhasil diambil
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async (productId) => {
      try {
        const response = await apiRequest(HTTP_METHODS.GET, `/api/reviews/product/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("_token")}`, // Menambahkan Bearer token
          },
        });
        if (response.code === 0) {
          setReviews(response.data); // Set ulasan yang diambil
        } else {
          console.error("Error fetching reviews:", response.info);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProductById();
  }, [id]);

  const checkAuthAndProceed = (action) => {
    const token = localStorage.getItem("_token");
    if (!token) {
      navigate("/Login");
    } else {
      action();
    }
  };

  const addToCart = () => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    setNotification("Product added to cart");
    setTimeout(() => setNotification(""), 3000);
  };

  const buyNow = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-600">Loading product details...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-red-500">Product not found.</h2>
      </div>
    );
  }

  return (
    <div>
      {localStorage.getItem("_token") ? <Navbar /> : null}

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative w-full md:w-1/2">
            <img src={`data:image/png;base64,${product.image}`} alt={product.name} className="w-full h-auto rounded-lg shadow-lg mx-auto" />
          </div>

          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-4">Stock: {product.stock}</p>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-2xl md:text-3xl font-bold text-green-600">Rp {product.price.toLocaleString()}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <button className="bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition w-full md:w-auto" onClick={() => checkAuthAndProceed(addToCart)}>Add to Cart</button>
              <button className="bg-gray-100 text-black px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition w-full md:w-auto" onClick={() => checkAuthAndProceed(buyNow)}>Buy Now</button>
            </div>
          </div>
        </div>

        {notification && (
          <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition">
            <p>{notification}</p>
          </div>
        )}

        {/* Product Details Section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Product Details</h2>
          <p className="text-lg">{product.description}</p> {/* Menampilkan detail produk jika ada */}
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <p className="font-bold">Anonymous</p>
                  <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx}>
                        {idx < review.rate ? (
                          <FaStar className="text-yellow-500" />
                        ) : (
                          <FaRegStar className="text-gray-300" />
                        )}
                      </span>
                    ))}
                    <p className="text-gray-600 text-sm ml-2">({review.rate}/5)</p>
                  </div>
                  <p className="text-lg text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;