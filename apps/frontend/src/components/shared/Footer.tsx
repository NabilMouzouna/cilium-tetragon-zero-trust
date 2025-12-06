import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-100 border-t border-surface-200 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-on-surface-variant">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} NubleNews. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
