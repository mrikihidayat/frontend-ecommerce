import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/navbar/AdminNavbar";
import AdminSidebar from "../components/admin/sidebar/AdminSidebar";
function RootLayout() {
  const [isFooterOpen, setFooterOpen] = useState(false);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#f8f4f0]">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <AdminNavbar />
      </div>
      {/* kontent */}
      <div className="flex-1 mt-20 mb-16 p-4"> 
        <Outlet />
      </div>
      {/* Sidebar */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white shadow-md">
        <AdminSidebar />
      </div>
      {/* Footer */}
      {/* <div
        className={`fixed bottom-20 right-4 z-50 ${
          isFooterOpen ? "h-auto" : "h-12 w-12"
        }`}
      >
        <button
          className={`rounded-full bg-blue-500 text-white p-3 shadow-lg ${
            isFooterOpen ? "w-64" : "w-12"
          }`}
          onClick={() => setFooterOpen(!isFooterOpen)}
        >
          {isFooterOpen ? "Close Menu" : "+"}
        </button>

        {isFooterOpen && (
          <div className="mt-2 bg-white rounded-lg shadow-lg p-4">
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500">About</a></li>
              <li><a href="#" className="hover:text-blue-500">Careers</a></li>
              <li><a href="#" className="hover:text-blue-500">Policy</a></li>
              <li><a href="#" className="hover:text-blue-500">Contact</a></li>
            </ul>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default RootLayout