import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // const [userRole, setUserRole] = useState('');
  const [roleInitial, setRoleInitial] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status and get user info on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      setIsAuthenticated(!!authToken);

      if (authToken) {
        const role =
          localStorage.getItem("role") || sessionStorage.getItem("role");

        // Set role and role initial
        // setUserRole(role || '');
        if (role === "ADMIN") {
          setIsAdmin(true);
          setRoleInitial("A");
        } else if (role === "MANAGER") {
          setRoleInitial("M");
          setIsManager(true);
        } else {
          // Default to User/Employee
          setRoleInitial("U");
        }
      }
    };

    checkAuthStatus();

    // Add event listener for storage changes (in case user logs in/out in another tab)
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      // Clear any existing timeout when component unmounts
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownOpen = () => {
    // Clear any existing timeout to prevent closing
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    // Set a timeout to close the dropdown after 3 seconds
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 3000); // 3 seconds delay
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear storage regardless of API response
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("role");
      sessionStorage.removeItem("role");

      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsManager(false);
      navigate("/login");
    }
  };

  // Function to determine if a path is active
  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Get link class based on active state
  const getLinkClass = (path) => {
    const baseClass =
      "inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors duration-200";
    return isActivePath(path)
      ? `${baseClass} border-primary-light text-primary-darker font-semibold`
      : `${baseClass} border-transparent text-primary-medium hover:text-primary-dark hover:border-primary-light/50`;
  };

  const getMobileLinkClass = (path) => {
    const baseClass = "block px-3 py-2 rounded-md text-base font-medium";
    return isActivePath(path)
      ? `${baseClass} bg-primary-light/10 text-primary-darker font-semibold`
      : `${baseClass} text-primary-medium hover:bg-primary-light/10 hover:text-primary-dark`;
  };

  // Get color based on role
  const getRoleColor = () => {
    switch (roleInitial) {
      case "A":
        return "bg-red-500";
      case "M":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-light flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="ml-1 sm:ml-2 text-lg sm:text-xl font-bold text-primary-darker truncate">
                LeaveEase
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-1 lg:space-x-2 overflow-x-auto">
              {( !isAdmin && !isManager )? (
                <>
                  <Link to="/" className={getLinkClass("/")}>
                    Home
                  </Link>
                  <Link to="/features" className={getLinkClass("/features")}>
                    Features
                  </Link>
                  <Link to="/about" className={getLinkClass("/about")}>
                    About
                  </Link>
                </>
              ) : (
                <></>
              )}
              {isAuthenticated && (
                <Link to="/holidays" className={getLinkClass("/holidays")}>
                  Holidays
                </Link>
              )}
              {isAdmin && isAuthenticated && (
                <>
                  <Link to="/managers" className={getLinkClass("/managers")}>
                    Managers
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className={getLinkClass("/admin")}
                  >
                    Admin
                  </Link>
                </>
              )}
              {!isAdmin && isAuthenticated && (
                <Link to="/dashboard" className={getLinkClass("/dashboard")}>
                  Dashboard
                </Link>
              )}
              {isManager && isAuthenticated && (
                <>
                  <Link to="/employees" className={getLinkClass("/employees")}>
                    Employees
                  </Link>
                  <Link
                    to="/manager/dashboard"
                    className={getLinkClass("/manager/dashboard")}
                  >
                    Manage
                  </Link>
                </>
              )}
              {(isAuthenticated && (isAdmin || isManager)) && (
                <Link to="/history" className={getLinkClass("/history")}>
                  History
                </Link>
              )}
            </div>
          </div>

          {/* Desktop login/user menu */}
          <div className="hidden md:ml-4 md:flex md:items-center">
            {isAuthenticated ? (
              <div
                className="flex items-center relative"
                ref={dropdownRef}
                onMouseEnter={handleDropdownOpen}
                onMouseLeave={handleDropdownClose}
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                  aria-label="User menu"
                >
                  <div
                    className={`h-9 w-9 rounded-full ${getRoleColor()} flex items-center justify-center text-white font-bold shadow-sm cursor-pointer`}
                  >
                    {roleInitial}
                  </div>
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 top-10 mt-1 w-48 bg-white shadow-lg rounded-md py-1 z-10 border border-gray-100"
                    onMouseEnter={handleDropdownOpen}
                    onMouseLeave={handleDropdownClose}
                  >
                    <Link
                      to="/user-profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-3 inline-flex items-center px-4 py-2 border border-primary-light rounded-md text-primary-darker font-medium bg-white hover:bg-primary-light/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {isAuthenticated && (
              <div className="mr-2">
                <div
                  className={`h-8 w-8 rounded-full ${getRoleColor()} flex items-center justify-center text-white font-bold shadow-sm text-xs`}
                >
                  {roleInitial}
                </div>
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-medium hover:text-primary-dark hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-light"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1 px-2">
        {(
           !isAdmin && !isManager )? (
                <>
                  <Link to="/" className={getMobileLinkClass("/")}>
                    Home
                  </Link>
                  <Link to="/features" className={getMobileLinkClass("/features")}>
                    Features
                  </Link>
                  <Link to="/about" className={getMobileLinkClass("/about")}>
                    About
                  </Link>
                </>
              ) : (
                <></>
              )}
          {isAuthenticated && (
            <Link to="/holidays" className={getMobileLinkClass("/holidays")}>
              Holidays
            </Link>
          )}
          {isAdmin && isAuthenticated && (
            <>
              <Link to="/managers" className={getMobileLinkClass("/managers")}>
                Managers
              </Link>
              <Link to="/admin/dashboard" className={getMobileLinkClass("/admin")}>
                Admin
              </Link>
            </>
          )}
          {!isAdmin && isAuthenticated && (
            <Link to="/dashboard" className={getMobileLinkClass("/dashboard")}>
              Dashboard
            </Link>
          )}
          {isManager && isAuthenticated && (
            <>
              <Link to="/employees" className={getMobileLinkClass("/employees")}>
                Employees
              </Link>
              <Link
                to="/manager/dashboard"
                className={getMobileLinkClass("/manager/dashboard")}
              >
                Manage
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link to="/history" className={getMobileLinkClass("/history")}>
              History
            </Link>
          )}
        </div>
        {isAuthenticated ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="mt-3 space-y-1 px-2">
              <Link
                to="/user-profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 bg-gradient-to-r from-primary-light to-primary-darker text-black font-medium rounded-md"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
