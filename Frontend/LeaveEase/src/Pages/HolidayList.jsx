import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';
import HolidayListItem from '../Components/HolidayListItem'; // Import the external component

const HolidayList = () => {
  
  const [holidays, setHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [isAdmin,setIsAdmin] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    type: 'PUBLIC_HOLIDAY'
  });
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
  const role = localStorage.getItem('role') || sessionStorage.getItem('role')
  
  const colorPalette = {
    primary: "#3C7EFC",
    dark: "#404258",
    medium: "#474E68",
    light: "#6B728E",
    background: "#F5F5F9",
    white: "#FFFFFF"
  };


  useEffect(() => {
    // Function to fetch holidays
    const fetchHolidays = async () => {
      setIsLoading(true);
      setError(null);
      let response;
      try {
        if(role === 'ADMIN'){
         response = await axios.get('http://localhost:8080/api/admin/holidays', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsAdmin(true);
      }
      else if(role === 'MANAGER'){
        response = await axios.get('http://localhost:8080/api/manager/holidays', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      else{
        response = await axios.get('http://localhost:8080/api/employee/holidays', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
        setHolidays(response.data);

      } catch (err) {
        setError('Failed to fetch holidays data. Please try again later.');
        console.error('Error fetching holidays:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  // Function to handle holiday creation
  const handleCreateHoliday = async () => {
    if (!newHoliday.name || !newHoliday.date) {
      alert('Please fill in required fields');
      return;
    }

    try {
      // COMMENTED AXIOS CALL - Uncomment when backend is ready
      
      const response = await axios.post('http://localhost:8080/api/admin/holidays', newHoliday, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
      // Add the newly created holiday to the list
      setHolidays(prevHolidays => [...prevHolidays, response.data]);
      
      // Reset form and close modal
      setNewHoliday({
        name: '',
        date: '',
        type: 'PUBLIC_HOLIDAY'
      });
      setShowCreateModal(false);

    } catch (err) {
      console.error('Error creating holiday:', err);
      alert('Failed to create holiday. Please try again.');
    }
  };

  // Function to handle holiday deletion
  const handleDeleteSelectedHolidays = async () => {
    if (selectedHolidays.length === 0) {
      alert('Please select at least one holiday to delete');
      return;
    }

    setShowDeleteConfirmModal(true);
  };

  // Actual delete function to be called after confirmation
  const confirmDeleteHolidays = async () => {
    try {
      // COMMENTED AXIOS CALLS - Uncomment when backend is ready
      
      for (const holidayId of selectedHolidays) {
        await axios.delete(`http://localhost:8080/api/admin/holidays/${holidayId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      

      // Update local state for visualization
      setHolidays(prevHolidays => 
        prevHolidays.filter(holiday => !selectedHolidays.includes(holiday.id))
      );

      // Clear selection
      setSelectedHolidays([]);
      setSelectionMode(false);
      setShowDeleteConfirmModal(false);

    } catch (err) {
      console.error('Error deleting holidays:', err);
      alert('Failed to delete selected holidays. Please try again.');
      setShowDeleteConfirmModal(false);
    }
  };

  // Function to toggle selection of a holiday
  const toggleHolidaySelection = (holidayId) => {
    if (selectedHolidays.includes(holidayId)) {
      setSelectedHolidays(selectedHolidays.filter(id => id !== holidayId));
    } else {
      setSelectedHolidays([...selectedHolidays, holidayId]);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center" style={{ backgroundColor: colorPalette.background }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto" style={{ borderColor: colorPalette.primary }}></div>
            <p className="mt-4" style={{ color: colorPalette.dark }}>Loading holidays data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colorPalette.background }}>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colorPalette.dark }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold mt-4" style={{ color: colorPalette.dark }}>Error</h2>
            <p className="mt-2" style={{ color: colorPalette.light }}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: colorPalette.primary, boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)" }}
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Group holidays by month for better organization
  const groupHolidaysByMonth = () => {
    const grouped = {};
    
    holidays.forEach(holiday => {
      const date = new Date(holiday.date);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push(holiday);
    });
    
    return grouped;
  };

  const groupedHolidays = groupHolidaysByMonth();

  return (
    <Layout>
      <div className="min-h-screen py-6" style={{ backgroundColor: colorPalette.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold" style={{ color: colorPalette.dark }}>Holiday List</h1>
            
            {isAdmin? <div className="flex space-x-3">
              {selectionMode ? (
                <>
                  <button
                    onClick={handleDeleteSelectedHolidays}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      backgroundColor: colorPalette.dark, 
                      boxShadow: "0 2px 4px rgba(64, 66, 88, 0.3)"
                    }}
                    disabled={selectedHolidays.length === 0}
                  >
                    Delete Selected ({selectedHolidays.length})
                  </button>
                  <button
                    onClick={() => {
                      setSelectionMode(false);
                      setSelectedHolidays([]);
                    }}
                    className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      backgroundColor: colorPalette.white, 
                      borderColor: colorPalette.light,
                      color: colorPalette.medium
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      backgroundColor: colorPalette.primary, 
                      boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)"
                    }}
                  >
                    Create Holiday
                  </button>
                  <button
                    onClick={() => setSelectionMode(true)}
                    className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      backgroundColor: colorPalette.white, 
                      borderColor: colorPalette.light,
                      color: colorPalette.medium
                    }}
                  >
                    Select Holidays
                  </button>
                </>
              )}
            </div>:<></>}
          </div>
          
          {/* Holiday Grid */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ borderRadius: "16px" }}>
            <div className="border-b border-gray-200 p-4" style={{ backgroundColor: "#F8F8FB", borderColor: "#E8E8EF" }}>
              <h2 className="text-lg font-medium" style={{ color: colorPalette.dark }}>Company Holidays</h2>
            </div>
            
            {holidays?.length === 0 ? (
              <div className="p-6 text-center" style={{ color: colorPalette.light }}>
                No holidays found.
              </div>
            ) : (
              <div className="p-4">
                {Object.keys(groupedHolidays).length > 0 ? (
                  Object.entries(groupedHolidays).map(([monthYear, monthHolidays]) => (
                    <div key={monthYear} className="mb-6">
                      <h3 className="text-md font-medium mb-3 ml-1" style={{ color: colorPalette.medium }}>{monthYear}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {monthHolidays.map(holiday => (
                          <div key={holiday.id} className="transform transition duration-200 hover:scale-102 hover:shadow-lg">
                            <HolidayListItem 
                              holiday={holiday}
                              isSelectable={selectionMode}
                              isSelected={selectedHolidays.includes(holiday.id)}
                              onSelect={toggleHolidaySelection}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center" style={{ color: colorPalette.light }}>
                    No holidays found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Holiday Modal */}
      {showCreateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium" style={{ color: colorPalette.dark }}>
                  Create New Holiday
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="holidayName" className="block text-sm font-medium" style={{ color: colorPalette.dark }}>
                      Holiday Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newHoliday.name}
                      onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      style={{ borderColor: "#E8E8EF" }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="holidayDate" className="block text-sm font-medium" style={{ color: colorPalette.dark }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      name="holidayDate"
                      id="holidayDate"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      style={{ borderColor: "#E8E8EF" }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="holidayType" className="block text-sm font-medium" style={{ color: colorPalette.dark }}>
                      Type
                    </label>
                    <select
                      id="holidayType"
                      name="holidayType"
                      value={newHoliday.type}
                      onChange={(e) => setNewHoliday({...newHoliday, type: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      style={{ borderColor: "#E8E8EF" }}
                    >
                      <option value="PUBLIC_HOLIDAY">PUBLIC_HOLIDAY</option>
                      <option value="WEEKEND">WEEKEND</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style={{ backgroundColor: "#F8F8FB" }}>
                <button
                  type="button"
                  onClick={handleCreateHoliday}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  style={{ 
                    backgroundColor: colorPalette.primary, 
                    boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)"
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  style={{ 
                    backgroundColor: colorPalette.white, 
                    borderColor: colorPalette.light,
                    color: colorPalette.medium
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" style={{ borderRadius: "16px" }}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10" style={{ backgroundColor: `${colorPalette.primary}20` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colorPalette.primary }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium" style={{ color: colorPalette.dark }}>
                      Delete Selected Holidays
                    </h3>
                    <div className="mt-2">
                      <p style={{ color: colorPalette.medium }}>
                        Are you sure you want to delete {selectedHolidays.length} selected holiday{selectedHolidays.length > 1 ? 's' : ''}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style={{ backgroundColor: "#F8F8FB" }}>
                <button
                  type="button"
                  onClick={confirmDeleteHolidays}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  style={{ 
                    backgroundColor: colorPalette.dark,
                    boxShadow: "0 2px 4px rgba(64, 66, 88, 0.3)"
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  style={{ 
                    backgroundColor: colorPalette.white,
                    borderColor: colorPalette.light,
                    color: colorPalette.medium
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HolidayList;