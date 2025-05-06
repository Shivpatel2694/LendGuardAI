import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import LeaveRequestItem from "../components/LeaveRequestItem";

const LeaveHistory = () => {
  const [activeTab, setActiveTab] = useState("approved");
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [rejectedLeaves, setRejectedLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState({
    rejectedLeaveCount: 0,
    approvedLeavesCount: 0,
  });

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

  const fetchHistoryData = async () => {
    if(role === 'ADMIN'){
    const ApprovedLeaveRequestCount = axios.get(
      "http://localhost:8080/api/admin/approved-leaves/managers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const RejectedLeaveRequestsCount = axios.get(
      "http://localhost:8080/api/admin/rejected-leaves/managers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setHistoryData({
        rejectedLeaveCount: (await RejectedLeaveRequestsCount).data,
        approvedLeavesCount: (await ApprovedLeaveRequestCount).data
          .TOTAL_APPROVED_LEAVES,
      });
}
else if(role === 'Manager'){
    const response = axios.get(
        "http://localhost:8080/api/manager/leave-requests/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const RejectedLeaveRequestsCount = (await response).data.rejected;
      const ApprovedLeaveRequestCount = (await response).data.approved;
      setHistoryData({
        rejectedLeaveCount: (await RejectedLeaveRequestsCount).data,
        approvedLeavesCount: (await ApprovedLeaveRequestCount).data
          .TOTAL_APPROVED_LEAVES,
      });
}
   
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  // Function to fetch approved leave requests
  const fetchApprovedLeaves = async () => {
    setIsLoading(true);
    setError(null);

    try {
        if(role === 'ADMIN')
      {  
      const response = await axios.get(
        "http://localhost:8080/api/admin/leave-requests/approved",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApprovedLeaves(response.data);}
      else if(role === 'MANAGER'){
        const response = await axios.get(
            "http://localhost:8080/api/manager/leave-requests/approved",
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
      if(role === 'ADMIN'){
      const response = await axios.get(
        "http://localhost:8080/api/admin/leave-requests/rejected",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRejectedLeaves(response.data);
    }
    else if(role === 'MANAGER'){
      const response = await axios.get(
        "http://localhost:8080/api/manager/leave-requests/rejected",
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

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "approved") {
      fetchApprovedLeaves();
    } else if (activeTab === "rejected") {
      fetchRejectedLeaves();
    }
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Get current list based on active tab
  const getCurrentLeaves = () => {
    return activeTab === "approved" ? approvedLeaves : rejectedLeaves;
  };

  // Refresh current data
  const handleRefresh = () => {
    if (activeTab === "approved") {
      fetchApprovedLeaves();
    } else {
      fetchRejectedLeaves();
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
                  left: activeTab === "approved" ? "20px" : "calc(20px + 150px)",
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
            </div>

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
                    : "Rejected Leave Requests"}
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
                    No {activeTab === "approved" ? "Approved" : "Rejected"}{" "}
                    Leaves
                  </h3>
                  <p
                    className="text-base mb-4"
                    style={{ color: colorPalette.light }}
                  >
                    There are no{" "}
                    {activeTab === "approved" ? "approved" : "rejected"} leave
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
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Stats Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="bg-white p-6 rounded-lg shadow-md"
                style={{ borderRadius: "16px" }}
              >
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: colorPalette.dark }}
                >
                  Approved Leaves
                </h3>
                <div className="flex justify-between items-center">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: colorPalette.primary }}
                  >
                    {historyData.approvedLeavesCount}
                  </span>
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "rgba(60, 126, 252, 0.1)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: colorPalette.primary }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-6 rounded-lg shadow-md"
                style={{ borderRadius: "16px" }}
              >
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: colorPalette.dark }}
                >
                  Rejected Leaves
                </h3>
                <div className="flex justify-between items-center">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: colorPalette.error }}
                  >
                    {historyData.rejectedLeaveCount}
                  </span>
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: colorPalette.error }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveHistory;