import React from 'react';

const HolidayListItem = ({ holiday, isSelectable, isSelected, onSelect }) => {
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
  const getTypeStyles = (type) => {
    switch (type) {
      case 'PUBLIC_HOLIDAY':
        return {
          bg: `bg-blue-50`,
          text: "text-blue-700",
          label: "Public"
        };
      case 'COMPANY':
        return {
          bg: "bg-gray-100",
          text: `text-gray-700`,
          label: "Company"
        };
      case 'WEEKEND':
        return {
          bg: "bg-gray-100",
          text: `text-gray-700`,
          label: "Weekend"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: `text-gray-700`,
          label: type ? type.replace('_', ' ') : 'Unknown'
        };
    }
  };

  // Format date in a clean, readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const typeStyle = getTypeStyles(holiday.type);

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow"
      style={{ backgroundColor: colorPalette.white, borderRadius: "12px" }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 
              className="text-lg font-semibold mb-1"
              style={{ color: colorPalette.dark }}
            >
              {holiday.name}
            </h3>
            <p 
              className="text-sm mb-2"
              style={{ color: colorPalette.light }}
            >
              {formatDate(holiday.date)}
            </p>
            
            {holiday.description && (
              <p 
                className="text-sm mb-3 line-clamp-2"
                style={{ color: colorPalette.medium }}
              >
                {holiday.description}
              </p>
            )}
            
            <span 
              className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}
              style={{ 
                backgroundColor: typeStyle.label === "Public" ? "rgba(60, 126, 252, 0.1)" : "#F0F0F4",
                color: typeStyle.label === "Public" ? colorPalette.primary : colorPalette.medium
              }}
            >
              {typeStyle.label}
            </span>
          </div>
          
          {isSelectable && (
            <div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(holiday.id)}
                className="w-5 h-5 rounded focus:ring-2 focus:ring-offset-2"
                style={{ accentColor: colorPalette.primary }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidayListItem;