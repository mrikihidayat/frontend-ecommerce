import React from "react";
import ProductDetailForm from "../../components/admin/product-detail/ProductDetailForm";
const AdminProductDetailPage = () => {
  const product = {
    name: "Battery",
    description: "High-quality battery for long-lasting performance.",
    category: "Electronics",
    brand: "Generic",
    stock: 500,
    price: 110.40,
    image: "https://via.placeholder.com/150",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ProductDetailForm product={product} />
    </div>
  );
};

export default AdminProductDetailPage;
