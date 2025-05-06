import React, { useState, useEffect } from 'react';
import { Calendar, Users, Building, Clock, CheckCircle, XCircle } from 'lucide-react';
import Layout from '../Components/Layout';
import axios from 'axios';
import { MultiStepLoader } from "../Components/ui/multi-step-loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeaveManagementDashboard = () => {
  // Get role and token from storage
  const role = localStorage.getItem('role') || sessionStorage.getItem('role') || 'EMPLOYEE';
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  // State for leave balances - no default values, will be populated from API
  const [leaveBalances, setLeaveBalances] = useState({});

  // Loading states
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);

  // Multi-step loader states
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState(null);

  // Define loading state messages
  const leaveLoadingStates = [
    { text: "Validating leave dates..." },
    { text: "Checking leave balance..." },
    { text: "Processing request..." },
    { text: "Sending notification to administrator..." },
    { text: "Leave request submitted successfully!" },
  ];

  // Define error state
  const errorState = [
    { text: "There seems to be some error. Please try again." },
  ];

  // Form state
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'PAID',
    reason: ''
  });

  // Leave types (matching the backend enum)
  const leaveTypes = ['PAID', 'SICK', 'CASUAL', 'UNPAID'];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm({
      ...leaveForm,
      [name]: value
    });
  };

  // Handle form submission with multi-step loader
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);
    setLoadingSteps(true);
    setCurrentStep(0);
    
    // Validate form inputs
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.leaveType) {
      alert("Please fill in all required fields");
      setLoadingSteps(false);
      return;
    }
    
    // Start the loading steps
    setTimeout(() => setCurrentStep(1), 800);
    
    // API endpoint based on role
    const endpoint = role === 'MANAGER' 
      ? 'http://localhost:8080/api/manager/apply-leave'
      : 'http://localhost:8080/api/employee/apply-leave';
    
    // Prepare request data
    const requestData = new URLSearchParams();
    requestData.append('startDate', leaveForm.startDate);
    requestData.append('endDate', leaveForm.endDate);
    requestData.append('leaveType', leaveForm.leaveType);
    requestData.append('reason', leaveForm.reason);
    
    // Move to processing step
    setTimeout(() => setCurrentStep(2), 1600);
    
    // Make API call with token in headers
    axios.post(endpoint, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Leave request submitted:', response.data);
        
        // Move to notification step
        setCurrentStep(3);
        
        // Simulate email notification delay
        setTimeout(() => {
          setCurrentStep(4);
          
          // Wait on success message
          setTimeout(() => {
            // Reset form
            setLeaveForm({
              startDate: '',
              endDate: '',
              leaveType: 'PAID',
              reason: ''
            });
            
            // Hide loader after some time
            setTimeout(() => {
              setLoadingSteps(false);
            }, 1000);
          }, 1500);
        }, 1000);
      })
      .catch(error => {
        console.error('Error submitting leave request:', error);
        setSubmitError("Error submitting leave request. Please try again.");
        setLoadingSteps(false);
        
        // Display toast error notification with custom styling
        toast.error("There was an error submitting your request.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'bg-red-50',
          bodyClassName: 'text-red-700 font-medium',
          progressClassName: 'bg-red-600',
          style: {
            borderLeft: '4px solid #EF4444',
          },
          icon: <XCircle className="text-red-500 h-5 w-5" />
        });
        
        // Add delay before refreshing leave balances
        setTimeout(() => {
          // Show loading state
          setIsLoadingBalances(true);
          
          // After a short delay, fetch the data
          setTimeout(() => {
            fetchLeaveBalances();
          }, 1500); // 1.5 second delay to refresh data
        }, 500); // Small initial delay
      });
  };

  // Fetch leave balances function
  const fetchLeaveBalances = () => {
    setIsLoadingBalances(true);
    
    const endpoint = role === 'MANAGER'
      ? 'http://localhost:8080/api/manager/leave-balance/self'
      : 'http://localhost:8080/api/employee/leave-balance';
    
    axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setLeaveBalances(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave balances:', error);
      })
      .finally(() => {
        setIsLoadingBalances(false);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      fetchLeaveBalances();
    }
  }, []);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen p-6">
        {/* Add ToastContainer with custom styling */}
        <ToastContainer
          position="top-right" 
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="rounded-lg shadow-md"
        />
        
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">
            {role === 'MANAGER' ? 'Manager' : 'Employee'} Leave Dashboard
          </h1>
          
          {/* Leave Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            {isLoadingBalances ? (
              <div className="col-span-6 text-center py-8">
                <p className="text-gray-500">Loading leave balances...</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium uppercase">Total Leaves</span>
                  <div className="flex items-center mt-2">
                    <Calendar className="text-blue-500 h-8 w-8 mr-2" />
                    <span className="text-3xl font-bold text-gray-800">{leaveBalances.totalLeaves || 0}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium uppercase">Remaining</span>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="text-green-500 h-8 w-8 mr-2" />
                    <span className="text-3xl font-bold text-gray-800">{leaveBalances.remainingLeaves || 0}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium uppercase">Sick Leaves</span>
                  <div className="flex items-center mt-2">
                    <Clock className="text-red-500 h-8 w-8 mr-2" />
                    <span className="text-3xl font-bold text-gray-800">{leaveBalances.sickLeaves || 0}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium uppercase">Casual Leaves</span>
                  <div className="flex items-center mt-2">
                    <Building className="text-purple-500 h-8 w-8 mr-2" />
                    <span className="text-3xl font-bold text-gray-800">{leaveBalances.casualLeaves || 0}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium uppercase">Paid Leaves</span>
                  <div className="flex items-center mt-2">
                    <Calendar className="text-blue-500 h-8 w-8 mr-2" />
                    <span className="text-3xl font-bold text-gray-800">{leaveBalances.paidLeaves || 0}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <span className="text-gray-500 text-sm font-medium uppercase">Credits</span>
                  <div className="flex items-center mt-2">
                    <Users className="text-orange-500 h-8 w-8 mr-2" />
                    <span className="text-3xl font-bold text-gray-800">{leaveBalances.credits || 0}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Leave Request Form - Centered and wider */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Apply for Leave</h2>
              
              {loadingSteps ? (
                <div className="text-center py-6">
                  <MultiStepLoader
                    loadingStates={submitError ? errorState : leaveLoadingStates}
                    loading={loadingSteps}
                    duration={800}
                    loop={false}
                    currentStep={currentStep}
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="startDate"
                          value={leaveForm.startDate}
                          onChange={handleInputChange}
                          required
                          className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="endDate"
                          value={leaveForm.endDate}
                          onChange={handleInputChange}
                          required
                          className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Type
                    </label>
                    <select
                      name="leaveType"
                      value={leaveForm.leaveType}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      {leaveTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason
                    </label>
                    <textarea
                      name="reason"
                      value={leaveForm.reason}
                      onChange={handleInputChange}
                      rows="3"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Briefly describe your reason for leave"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                  >
                    Submit Leave Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveManagementDashboard;