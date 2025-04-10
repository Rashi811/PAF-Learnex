import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, User } from 'lucide-react';
import NavbarSearch from './NavbarSearch';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="ml-4 font-bold text-xl text-white">
              <span className="flex items-center">
                <span className="bg-white text-blue-600 rounded-full h-8 w-8 flex items-center justify-center mr-2">S</span>
                SocialApp
              </span>
            </Link>
          </div>
          
          <div className="flex items-center flex-1 max-w-md mx-6">
            <NavbarSearch />
          </div>
          
          <div className="flex items-center">
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-blue-600 overflow-hidden focus:outline-none border-2 border-blue-300 hover:border-white transition-colors"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {currentUser?.name ? (
                  <span className="font-medium text-sm">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                ) : (
                  <User size={20} className="text-blue-600" />
                )}
              </button>
              
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-purple-100">
                  <div className="px-4 py-3 border-b border-purple-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                    <p className="text-sm font-medium text-blue-800">{currentUser?.name}</p>
                  </div>
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;