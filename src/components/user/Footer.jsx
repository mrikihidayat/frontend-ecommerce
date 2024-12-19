import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white p-6 mt-8">
         <div className="container mx-auto flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          {/* Kolom 1 */}
          <div className="text-center">
            <h4 className="font-bold text-lg mb-3">One Step Store</h4>
            <p>Direct to You, One Step</p>
            <p>Belanja murah dari tangan pertama</p>
          </div>

          {/* Kolom 2 */}
          <div className="text-center">
            <h4 className="font-bold text-lg mb-3">Support</h4>
            <p>Customer Services</p>
            <p>ecommercevocasia@gmail.com</p>
            <p>+62812-8193-9653</p>
          </div>

          {/* Kolom 3 */}
          <div className="text-center">
            <h4 className="font-bold text-lg mb-3">Payment</h4>
            <p>BCA</p>
            <p>BRI</p>
            <p>MANDIRI</p>
            <p>PERMATA</p>
            <p>CIMB</p>
          </div>
        </div>
        <p className="text-center mt-4 text-gray-500">
          © Copyright One Step Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer

