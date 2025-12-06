import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../shared/Header';
import Footer from '../shared/Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
