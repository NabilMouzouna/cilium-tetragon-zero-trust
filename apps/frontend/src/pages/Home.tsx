import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-10"
    >
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to CyberBlog
      </h1>
      <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
        Your go-to source for insights into Cybersecurity, DevOps, DevSecOps, and Software Engineering.
      </p>
      <Link
        to="/news"
        className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Explore Our Articles
      </Link>
    </motion.div>
  );
};

export default HomePage;
