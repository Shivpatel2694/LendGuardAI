import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../Components/Layout";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialUser = location.state?.user || null;

  // State for form data
  const [formData, setFormData] = useState({
    firstName: initialUser?.firstName || "",
    lastName: initialUser?.lastName || "",
    password: "",
    confirmPassword: "",
  });

  // State for UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
  const userRole = localStorage.getItem("role") || sessionStorage.getItem("role");

  // Form validation
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect if no user data
    if (!initialUser) {
      navigate("/profile");
    }
  }, [initialUser, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Create request payload (exclude fields that are not in the UpdateProfileRequest)
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      
      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      // Determine endpoint based on user role
      let endpoint;
         if (userRole === 'MANAGER') {
        endpoint = 'http://localhost:8080/api/manager/update-profile';
      } else {
        endpoint = 'http://localhost:8080/api/employee/update';
      }
      
       await axios.put(endpoint, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess(true);
      
      // Update user in local storage if needed
      // ...
      
      // Reset password fields
      setFormData(prevData => ({
        ...prevData,
        password: "",
        confirmPassword: ""
      }));
      
      setTimeout(() => {
        navigate("/user-profile", { 
          state: { 
            user: {
              ...initialUser,
              firstName: formData.firstName,
              lastName: formData.lastName
            }
          }
        });
      }, 2000);
      
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/user-profile", { state: { user: initialUser } });
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!initialUser) return '';
    const firstInitial = initialUser.firstName ? initialUser.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = initialUser.lastName ? initialUser.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  // Get background color for avatar based on role
  const getAvatarBackgroundColor = () => {
    switch (userRole) {
      case 'ADMIN':
        return colorPalette.admin;
      case 'MANAGER':
        return colorPalette.primary;
      default:
        return colorPalette.success;
    }
  };

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
                    Edit Profile
                  </h1>
                  <p className="text-md mt-1" style={{ color: colorPalette.light }}>
                    Update your personal information
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 sm:p-8">
                {/* Success Message */}
                {success && (
                  <div 
                    className="mb-6 p-4 rounded-md flex items-center"
                    style={{ backgroundColor: "rgba(46, 204, 113, 0.1)", color: colorPalette.success }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Profile updated successfully. Redirecting...
                  </div>
                )}
                
                {/* Error Message */}
                {error && (
                  <div 
                    className="mb-6 p-4 rounded-md flex items-center"
                    style={{ backgroundColor: "rgba(231, 76, 60, 0.1)", color: colorPalette.danger }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                )}
                
                <h2 className="text-lg font-semibold mb-6" style={{ color: colorPalette.dark }}>
                  Personal Information
                </h2>
                
                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium" style={{ color: colorPalette.light }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ 
                          borderColor: errors.firstName ? colorPalette.danger : "#E8E8EF",
                          color: colorPalette.dark,
                          focusRing: colorPalette.primary
                        }}
                        required
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm" style={{ color: colorPalette.danger }}>
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium" style={{ color: colorPalette.light }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ 
                          borderColor: errors.lastName ? colorPalette.danger : "#E8E8EF",
                          color: colorPalette.dark,
                          focusRing: colorPalette.primary
                        }}
                        required
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm" style={{ color: colorPalette.danger }}>
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Password Section */}
                  <div className="border-t pt-6" style={{ borderColor: "#E8E8EF" }}>
                    <h3 className="text-md font-semibold mb-4" style={{ color: colorPalette.dark }}>
                      Change Password
                    </h3>
                    <p className="text-sm mb-4" style={{ color: colorPalette.light }}>
                      Leave blank if you don't want to change your password
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium" style={{ color: colorPalette.light }}>
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{ 
                              borderColor: errors.password ? colorPalette.danger : "#E8E8EF",
                              color: colorPalette.dark,
                              focusRing: colorPalette.primary
                            }}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={handleTogglePassword}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              style={{ color: colorPalette.medium }}
                            >
                              {showPassword ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              )}
                            </svg>
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm" style={{ color: colorPalette.danger }}>
                            {errors.password}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: colorPalette.light }}>
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ 
                            borderColor: errors.confirmPassword ? colorPalette.danger : "#E8E8EF",
                            color: colorPalette.dark,
                            focusRing: colorPalette.primary
                          }}
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm" style={{ color: colorPalette.danger }}>
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gray-50 border-t" style={{ backgroundColor: "#F8F8FB", borderColor: "#E8E8EF" }}>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      backgroundColor: colorPalette.white,
                      color: colorPalette.dark,
                      border: `1px solid ${colorPalette.light}`,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      backgroundColor: colorPalette.primary,
                      boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)"
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;