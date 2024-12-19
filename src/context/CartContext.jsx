import React, { createContext, useState } from "react";

// Membuat CartContext
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Apple iPhone 14 Pro Max",
      price: 13000000,
      image: "https://down-id.img.susercontent.com/file/id-11134207-7r98x-lmj19eukqtfyb6@resize_w900_nl.webp",
      code: "#23565670384",
      quantity: 1,
    },
    {
      id: 2,
      name: "Samsung Galaxy S23 Ultra",
      price: 15000000,
      image: "https://down-id.img.susercontent.com/file/id-11134207-7r98x-lmj19eukqtfyb6@resize_w900_nl.webp",
      code: "#7654987432",
      quantity: 2,
    },
  ]);

  // Fungsi untuk menghapus item
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Fungsi untuk memperbarui kuantitas
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return; // Jangan izinkan kuantitas kurang dari 1
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
