import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8 shadow-md">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} CyberBlog. All rights reserved.</p>
        <p className="text-sm">Built with React, Vite, and TailwindCSS</p>
      </div>
    </footer>
  );
};

export default Footer;
