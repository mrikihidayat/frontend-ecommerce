import React from 'react';
import { FaTachometerAlt, FaBox, FaTags, FaTrademark, FaUsers } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="fixed bottom-0 left-0 w-full z-40 bg-black text-white shadow-md flex justify-around items-center h-16">
      {/* Dashboard */}
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          `flex flex-col items-center text-sm font-bold ${
            isActive ? 'text-white underline' : 'text-gray-400'
          } hover:text-white`
        }
      >
        <FaTachometerAlt />
        Dashboard
      </NavLink>

      {/* Products */}
      <NavLink
        to="/dashboard/all-products"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm font-bold ${
            isActive ? 'text-white underline' : 'text-gray-400'
          } hover:text-white`
        }
      >
        <FaBox />
        Products
      </NavLink>

      {/* Categories */}
      <NavLink
        to="/dashboard/all-categories"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm font-bold ${
            isActive ? 'text-white underline' : 'text-gray-400'
          } hover:text-white`
        }
      >
        <FaTags />
        Categories
      </NavLink>

      {/* Brands */}
      <NavLink
        to="/dashboard/all-brands"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm font-bold ${
            isActive ? 'text-white underline' : 'text-gray-400'
          } hover:text-white`
        }
      >
        <FaTrademark />
        Brands
      </NavLink>

      {/* Users */}
      <NavLink
        to="/dashboard/all-users"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm font-bold ${
            isActive ? 'text-white underline' : 'text-gray-400'
          } hover:text-white`
        }
      >
        <FaUsers />
        Users
      </NavLink>
    </aside>
  );
};

export default AdminSidebar;
