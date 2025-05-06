import React from 'react';
import { FiCalendar, FiClock, FiPieChart, FiUsers, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Layout from '../Components/Layout';

const FeaturesPage = () => {
  // Features with updated color variables based on Cobalt Essence
  const features = [
    {
      icon: <FiCalendar className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />,
      title: "Leave Calendar",
      description: "Interactive calendar view with color-coded leave types. Easily see team availability at a glance."
    },
    {
      icon: <FiClock className="w-10 h-10" style={{ color: 'var(--color-dark)' }} />,
      title: "Time Tracking",
      description: "Accurate tracking of employee work hours, overtime, and leave balance calculation."
    },
    {
      icon: <FiPieChart className="w-10 h-10" style={{ color: 'var(--color-slate)' }} />,
      title: "Analytics Dashboard",
      description: "Comprehensive reports and insights on leave patterns, helping managers make informed decisions."
    },
    {
      icon: <FiUsers className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />,
      title: "Team Management",
      description: "Organize employees into departments and teams with custom approval workflows."
    },
    {
      icon: <FiAlertCircle className="w-10 h-10" style={{ color: 'var(--color-medium)' }} />,
      title: "Notifications",
      description: "Real-time alerts for leave requests, approvals, and upcoming team absences."
    },
    {
      icon: <FiCheckCircle className="w-10 h-10" style={{ color: 'var(--color-dark)' }} />,
      title: "Approval Workflow",
      description: "Customizable multi-level approval process with delegation capabilities."
    }
  ];

  return (
    <Layout>
    <div className="min-h-screen bg-[#f0f2f9]" style={{ 
      // CSS Variables based on Cobalt Essence color scheme
      '--color-dark': '#404258',
      '--color-medium': '#474E68',
      '--color-slate': '#6B728E',
      '--color-primary': '#3C7EFC',
      '--color-white': '#FFFFFF',
      '--color-light-bg': '#f0f2f9',
    }}>
      {/* Header with solid background instead of waves */}
      <div className="relative py-16" style={{ 
        background: 'var(--color-primary)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl" style={{ color: 'var(--color-white)' }}>
              Powerful Features
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl" style={{ color: 'var(--color-white)', opacity: 0.9 }}>
              Streamline your leave management process with our comprehensive solution
            </p>
          </div>
        </div>
        {/* Clean angled divider instead of waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16">
            <polygon points="0,80 1440,0 1440,80" fill="var(--color-light-bg)" />
          </svg>
        </div>
      </div>

      {/* Features Grid with updated colors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-dark)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--color-medium)' }}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section with updated background */}
      <div className="py-16" style={{ backgroundColor: 'var(--color-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--color-white)' }}>Why Choose Our System?</h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--color-white)', opacity: 0.9 }}>
              Experience a modern approach to leave management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-primary)' }}>User-Friendly</h3>
              <p style={{ color: 'var(--color-white)' }}>Intuitive interface designed for all levels of technical proficiency</p>
            </div>
            <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-primary)' }}>Time-Saving</h3>
              <p style={{ color: 'var(--color-white)' }}>Automate repetitive tasks and streamline approval processes</p>
            </div>
            <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-primary)' }}>Data-Driven</h3>
              <p style={{ color: 'var(--color-white)' }}>Make informed decisions with comprehensive analytics and reporting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default FeaturesPage;