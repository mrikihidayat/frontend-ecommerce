import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ icon, label, link }) => {
  return (
    <Link
      to={link}
      className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
    >
      <i className={`${icon} text-3xl mb-2`} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default CategoryCard;
