import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../Components/Layout";

const ManagerProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for manager data
  const [manager, setManager] = useState(location.state?.manager || null);
  const [loading, setLoading] = useState(!location.state?.manager);
  const [error, setError] = useState(null);
  const [isUpdatingCredits, setIsUpdatingCredits] = useState(false);
  const [creditsToAdd, setCreditsToAdd] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");
  
  // Maximum allowed credits to add at once
  const MAX_CREDITS = 5;
  
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
    danger: "#E74C3C"
  };

  useEffect(() => {
    // If we don't have manager data from navigation state, fetch it
    if (!manager) {
      fetchManagerData();
    }
  }, [id]);

  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const fetchManagerData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (role === "ADMIN") {
      const response = await axios.get(`http://localhost:8080/api/admin/manager/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setManager(response.data);
    }
    else if(role === "MANAGER") {
      const response = await axios.get(`http://localhost:8080/api/manager/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setManager(response.data);
    }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching manager data:", err);
      setError("Failed to load manager profile. Please try again.");
      setLoading(false);
    }
  };

  // Function to handle credit increase
  const increaseCredits = async () => {
    setIsUpdatingCredits(true);
    try {
      if (role === "ADMIN") {
      // Make the API call to increase credits
      await axios.put(
        `http://localhost:8080/api/admin/managers/${id}/increase-credits`, 
        {},  // No request body needed
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            creditUnits: creditsToAdd  // Send as a query parameter
          }
        }
      );
      
      // Refetch the manager data to get the updated values from the server
      await fetchManagerData();
      
      // Reset the input after successful update
      setCreditsToAdd(1);
      setIsModalOpen(false);
    }
    else if(role === "MANAGER") {
      await axios.put(
        `http://localhost:8080/api/manager/employees/${id}/increase-credits`, 
        {},  // No request body needed
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            credits: creditsToAdd  // Send as a query parameter
          }
        }
      );
      
      // Refetch the manager data to get the updated values from the server
      await fetchManagerData();
      
      // Reset the input after successful update
      setCreditsToAdd(1);
      setIsModalOpen(false);
    }
      // toast.success(`Successfully added ${creditsToAdd} credit(s)`);
    } catch (err) {
      console.error("Error updating credits:", err);
      alert("Failed to update credits. Please try again.");
    } finally {
      setIsUpdatingCredits(false);
    }
  };

  // Function to safely update credits value
  const updateCreditsToAdd = (value) => {
    // Ensure value is at least 1 and at most MAX_CREDITS
    const newValue = Math.min(MAX_CREDITS, Math.max(1, value));
    setCreditsToAdd(newValue);
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
              style={{ borderColor: colorPalette.primary }}
            ></div>
            <p className="mt-4" style={{ color: colorPalette.dark }}>
              Loading manager profile...
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
              style={{ color: colorPalette.dark }}
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
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: colorPalette.primary, boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)" }}
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Get role label
  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'MANAGER': return 'Manager';
      case 'EMPLOYEE': return 'Employee';
      default: return role ? role.replace('_', ' ') : 'Unknown';
    }
  };

  // Get role style
  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          bg: "rgba(128, 90, 213, 0.1)",
          text: "#805AD5"
        };
      case 'MANAGER':
        return {
          bg: "rgba(60, 126, 252, 0.1)",
          text: colorPalette.primary
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
    if (!manager) return '';
    const firstInitial = manager.firstName ? manager.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = manager.lastName ? manager.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  // Get background color for avatar based on role
  const getAvatarBackgroundColor = () => {
    if (!manager) return colorPalette.medium;
    switch (manager.role) {
      case 'ADMIN': return '#805AD5';
      case 'MANAGER': return colorPalette.primary;
      default: return colorPalette.medium;
    }
  };

  // Create progress bar for leave balance
  const LeaveProgressBar = ({ current, total, color }) => {
    const percentage = Math.min(100, Math.round((current / total) * 100));
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
        <div 
          className="h-2.5 rounded-full" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
    );
  };

  const roleStyle = getRoleStyle(manager?.role || 'EMPLOYEE');

  return (
    <Layout>
      <div className="min-h-screen py-6" style={{ backgroundColor: colorPalette.background }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center mr-4 text-sm font-medium focus:outline-none"
              style={{ color: colorPalette.primary }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Manager List
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ borderRadius: "16px" }}>
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: "#E8E8EF" }}>
              <div className="flex items-center">
                <div 
                  className="flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-medium mr-6"
                  style={{ backgroundColor: getAvatarBackgroundColor() }}
                >
                  {getInitials()}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold" style={{ color: colorPalette.dark }}>
                    {manager.firstName} {manager.lastName}
                  </h1>
                  <p className="text-md mt-1" style={{ color: colorPalette.light }}>
                    {manager.email}
                  </p>
                  <div className="mt-2">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium"
                      style={{ 
                        backgroundColor: roleStyle.bg,
                        color: roleStyle.text
                      }}
                    >
                      {getRoleLabel(manager.role)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4" style={{ color: colorPalette.dark }}>
                Manager Details
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: colorPalette.light }}>
                      Department
                    </p>
                    <p className="mt-1" style={{ color: colorPalette.dark }}>
                      {manager.department?.name || 'Not assigned'}
                    </p>
                  </div>
                  
                </div>
                
                {/* Leave Balance Section */}
                <div className="border-t pt-4 mt-6" style={{ borderColor: "#E8E8EF" }}>
                  <h3 className="text-md font-semibold mb-3" style={{ color: colorPalette.dark }}>
                    Leave Balance
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4" style={{ backgroundColor: "#F8F8FB" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Remaining Leaves */}
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium" style={{ color: colorPalette.medium }}>
                            Remaining Leaves
                          </p>
                          <p className="text-sm font-bold" style={{ color: colorPalette.dark }}>
                            {manager.leaveBalance?.remainingLeaves} / {manager.leaveBalance?.totalLeaves}
                          </p>
                        </div>
                        <LeaveProgressBar 
                          current={manager.leaveBalance?.remainingLeaves} 
                          total={manager.leaveBalance?.totalLeaves} 
                          color={colorPalette.primary} 
                        />
                      </div>
                      
                      {/* Sick Leaves */}
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium" style={{ color: colorPalette.medium }}>
                            Sick Leaves
                          </p>
                          <p className="text-sm font-bold" style={{ color: colorPalette.dark }}>
                            {manager.leaveBalance?.sickLeaves}
                          </p>
                        </div>
                        <LeaveProgressBar 
                          current={manager.leaveBalance?.sickLeaves} 
                          total={10} // Assuming max sick leaves is 10
                          color={colorPalette.success} 
                        />
                      </div>
                      
                      {/* Casual Leaves */}
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium" style={{ color: colorPalette.medium }}>
                            Casual Leaves
                          </p>
                          <p className="text-sm font-bold" style={{ color: colorPalette.dark }}>
                            {manager.leaveBalance?.casualLeaves}
                          </p>
                        </div>
                        <LeaveProgressBar 
                          current={manager.leaveBalance?.casualLeaves} 
                          total={5} // Assuming max casual leaves is 5
                          color={colorPalette.warning} 
                        />
                      </div>
                      
                      {/* Paid Leaves */}
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium" style={{ color: colorPalette.medium }}>
                            Paid Leaves
                          </p>
                          <p className="text-sm font-bold" style={{ color: colorPalette.dark }}>
                            {manager.leaveBalance?.paidLeaves}
                          </p>
                        </div>
                        <LeaveProgressBar 
                          current={manager.leaveBalance?.paidLeaves} 
                          total={15} // Assuming max paid leaves is 15
                          color={colorPalette.primary} 
                        />
                      </div>
                      
                      {/* Unpaid Leaves */}
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium" style={{ color: colorPalette.medium }}>
                            Unpaid Leaves
                          </p>
                          <p className="text-sm font-bold" style={{ color: colorPalette.dark }}>
                            {manager.leaveBalance?.unpaidLeaves}
                          </p>
                        </div>
                        <LeaveProgressBar 
                          current={manager.leaveBalance?.unpaidLeaves} 
                          total={10} // Assuming max unpaid leaves is 10
                          color={colorPalette.danger} 
                        />
                      </div>
                      
                      {/* Credits with more prominent update button */}
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium" style={{ color: colorPalette.medium }}>
                            Credits
                          </p>
                          <div className="flex items-center">
                            <p className="text-sm font-bold mr-3" style={{ color: colorPalette.dark }}>
                              {manager.leaveBalance?.credits}
                            </p>
                            <button
                              className="text-sm px-3 py-1 rounded-md text-white font-medium shadow-sm"
                              style={{ 
                                backgroundColor: colorPalette.primary,
                                boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)",
                              }}
                              onClick={() => setIsModalOpen(true)}
                            >
                              Update Credits
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="border-t pt-4 mt-6" style={{ borderColor: "#E8E8EF" }}>
                  <h3 className="text-md font-semibold mb-3" style={{ color: colorPalette.dark }}>
                    Contact Information
                  </h3>
                  <p className="flex items-center" style={{ color: colorPalette.medium }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: colorPalette.primary }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {manager.email}
                  </p>
                </div>

                {/* Account Status */}
                <div className="border-t pt-4 mt-6" style={{ borderColor: "#E8E8EF" }}>
                  <h3 className="text-md font-semibold mb-3" style={{ color: colorPalette.dark }}>
                    Account Status
                  </h3>
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{ 
                        backgroundColor: manager.enabled ? colorPalette.success : colorPalette.danger 
                      }}
                    ></div>
                    <span style={{ color: colorPalette.medium }}>
                      {manager.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Update Modal with backdrop blur */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.5)"
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colorPalette.dark }}>
                Update Credits
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: colorPalette.medium }}>
                Current Credits: <span className="font-bold">{manager.leaveBalance?.credits}</span>
              </label>
              <div className="mt-4">
                <p className="text-sm mb-2" style={{ color: colorPalette.medium }}>
                  Credits to add (max {MAX_CREDITS}):
                </p>
                <div className="flex items-center">
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-l-md border text-lg font-medium"
                    style={{ 
                      borderColor: "#E8E8EF",
                      color: colorPalette.primary 
                    }}
                    onClick={() => updateCreditsToAdd(creditsToAdd - 1)}
                    disabled={creditsToAdd <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={MAX_CREDITS}
                    value={creditsToAdd}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        updateCreditsToAdd(value);
                      }
                    }}
                    className="w-20 h-10 text-center border-t border-b outline-none text-lg"
                    style={{ borderColor: "#E8E8EF" }}
                  />
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-r-md border text-lg font-medium"
                    style={{ 
                      borderColor: "#E8E8EF",
                      color: creditsToAdd >= MAX_CREDITS ? colorPalette.light : colorPalette.primary,
                      opacity: creditsToAdd >= MAX_CREDITS ? 0.5 : 1
                    }}
                    onClick={() => updateCreditsToAdd(creditsToAdd + 1)}
                    disabled={creditsToAdd >= MAX_CREDITS}
                  >
                    +
                  </button>
                </div>
                
                <p className="text-sm mt-3" style={{ color: colorPalette.light }}>
                  New total will be: <span className="font-bold">{(manager.leaveBalance?.credits || 0) + creditsToAdd}</span> credits
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium rounded-md border"
                style={{ 
                  color: colorPalette.medium,
                  borderColor: "#E8E8EF" 
                }}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium rounded-md text-white shadow-sm"
                style={{ 
                  backgroundColor: colorPalette.primary,
                  boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)",
                }}
                onClick={increaseCredits}
                disabled={isUpdatingCredits}
              >
                {isUpdatingCredits ? 'Updating...' : 'Update Credits'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManagerProfile;