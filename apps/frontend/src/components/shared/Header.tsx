import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-300 hover:text-blue-200">
          CyberBlog
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-blue-300 transition-colors duration-200">Home</Link>
          </li>
          <li>
            <Link to="/news" className="hover:text-blue-300 transition-colors duration-200">News</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
