import React from 'react';

const EmployeeListItem = ({ employee, isSelectable, isSelected, onSelect, onClick }) => {
  // Color palette from HolidayList page
  const colorPalette = {
    primary: "#3C7EFC",
    dark: "#404258",
    medium: "#474E68",
    light: "#6B728E",
    background: "#F5F5F9",
    white: "#FFFFFF"
  };

  // Enhanced type styling using the color palette
  const getRoleStyles = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          bg: `bg-purple-50`,
          text: "text-purple-700",
          label: "Admin"
        };
      case 'MANAGER':
        return {
          bg: "bg-blue-50",
          text: `text-blue-700`,
          label: "Manager"
        };
      case 'EMPLOYEE':
        return {
          bg: "bg-gray-100",
          text: `text-gray-700`,
          label: "Employee"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: `text-gray-700`,
          label: role ? role.replace('_', ' ') : 'Unknown'
        };
    }
  };

  // Format date in a clean, readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get initials for the logo
  const getInitials = () => {
    const firstInitial = employee.firstName ? employee.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = employee.lastName ? employee.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  // Get background color for the logo based on role
  const getLogoBackgroundColor = () => {
    switch (employee.role) {
      case 'ADMIN':
        return '#805AD5';
      case 'MANAGER':
        return colorPalette.primary;
      default:
        return colorPalette.medium;
    }
  };

  const roleStyle = getRoleStyles(employee.role);

  const handleItemClick = (e) => {
    // If we're in selection mode, don't navigate
    if (isSelectable) return;
    
    // If the click is on the checkbox, don't navigate
    if (e.target.type === 'checkbox') return;
    
    // Otherwise, call the onClick handler
    if (onClick) onClick(employee);
  };

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow cursor-pointer"
      style={{ backgroundColor: colorPalette.white, borderRadius: "12px" }}
      onClick={handleItemClick}
    >
      <div className="p-4">
        {/* Top section with employee info and logo */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 
              className="text-lg font-semibold mb-1"
              style={{ color: colorPalette.dark }}
            >
              {employee.firstName+" "+employee.lastName}
            </h3>
            <p 
              className="text-sm mb-2"
              style={{ color: colorPalette.light }}
            >
              {employee.email}
            </p>
            
            <p 
              className="text-sm mb-2"
              style={{ color: colorPalette.medium }}
            >
              Department: {employee.department.name}
            </p>
            
            {employee.joinDate && (
              <p 
                className="text-sm mb-3"
                style={{ color: colorPalette.medium }}
              >
                Joined: {formatDate(employee.joinDate)}
              </p>
            )}
            
            <span 
              className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}
              style={{ 
                backgroundColor: roleStyle.label === "Manager" ? "rgba(60, 126, 252, 0.1)" : roleStyle.label === "Admin" ? "rgba(128, 90, 213, 0.1)" : "#F0F0F4",
                color: roleStyle.label === "Manager" ? colorPalette.primary : roleStyle.label === "Admin" ? "#805AD5" : colorPalette.medium
              }}
            >
              {roleStyle.label}
            </span>
          </div>
          
          {/* Employee Initials Logo */}
          <div 
            className="flex items-center justify-center w-12 h-12 rounded-full text-white font-medium"
            style={{ backgroundColor: getLogoBackgroundColor() }}
          >
            {getInitials()}
          </div>
        </div>
        
        {/* Bottom section with checkbox */}
        {isSelectable && (
          <div className="flex justify-end mt-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(employee.id)}
                className="w-5 h-5 rounded focus:ring-2 focus:ring-offset-2"
                style={{ accentColor: colorPalette.primary }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeListItem;