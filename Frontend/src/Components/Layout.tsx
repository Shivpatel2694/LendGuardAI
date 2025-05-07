import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { Sidebar } from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  
  showSidebar?: boolean;
}

export const Layout = ({  showSidebar = true }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar 
        showAuthButtons={false}
        sidebarOpen={showSidebar ? sidebarOpen : undefined}
        setSidebarOpen={showSidebar ? setSidebarOpen : undefined}
      />

      <div className="flex flex-1 pt-16">
        {/* Mobile Sidebar Toggle - Only shown when sidebar is enabled */}
        {showSidebar && (
          <div className="block lg:hidden fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}

        {/* Sidebar - Only shown when enabled */}
        {showSidebar && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${showSidebar && sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'}`}>
          <div className="max-w-7xl mx-auto">
            <Outlet/>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};