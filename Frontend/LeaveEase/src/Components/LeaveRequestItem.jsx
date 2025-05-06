import React, { useState } from 'react';
import axios from 'axios'; // Make sure axios is installed and imported

const LeaveRequestItem = ({ request, onApprove, onReject, colorPalette }) => {
  const [status, setStatus] = useState(request.status);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  const role = sessionStorage.getItem('role') || localStorage.getItem('role');


  // Handle approve action with API call
  const handleApprove = async () => {
    setIsLoading(true);
    setErrorMessage('');
    

    try {
      if(role == 'ADMIN'){
      const response = await axios.put(
        `http://localhost:8080/api/admin/leave-requests/${request.id}/status`,
        null, 
        {
          params: { status: "APPROVED" }, 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      
      if (response.status === 200) {
        setStatus('APPROVED');
        onApprove && onApprove();
        // window.location.reload();
      }
    }
    else if(role == 'MANAGER'){
      const response = await axios.put(
        `http://localhost:8080/api/manager/leave-requests/${request.id}/status`,
        null, 
        {
          params: { status: "APPROVED" }, 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      
      if (response.status === 200) {
        setStatus('APPROVED');
        onApprove && onApprove();
        // window.location.reload();
      }
    }
    } catch (error) {
      console.error('Error approving leave request:', error);
      setErrorMessage(error.response?.data || 'Failed to approve leave request');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reject action with API call
  const handleReject = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      if(role == 'ADMIN'){
      const response = await axios.put(
        `http://localhost:8080/api/admin/leave-requests/${request.id}/status`,
        null, 
        {
          params: { status: "REJECTED" }, 
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
      
      if (response.status === 200) {
        setStatus('REJECTED');
        onReject && onReject();
        // window.location.reload();  
      }
    }else {
      const response = await axios.put(
        `http://localhost:8080/api/manager/leave-requests/${request.id}/status`,
        null, 
        {
          params: { status: "REJECTED" }, 
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
      
      if (response.status === 200) {
        setStatus('REJECTED');
        onReject && onReject();
        // window.location.reload();  
      }
    }
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      setErrorMessage(error.response?.data || 'Failed to reject leave request');
    } finally {
      setIsLoading(false);
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

  const statusStyle = getStatusStyles(status);
  const leaveTypeStyle = getLeaveTypeStyles(request.leaveType);
  
  // Extract user information
  const user = request.user || {};
  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.username || 'Unknown User';
  
  const email = user.email || user.username || '';

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
        
        {status === 'PENDING' ? (
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="px-3 py-1.5 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: "#22C55E",
                boxShadow: "0 2px 4px rgba(34, 197, 94, 0.2)" 
              }}
            >
              {isLoading ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="px-3 py-1.5 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: "#EF4444",
                boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)" 
              }}
            >
              {isLoading ? 'Processing...' : 'Reject'}
            </button>
          </div>
        ) : (
          <div className="flex items-center self-end sm:self-center">
            <span 
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium"
              style={{ 
                backgroundColor: statusStyle.bgColor,
                color: statusStyle.color
              }}
            >
              Status: {statusStyle.label}
            </span>
          </div>
        )}
      </div>
    </li>
  );
};

export default LeaveRequestItem;