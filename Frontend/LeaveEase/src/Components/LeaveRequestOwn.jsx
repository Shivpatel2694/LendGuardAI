import React, { useState } from 'react';
 // Make sure axios is installed and imported

const LeaveRequestItem = ({ request, onDelete, colorPalette}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = () => {
    if (onDelete) {
        setIsLoading(true);
        try{
      onDelete();}catch(error){
        console.error('Error deleting leave request:', error);
        setErrorMessage(error.response?.data || 'Failed to delete leave request');  
      }finally{
        setIsLoading(false);
      }

    }
  };
  

  // Enhanced status styling using the color palette
  const getStatusStyles = (statusValue) => {
    switch (statusValue) {
      case 'APPROVED':
        return {
          color: "#22C55E",
          bgColor: "rgba(34, 197, 94, 0.1)",
          label: "Approved"
        };
      case 'REJECTED':
        return {
          color: "#EF4444",
          bgColor: "rgba(239, 68, 68, 0.1)",
          label: "Rejected"
        };
      case 'PENDING':
        return {
          color: "#F59E0B",
          bgColor: "rgba(245, 158, 11, 0.1)",
          label: "Pending"
        };
      default:
        return {
          color: colorPalette.medium,
          bgColor: "rgba(240, 240, 244, 0.6)",
          label: statusValue || 'Unknown'
        };
    }
  };

  // Enhanced leave type styling
  const getLeaveTypeStyles = (leaveType) => {
    switch (leaveType) {
      case 'CASUAL':
        return {
          color: colorPalette.primary, // #3C7EFC - blue
          bgColor: "rgba(60, 126, 252, 0.1)",
          label: "Casual Leave"
        };
      case 'SICK':
        return {
          color: "#805AD5", // purple
          bgColor: "rgba(128, 90, 213, 0.1)",
          label: "Sick Leave"
        };
      case 'UNPAID':
        return {
          color: "#F97316", // orange
          bgColor: "rgba(249, 115, 22, 0.1)",
          label: "Unpaid Leave"
        };
      case 'PAID':
        return {
          color: "#10B981", // green
          bgColor: "rgba(16, 185, 129, 0.1)",
          label: "Paid Leave"
        };
      default:
        return {
          color: colorPalette.medium, // #474E68 - gray
          bgColor: "rgba(240, 240, 244, 0.6)",
          label: leaveType ? leaveType.replace('_', ' ') : 'Unknown'
        };
    }
  };

  // Format date in a clean, readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const statusStyle = getStatusStyles(request.status);
  const leaveTypeStyle = getLeaveTypeStyles(request.leaveType);
  
  // Extract user information
  const user = request.user || {};
  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.username || 'Unknown User';
  
  const email = user.email || user.username || '';

  // Check if status is PENDING to determine if delete button should be visible
  const isPending = request.status === 'PENDING';

  return (
    <li className="p-4 hover:bg-gray-50 transition-colors duration-150" style={{ backgroundColor: colorPalette.white }}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-medium" style={{ color: colorPalette.dark }}>
              {fullName}
            </h3>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: statusStyle.bgColor,
                color: statusStyle.color
              }}
            >
              {statusStyle.label}
            </span>
          </div>
          
          <p className="text-sm mb-2" style={{ color: colorPalette.light }}>
            {email}
          </p>
          
          <div className="flex items-center gap-3 mb-2">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: leaveTypeStyle.bgColor,
                color: leaveTypeStyle.color
              }}
            >
              {leaveTypeStyle.label}
            </span>
            
            <div className="flex items-center text-sm" style={{ color: colorPalette.medium }}>
              <span>{formatDate(request.startDate)}</span>
              {request.endDate && request.startDate !== request.endDate && (
                <>
                  <span className="mx-2">—</span>
                  <span>{formatDate(request.endDate)}</span>
                </>
              )}
            </div>
          </div>
          
          {errorMessage && (
            <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Status display - always visible */}
          <span 
            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium"
            style={{ 
              backgroundColor: statusStyle.bgColor,
              color: statusStyle.color
            }}
          >
            {statusStyle.label}
          </span>
          
          {/* Delete button - only visible for PENDING status */}
          {isPending && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-3 py-1.5 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center"
              style={{ 
                backgroundColor: "#EF4444",
                boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)" 
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default LeaveRequestItem;