import { motion } from 'framer-motion';

import {
  Home,
  BarChart,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  // State to track the active item
  const [activeItem, setActiveItem] = useState("/dashboard");
  
  // Check the current path when component mounts
  useEffect(() => {
    // This gets the current path from the window location
    const currentPath = window.location.pathname;
    setActiveItem(currentPath);
  }, []);

  const sidebarItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Analytics", icon: <BarChart size={20} />, path: "/analytics" },
    { name: "Customers", icon: <Users size={20} />, path: "/customers" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "Help Center", icon: <HelpCircle size={20} />, path: "/help" },
  ];

  // Handle click on menu item
  const handleMenuClick = (path: string) => {
    setActiveItem(path);
  };

  return (
    <motion.aside
      initial={{ width: sidebarOpen ? 280 : 0 }} // Increased from 250 to 280
      animate={{ width: sidebarOpen ? 280 : 0 }} // Increased from 250 to 280
      transition={{ duration: 0.3 }}
      className={`bg-white shadow-md fixed h-full z-40 lg:static overflow-hidden ${sidebarOpen ? 'block' : 'hidden lg:block'}`}
    >
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">MyApp</h2>
        <p className="text-gray-500 text-sm mt-1">Lending Dashboard</p>
      </div>

      <div className="py-4">
        <ul>
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.path}
                onClick={() => handleMenuClick(item.path)}
                className={`flex items-center gap-4 px-8 py-4 hover:bg-gray-50 ${
                  activeItem === item.path
                    ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {item.icon}
                <span className="text-base">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
};