import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../Components/Layout";

const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for user data
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(!location.state?.user);
  const [error, setError] = useState(null);
  
  // Color palette to match other components
  const colorPalette = {  
    primary: "#3C7EFC",
    dark: "#404258",
    medium: "#474E68",
    light: "#6B728E",
    background: "#F5F5F9",
    white: "#FFFFFF",
    success: "#2ECC71",
    warning: "#F39C12",
    danger: "#E74C3C",
    admin: "#805AD5"
  };

  // Get authentication details from storage
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
//   const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const userRole = localStorage.getItem("role") || sessionStorage.getItem("role");
  const isAdmin = userRole === "ADMIN";

  useEffect(() => {
    // If we don't have user data from navigation state, fetch it
    if (!user) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
        let endpoint;
        if(userRole === 'ADMIN')
      // Endpoint for admin user
     {  endpoint = `http://localhost:8080/api/admin/1`;}
     else if(userRole === 'MANAGER')
     {
        endpoint = `http://localhost:8080/api/manager/me`;

     }
     else{
      endpoint = `http://localhost:8080/api/employee/me`;
     }
      
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load your profile. Please try again.");
      setLoading(false);
    }
  };

  // Redirect to edit profile page
  const handleEditProfile = () => {
    navigate("/edit-profile", { state: { user } });
  };

  // Redirect to leaves list page
  const handleViewLeaves = () => {
    navigate("/statistics");
  };

  // Render loading state
  if (loading) {
    return (
      <Layout>
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: colorPalette.background }}
        >
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto"
              style={{ borderColor: colorPalette.admin }}
            ></div>
            <p className="mt-4" style={{ color: colorPalette.dark }}>
              Loading admin profile...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Render error state
  if (error) {
    return (
      <Layout>
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: colorPalette.background }}
        >
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: colorPalette.danger }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-semibold mt-4" style={{ color: colorPalette.dark }}>
              Error
            </h2>
            <p className="mt-2" style={{ color: colorPalette.light }}>
              {error}
            </p>
            <button
              onClick={() => fetchUserData()}
              className="mt-4 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: colorPalette.admin, boxShadow: "0 2px 4px rgba(128, 90, 213, 0.3)" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Get role label
  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'MANAGER': return 'Manager';
      case 'EMPLOYEE': return 'Employee';
      default: return role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'User';
    }
  };

  // Get role style
  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          bg: "rgba(128, 90, 213, 0.1)",
          text: colorPalette.admin
        };
      case 'MANAGER':
        return {
          bg: "rgba(60, 126, 252, 0.1)",
          text: colorPalette.primary
        };
      case 'EMPLOYEE':
        return {
          bg: "rgba(46, 204, 113, 0.1)",
          text: colorPalette.success
        };
      default:
        return {
          bg: "#F0F0F4",
          text: colorPalette.medium
        };
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return '';
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  // Get background color for avatar based on role
  const getAvatarBackgroundColor = () => {
    return colorPalette.admin; // Always admin color for admin profile
  };

  // Format authorities for display
  const formatAuthorities = () => {
    if (!user.authorities) return [];
    return user.authorities.map(auth => auth.authority.replace('ROLE_', ''));
  };

  const roleStyle = getRoleStyle('ADMIN');

  return (
    <Layout>
      <div className="min-h-screen py-6" style={{ backgroundColor: colorPalette.background }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ borderRadius: "16px" }}>
            {/* Profile Header */}
            <div className="p-6 sm:p-8 border-b" style={{ borderColor: "#E8E8EF" }}>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div 
                  className="flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-medium mb-4 sm:mb-0 sm:mr-6 mx-auto sm:mx-0"
                  style={{ backgroundColor: getAvatarBackgroundColor() }}
                >
                  {getInitials()}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-semibold" style={{ color: colorPalette.dark }}>
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-md mt-1" style={{ color: colorPalette.light }}>
                    {user.email}
                  </p>
                  <div className="mt-2">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium"
                      style={{ 
                        backgroundColor: roleStyle.bg,
                        color: roleStyle.text
                      }}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-6" style={{ color: colorPalette.dark }}>
                Personal Information
              </h2>
              
              <div className="space-y-6">
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium" style={{ color: colorPalette.light }}>
                      Full Name
                    </p>
                    <p className="mt-1 text-md" style={{ color: colorPalette.dark }}>
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium" style={{ color: colorPalette.light }}>
                      Email Address
                    </p>
                    <p className="mt-1 text-md" style={{ color: colorPalette.dark }}>
                      {user.email}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium" style={{ color: colorPalette.light }}>
                      Username
                    </p>
                    <p className="mt-1 text-md" style={{ color: colorPalette.dark }}>
                      {user.username}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium" style={{ color: colorPalette.light }}>
                      User ID
                    </p>
                    <p className="mt-1 text-md" style={{ color: colorPalette.dark }}>
                      {user.id}
                    </p>
                  </div>
                </div>
                
                {/* Administrative Information */}
                <div className="border-t pt-6" style={{ borderColor: "#E8E8EF" }}>
                  <h3 className="text-md font-semibold mb-4" style={{ color: colorPalette.dark }}>
                    Administrative Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium" style={{ color: colorPalette.light }}>
                        Authorities
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {formatAuthorities().map((authority, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 rounded-full text-xs"
                            style={{ 
                              backgroundColor: "rgba(128, 90, 213, 0.1)",
                              color: colorPalette.admin
                            }}
                          >
                            {authority}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Account Status */}
                <div className="border-t pt-6" style={{ borderColor: "#E8E8EF" }}>
                  <h3 className="text-md font-semibold mb-4" style={{ color: colorPalette.dark }}>
                    Account Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ 
                          backgroundColor: user.enabled ? colorPalette.success : colorPalette.danger 
                        }}
                      ></div>
                      <span style={{ color: colorPalette.medium }}>
                        {user.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Only shown for non-admin users */}
            <div className="p-6 bg-gray-50 border-t" style={{ backgroundColor: "#F8F8FB", borderColor: "#E8E8EF" }}>
              {!isAdmin && (
                <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleViewLeaves}
                    className="flex items-center justify-center px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      backgroundColor: colorPalette.primary,
                      boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    View Leaves
                  </button>
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      backgroundColor: colorPalette.white,
                      color: colorPalette.dark,
                      border: `1px solid ${colorPalette.light}`,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: colorPalette.medium }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              )}
              {isAdmin && (
                <div className="flex flex-col sm:flex-row sm:justify-end">
                  {/* No buttons for admin profile */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;