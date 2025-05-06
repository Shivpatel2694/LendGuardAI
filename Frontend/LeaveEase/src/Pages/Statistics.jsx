import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import LeaveRequestItem from "../components/LeaveRequestOwn";

const LeaveHistory = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [rejectedLeaves, setRejectedLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ isDeleting: false, message: null });

  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  // Color palette from Cobalt Essence design
  const colorPalette = {
    primary: "#3C7EFC", // Blue
    dark: "#404258", // Dark slate
    medium: "#474E68", // Medium slate
    light: "#6B728E", // Light slate
    background: "#F8F8FB", // Very light background
    white: "#FFFFFF",
    borderColor: "#E8E8EF",
    error: "#EF4444", // Red
    success: "#22C55E", // Green
    warning: "#F59E0B", // Orange
  };

  const token =
    sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

  // Function to fetch approved leave requests
  const fetchApprovedLeaves = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if(role === 'MANAGER') {  
        const response = await axios.get(
          "http://localhost:8080/api/manager/leave-requests/approved/self",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setApprovedLeaves(response.data);
      } else {
        const response = await axios.get(
          "http://localhost:8080/api/employee/leave-requests/approved",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setApprovedLeaves(response.data);
      }
    } catch (err) {
      console.error("Error fetching approved leave requests:", err);
      setError(
        "Failed to load approved leave requests. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch rejected leave requests
  const fetchRejectedLeaves = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if(role === 'MANAGER'){
        const response = await axios.get(
          "http://localhost:8080/api/manager/leave-requests/rejected/self",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setRejectedLeaves(response.data);
      }
      else {
        const response = await axios.get(
          "http://localhost:8080/api/employee/leave-requests/rejected",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setRejectedLeaves(response.data);
      }
    } catch (err) {
      console.error("Error fetching rejected leave requests:", err);
      setError(
        "Failed to load rejected leave requests. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch pending leave requests
  const fetchPendingLeaves = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if(role === 'MANAGER'){
        const response = await axios.get(
          "http://localhost:8080/api/manager/leave-requests/pending/self",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setPendingLeaves(response.data);
      }
      else {
        const response = await axios.get(
          "http://localhost:8080/api/employee/leave-requests/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setPendingLeaves(response.data);
      }
    } catch (err) {
      console.error("Error fetching pending leave requests:", err);
      setError(
        "Failed to load pending leave requests. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a leave request
  const deleteLeaveRequest = async (requestId) => {
    setDeleteStatus({ isDeleting: true, message: null });
    
    try {
      const endpoint = role === 'MANAGER' 
        ? `http://localhost:8080/api/manager/delete-leave/${requestId}`
        : `http://localhost:8080/api/employee/leave-requests/${requestId}`;
      
      await axios.delete(endpoint, {  
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update the lists after successful deletion
      if (activeTab === "approved") {
        setApprovedLeaves(approvedLeaves.filter(leave => leave.id !== requestId));
      } else if (activeTab === "rejected") {
        setRejectedLeaves(rejectedLeaves.filter(leave => leave.id !== requestId));
      } else if (activeTab === "pending") {
        setPendingLeaves(pendingLeaves.filter(leave => leave.id !== requestId));
      }
      
      setDeleteStatus({ 
        isDeleting: false, 
        message: { type: "success", text: "Leave request deleted successfully." } 
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteStatus({ isDeleting: false, message: null });
      }, 3000);
    } catch (err) {
      console.error("Error deleting leave request:", err);
      setDeleteStatus({ 
        isDeleting: false, 
        message: { type: "error", text: "Failed to delete leave request. Please try again." } 
      });
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "approved") {
      fetchApprovedLeaves();
    } else if (activeTab === "rejected") {
      fetchRejectedLeaves();
    } else if (activeTab === "pending") {
      fetchPendingLeaves();
    }
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Get current list based on active tab
  const getCurrentLeaves = () => {
    if (activeTab === "approved") return approvedLeaves;
    if (activeTab === "rejected") return rejectedLeaves;
    if (activeTab === "pending") return pendingLeaves;
    return [];
  };

  // Refresh current data
  const handleRefresh = () => {
    if (activeTab === "approved") {
      fetchApprovedLeaves();
    } else if (activeTab === "rejected") {
      fetchRejectedLeaves();
    } else if (activeTab === "pending") {
      fetchPendingLeaves();
    }
  };

  // Tab style generator
  const getTabStyle = (tab) => {
    const isActive = activeTab === tab;
    return {
      position: "relative",
      color: isActive ? colorPalette.primary : colorPalette.light,
      fontWeight: isActive ? "600" : "500",
      backgroundColor: "transparent",
      padding: "12px 16px",
      marginRight: "4px",
      borderRadius: "8px 8px 0 0",
      transition: "all 0.3s ease",
      overflow: "hidden",
      zIndex: isActive ? "1" : "0"
    };
  };

  // Get the position of the active tab indicator
  const getTabIndicatorPosition = () => {
    switch(activeTab) {
      case "approved": return "20px";
      case "rejected": return "calc(20px + 150px)";
      case "pending": return "calc(20px + 300px)";
      default: return "20px";
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-2xl font-semibold"
            style={{ color: colorPalette.dark }}
          >
            Leave History
          </h1>

          <div className="mt-6">
            {/* Enhanced Tabs */}
            <div
              className="flex mb-4 border-b relative"
              style={{ borderColor: colorPalette.borderColor }}
            >
              {/* Active Tab Indicator - Animated Underline */}
              <div
                className="absolute bottom-0 transition-all duration-300 ease-in-out h-0.5"
                style={{
                  backgroundColor: colorPalette.primary,
                  left: getTabIndicatorPosition(),
                  width: "110px",
                  transform: "translateX(0)",
                  height: "3px",
                  borderRadius: "3px 3px 0 0",
                  boxShadow: `0 0 6px ${colorPalette.primary}40`
                }}
              ></div>

              <button
                className="flex items-center focus:outline-none transition-all duration-300 ease-in-out"
                style={getTabStyle("approved")}
                onClick={() => handleTabChange("approved")}
              >
                <span className="relative z-10">
                  <div className="flex items-center">
                    Approved Leaves
                  </div>
                  {activeTab === "approved" && (
                    <div
                      className="absolute inset-0 rounded-t-lg opacity-10"
                      style={{ backgroundColor: colorPalette.primary }}
                    ></div>
                  )}
                </span>
              </button>

              <button
                className="flex items-center focus:outline-none transition-all duration-300 ease-in-out"
                style={getTabStyle("rejected")}
                onClick={() => handleTabChange("rejected")}
              >
                <span className="relative z-10">
                  <div className="flex items-center">
                    Rejected Leaves
                  </div>
                  {activeTab === "rejected" && (
                    <div
                      className="absolute inset-0 rounded-t-lg opacity-10"
                      style={{ backgroundColor: colorPalette.primary }}
                    ></div>
                  )}
                </span>
              </button>

              <button
                className="flex items-center focus:outline-none transition-all duration-300 ease-in-out"
                style={getTabStyle("pending")}
                onClick={() => handleTabChange("pending")}
              >
                <span className="relative z-10">
                  <div className="flex items-center">
                    Pending Leaves
                  </div>
                  {activeTab === "pending" && (
                    <div
                      className="absolute inset-0 rounded-t-lg opacity-10"
                      style={{ backgroundColor: colorPalette.primary }}
                    ></div>
                  )}
                </span>
              </button>
            </div>

            {/* Status message for delete operation */}
            {deleteStatus.message && (
              <div 
                className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
                  deleteStatus.message.type === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <span>
                  {deleteStatus.message.type === "success" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {deleteStatus.message.text}
                </span>
                <button 
                  onClick={() => setDeleteStatus({ isDeleting: false, message: null })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Leave Requests List */}
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-in-out"
              style={{ borderRadius: "16px" }}
            >
              <div
                className="border-b border-gray-200 p-4"
                style={{
                  backgroundColor: colorPalette.background,
                  borderColor: colorPalette.borderColor,
                }}
              >
                <h2
                  className="text-lg font-medium"
                  style={{ color: colorPalette.dark }}
                >
                  {activeTab === "approved"
                    ? "Approved Leave Requests"
                    : activeTab === "rejected"
                    ? "Rejected Leave Requests"
                    : "Pending Leave Requests"}
                </h2>
              </div>

              {isLoading ? (
                <div className="p-10 text-center">
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    style={{ color: colorPalette.primary }}
                  ></div>
                  <p className="mt-2" style={{ color: colorPalette.light }}>
                    Loading...
                  </p>
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <p className="text-red-500">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-4 px-4 py-2 text-white rounded-md flex items-center mx-auto focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: colorPalette.primary,
                      boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Try Again
                  </button>
                </div>
              ) : getCurrentLeaves().length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: colorPalette.light }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: colorPalette.dark }}
                  >
                    No {
                      activeTab === "approved" 
                        ? "Approved" 
                        : activeTab === "rejected" 
                        ? "Rejected" 
                        : "Pending"
                    } Leaves
                  </h3>
                  <p
                    className="text-base mb-4"
                    style={{ color: colorPalette.light }}
                  >
                    There are no{" "}
                    {
                      activeTab === "approved" 
                        ? "approved" 
                        : activeTab === "rejected" 
                        ? "rejected" 
                        : "pending"
                    } leave
                    requests at the moment.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 text-white rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: colorPalette.primary,
                      boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </button>
                </div>
              ) : (
                <ul
                  className="divide-y divide-gray-200"
                  style={{ borderColor: colorPalette.borderColor }}
                >
                  {getCurrentLeaves().map((request) => (
                    <LeaveRequestItem
                      key={request.id}
                      request={request}
                      colorPalette={{
                        primary: colorPalette.primary,
                        dark: colorPalette.dark,
                        medium: colorPalette.medium,
                        light: colorPalette.light,
                        background: colorPalette.background,
                        white: colorPalette.white,
                      }}
                      onDelete={() => deleteLeaveRequest(request.id)}
                      role={role}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveHistory;