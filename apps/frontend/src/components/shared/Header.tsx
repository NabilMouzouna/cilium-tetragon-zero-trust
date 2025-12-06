import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Code, Search, UserCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-surface-100 bg-white border-b border-surface-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-on-surface">
                NubleNews
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-200'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-200'
                  }`
                }
              >
                News
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="bg-surface-200 border border-surface-200 rounded-md py-2 px-4 w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="h-5 w-5 text-on-surface-variant absolute top-1/2 right-3 transform -translate-y-1/2" />
            </div>
            <button className="p-2 rounded-full hover:bg-surface-200">
              <UserCircle className="h-6 w-6 text-on-surface-variant" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
