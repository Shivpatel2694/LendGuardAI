import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Layout from "../Components/Layout";
import EmployeeListItem from "../Components/EmployeeListItem";
import { useNavigate } from "react-router-dom";
import { MultiStepLoader } from "../Components/ui/multi-step-loader";

const ManagerList = () => {
  // State for managers
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [createError, setCreateError] = useState(null);
  const [newManager, setNewManager] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: {
      id: "",
    },
    role: "MANAGER",
  });
  const loadingStates = [
    { text: "Preparing data..." },
    { text: "Sending data..." },
    { text: "Creating account..." },
    { text: "Sending email notification..." },
    { text: "Account successfully created!" },
  ];
  const errorState = [
    { text: "There seems to be some error. Please try again." },
  ];

  const departments = [
    "Human Resources",
    "Engineering",
    "Finance",
    "Marketing",
    "Sales",
    "Customer Support",
    "IT & Infrastructure",
    "Research & Development",
    "Other Departments",
  ];
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const role = localStorage.getItem("role") || sessionStorage.getItem("role");

  const colorPalette = {
    primary: "#3C7EFC",
    dark: "#404258",
    medium: "#474E68",
    light: "#6B728E",
    background: "#F5F5F9",
    white: "#FFFFFF",
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (role === "ADMIN") {
          const response = await axios.get(
            "http://localhost:8080/api/admin/managers",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(response.data);
          setManagers(response.data);
        } else if (role === "MANAGER") {
          const response = await axios.get(
            "http://localhost:8080/api/manager/employees",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(response.data);
          setManagers(response.data);
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch  data. Please try again later.");
        console.error("Error fetching managers:", err);
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const searchEmployeesByEmail = async (email) => {
    setIsLoading(true);

    const baseUrl =
      role === "ADMIN"
        ? "http://localhost:8080/api/admin/managers"
        : "http://localhost:8080/api/manager/employees";

    try {
      if (!email) {
        // If search is cleared, fetch all managers or employees based on role
        const response = await axios.get(baseUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Transform data to include full name
        const managersWithFullName = response.data.map((manager) => ({
          ...manager,
          name: `${manager.firstName} ${manager.lastName}`,
        }));

        setManagers(managersWithFullName);
      } else {
        // Use the appropriate search-by-email endpoint based on role
        const searchUrl =
          role === "ADMIN"
            ? `${baseUrl}/search-by-email`
            : `${baseUrl}/search-by-email`;

        const response = await axios.get(searchUrl, {
          params: { email },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Transform data to include full name
        const managersWithFullName = response.data.map((manager) => ({
          ...manager,
          name: `${manager.firstName} ${manager.lastName}`,
        }));

        setManagers(managersWithFullName);
      }
    } catch (err) {
      console.error("Error searching managers:", err);
      setError("Failed to search managers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  const handleManagerClick = (manager) => {
    // Navigate to manager profile page
    navigate(`/profile/${manager.id}`);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchEmployeesByEmail(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    // Focus the input element when component mounts or page refreshes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleCreateEmployee = async () => {
    // setIsLoading(true);

    setCreateError(null);
    setLoadingSteps(true);
    setCurrentStep(0);

    if (
      !newManager.firstName ||
      !newManager.lastName ||
      !newManager.email ||
      (role === "ADMIN" && !newManager.department.id)
    ) {
      alert("Please fill in all required fields");
      setLoadingSteps(false);
      return;
    }

    try {
      setCurrentStep(1);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Get the department name for admin users
      let deptId, deptName;
      if (role === "ADMIN") {
        deptId = parseInt(newManager.department.id);
        deptName = departments[deptId - 1] || ""; // -1 because array is 0-indexed but IDs start at 1
      }

      // Prepare the request body according to the API requirements
      const employeeData = {
        firstName: newManager.firstName,
        lastName: newManager.lastName,
        email: newManager.email,
        password: newManager.password,
        // Include department only for admin users
        ...(role === "ADMIN" && {
          department: {
            id: deptId,
            name: deptName,
          },
        }),
        // Role is not part of the required body, so we're not including it
      };
      setCurrentStep(2);
      // Use different endpoints based on user role
      const endpoint =
        role === "ADMIN"
          ? "http://localhost:8080/api/admin/manager"
          : "http://localhost:8080/api/manager/employees";

      const response = await axios.post(endpoint, employeeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCurrentStep(3);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

      // Format the created employee based on the response
      const createdEmployee = {
        ...response.data,
        name: `${response.data.firstName} ${response.data.lastName}`,
        department: response.data.department || {},
      };

      const formattedEmployee = {
        ...createdEmployee,
        firstName: capitalizeFirstLetter(createdEmployee.firstName),
        lastName: capitalizeFirstLetter(createdEmployee.lastName),
      };

      setCurrentStep(4);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setManagers((prevManagers) => [...prevManagers, formattedEmployee]);

      // Reset form and close modal
      setNewManager({
        firstName: "",
        lastName: "",
        email: "",
        department: {
          id: "",
        },
        role: "MANAGER",
      });
      // setShowCreateModal(false);

      setTimeout(() => {
        setShowCreateModal(false);
        setLoadingSteps(false);
      }, 500);
    } catch (err) {
      console.error(
        `Error creating ${role === "ADMIN" ? "manager" : "employee"}:`,
        err
      );
      
      setCreateError("Error creating the account. Please try again.");
      setLoadingSteps(false);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleDeleteSelectedManagers = async () => {
    if (selectedManagers.length === 0) {
      alert("Please select at least one manager to delete");
      return;
    }

    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteManagers = async () => {
    try {
      for (const managerId of selectedManagers) {
        // Use different endpoints based on user role
        const endpoint =
          role === "ADMIN"
            ? `http://localhost:8080/api/admin/manager/${managerId}`
            : `http://localhost:8080/api/manager/employees/${managerId}`;

        await axios.delete(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setManagers((prevManagers) =>
        prevManagers.filter((manager) => !selectedManagers.includes(manager.id))
      );

      setSelectedManagers([]);
      setSelectionMode(false);
      setShowDeleteConfirmModal(false);
    } catch (err) {
      console.error(
        `Error deleting ${role === "ADMIN" ? "managers" : "employees"}:`,
        err
      );
      alert(
        `Failed to delete selected ${
          role === "ADMIN" ? "managers" : "employees"
        }. Please try again.`
      );
      setShowDeleteConfirmModal(false);
    }
  };
  const toggleManagerSelection = (managerId) => {
    if (selectedManagers.includes(managerId)) {
      setSelectedManagers(selectedManagers.filter((id) => id !== managerId));
    } else {
      setSelectedManagers([...selectedManagers, managerId]);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div
          className="min-h-screen bg-gray-100 flex items-center justify-center"
          style={{ backgroundColor: colorPalette.background }}
        >
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto"
              style={{ borderColor: colorPalette.primary }}
            ></div>
            <p className="mt-4" style={{ color: colorPalette.dark }}>
              Loading data...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

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
            <h2
              className="text-xl font-semibold mt-4"
              style={{ color: colorPalette.dark }}
            >
              Error
            </h2>
            <p className="mt-2" style={{ color: colorPalette.light }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: colorPalette.primary,
                boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const groupManagersByDepartment = () => {
    const grouped = {};

    managers.forEach((manager) => {
      const department = manager.department.name || "Unassigned";

      if (!grouped[department]) {
        grouped[department] = [];
      }

      grouped[department].push(manager);
    });

    return grouped;
  };

  const groupedManagers = groupManagersByDepartment();

  return (
    <Layout>
      <div
        className="min-h-screen py-6"
        style={{ backgroundColor: colorPalette.background }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-2xl font-semibold"
              style={{ color: colorPalette.dark }}
            >
              {role === "ADMIN" ? "Manager" : "Employee"} List
            </h1>
            <div className="flex space-x-3">
              {selectionMode ? (
                <>
                  <button
                    onClick={handleDeleteSelectedManagers}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: colorPalette.dark,
                      boxShadow: "0 2px 4px rgba(64, 66, 88, 0.3)",
                    }}
                    disabled={selectedManagers.length === 0}
                  >
                    Delete Selected ({selectedManagers.length})
                  </button>
                  <button
                    onClick={() => {
                      setSelectionMode(false);
                      setSelectedManagers([]);
                    }}
                    className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: colorPalette.white,
                      borderColor: colorPalette.light,
                      color: colorPalette.medium,
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
                      boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)",
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setSelectionMode(true)}
                    className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: colorPalette.white,
                      borderColor: colorPalette.light,
                      color: colorPalette.medium,
                    }}
                  >
                    Select
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: colorPalette.light }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                ref={inputRef}
                placeholder="Search by email, name, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg"
                style={{
                  backgroundColor: colorPalette.white,
                  borderColor: "#E8E8EF",
                  color: colorPalette.dark,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              />
              {searchQuery && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            style={{ borderRadius: "16px" }}
          >
            <div
              className="border-b border-gray-200 p-4"
              style={{ backgroundColor: "#F8F8FB", borderColor: "#E8E8EF" }}
            >
              <h2
                className="text-lg font-medium"
                style={{ color: colorPalette.dark }}
              >
                Company {role === "ADMIN" ? "Manager" : "Employee"}
              </h2>
            </div>

            {managers?.length === 0 ? (
              <div
                className="p-6 text-center"
                style={{ color: colorPalette.light }}
              >
                {searchQuery
                  ? `No ${
                      role === "ADMIN" ? "managers" : "employees"
                    } found matching your search.`
                  : `No ${role === "ADMIN" ? "managers" : "employees"} found.`}
              </div>
            ) : (
              <div className="p-4">
                {Object.keys(groupedManagers).length > 0 ? (
                  Object.entries(groupedManagers).map(
                    ([department, departmentManagers]) => (
                      <div key={department} className="mb-6">
                        <h3
                          className="text-md font-medium mb-3 ml-1"
                          style={{ color: colorPalette.medium }}
                        >
                          {department} Department
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {departmentManagers.map((manager) => (
                            <EmployeeListItem
                              key={manager.id}
                              employee={manager}
                              isSelectable={selectionMode}
                              isSelected={selectedManagers.includes(manager.id)}
                              onSelect={() =>
                                toggleManagerSelection(manager.id)
                              }
                              onClick={handleManagerClick}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div
                    className="p-6 text-center"
                    style={{ color: colorPalette.light }}
                  >
                    No {role === "ADMIN" ? "Manager" : "Employee"} found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Manager Modal */}
      {showCreateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            {loadingSteps ? (
              <div className="inline-block align-middle bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="text-center">
                  <MultiStepLoader
                    loadingStates={createError ? errorState : loadingStates}
                    loading={loadingSteps}
                    duration={800}
                    loop={false}
                    currentStep={currentStep}
                  />
                </div>
              </div>
            ) : (
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3
                    className="text-lg leading-6 font-medium"
                    style={{ color: colorPalette.dark }}
                  >
                    Add New {role === "ADMIN" ? "Manager" : "Employee"}
                  </h3>

                  {/* Add error message display */}
                  {createError && (
                    <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                      Error: {createError}
                    </div>
                  )}

                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium"
                          style={{ color: colorPalette.dark }}
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={newManager.firstName}
                          onChange={(e) =>
                            setNewManager({
                              ...newManager,
                              firstName: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          style={{ borderColor: "#E8E8EF" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium"
                          style={{ color: colorPalette.dark }}
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={newManager.lastName}
                          onChange={(e) =>
                            setNewManager({
                              ...newManager,
                              lastName: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          style={{ borderColor: "#E8E8EF" }}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium"
                        style={{ color: colorPalette.dark }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={newManager.email}
                        onChange={(e) =>
                          setNewManager({
                            ...newManager,
                            email: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        style={{ borderColor: "#E8E8EF" }}
                        required
                      />
                    </div>
                    {role === "ADMIN" && (
                      <div>
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium"
                          style={{ color: colorPalette.dark }}
                        >
                          Department *
                        </label>
                        <select
                          id="department"
                          name="department"
                          value={newManager.department.id || ""}
                          onChange={(e) => {
                            const deptId = e.target.value;
                            const deptName =
                              departments[parseInt(deptId) - 1] || "";
                            setNewManager({
                              ...newManager,
                              department: {
                                id: deptId,
                                name: deptName,
                              },
                            });
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          style={{ borderColor: "#E8E8EF" }}
                          required
                        >
                          <option value="">Select a department</option>
                          {departments.map((dept, index) => (
                            <option key={index} value={index + 1}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium"
                        style={{ color: colorPalette.dark }}
                      >
                        Role
                      </label>
                      <select
                        value={newManager.role}
                        onChange={(e) =>
                          setNewManager({ ...newManager, role: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        style={{ borderColor: "#E8E8EF" }}
                      >
                        <option value="MANAGER">
                          {role === "ADMIN" ? "Manager" : "Employee"}{" "}
                        </option>
                      </select>
                    </div>
                    {/* <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                      style={{ color: colorPalette.dark }}
                    >
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={newManager.password}
                      onChange={(e) =>
                        setNewManager({
                          ...newManager,
                          password: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      style={{ borderColor: "#E8E8EF" }}
                      required
                    />
                  </div> */}
                  </div>
                </div>
                <div
                  className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                  style={{ backgroundColor: "#F8F8FB" }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      // Validate form before submission
                      if (
                        !newManager.firstName ||
                        !newManager.lastName ||
                        !newManager.email ||
                        (role === "ADMIN" && !newManager.department.id)
                      ) {
                        alert("Please fill in all required fields");
                        return;
                      }
                      handleCreateEmployee();
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    style={{
                      backgroundColor: colorPalette.primary,
                      boxShadow: "0 2px 4px rgba(60, 126, 252, 0.3)",
                    }}
                  >
                    Add {role === "ADMIN" ? "Manager" : "Employee"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    style={{
                      backgroundColor: colorPalette.white,
                      borderColor: colorPalette.light,
                      color: colorPalette.medium,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              style={{ borderRadius: "16px" }}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                    style={{ backgroundColor: `${colorPalette.primary}20` }}
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium"
                      style={{ color: colorPalette.dark }}
                    >
                      Delete Selected{" "}
                      {role === "ADMIN" ? "Manager" : "Employee"}
                    </h3>
                    <div className="mt-2">
                      <p style={{ color: colorPalette.medium }}>
                        Are you sure you want to delete{" "}
                        {selectedManagers.length} selected manager
                        {selectedManagers.length > 1 ? "s" : ""}? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                style={{ backgroundColor: "#F8F8FB" }}
              >
                <button
                  type="button"
                  onClick={confirmDeleteManagers}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  style={{
                    backgroundColor: colorPalette.dark,
                    boxShadow: "0 2px 4px rgba(64, 66, 88, 0.3)",
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
                    color: colorPalette.medium,
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

export default ManagerList;
