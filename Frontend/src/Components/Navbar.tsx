import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, ChevronDown, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  showAuthButtons?: boolean;
}

export const Navbar = ({ showAuthButtons = true }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  
  const { logout, currentUser } = useAuth ? useAuth() : { 
    logout: () => console.log('Logout clicked'), 
    currentUser: { email: 'demo@example.com' } 
  };
  const user = currentUser;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold">LendGuardAI</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors">Benefits</a>
            <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors">Demo</a>
          </nav>

          <div className="flex items-center space-x-4">
            {!user && showAuthButtons && (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
            
            {user && (
              <div className="relative flex items-center gap-2" ref={userMenuRef}>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="font-medium text-gray-600 text-sm">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded"
                >
                  <span className="text-sm hidden md:inline">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-48 py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium truncate">
                        {user?.displayName || user?.email || 'User'}
                      </p>
                      <p className="text-gray-500 text-xs">Admin Account</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};