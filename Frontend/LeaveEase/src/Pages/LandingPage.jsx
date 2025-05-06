import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';

const LandingPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 pb-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--color-navy)' }}>
                LeaveEase
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--color-slate)' }}>
                A unique approach to leave management
              </h2>
              <p className="text-lg mb-8" style={{ color: 'var(--color-blue-slate)' }}>
                Streamline your organization's leave processes with our intuitive online platform. 
                Manage requests, track balances, and approve leaves - all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-md" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  Get started
                </Link>
                <a href="#features" className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md bg-white shadow-sm hover:bg-gray-50" style={{ color: 'var(--color-slate)' }}>
                  Learn more
                </a>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
                <div className="text-center mb-6">
                  <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold" style={{ color: 'var(--color-navy)' }}>LeaveEase Dashboard</h2>
                  <p className="mt-2" style={{ color: 'var(--color-blue-slate)' }}>Manage all your leave requests from one simple interface</p>
                </div>
                <div className="space-y-4 text-left">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-bright-blue)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base" style={{ color: 'var(--color-slate)' }}>Request leaves with just a few clicks</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-bright-blue)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base" style={{ color: 'var(--color-slate)' }}>Track your remaining leave balance</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-bright-blue)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base" style={{ color: 'var(--color-slate)' }}>Managers can approve requests on the go</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-bright-blue)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base" style={{ color: 'var(--color-slate)' }}>Receive notifications about leave status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-navy)' }}>
              Features that make leave management easy
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl" style={{ color: 'var(--color-blue-slate)' }}>
              Everything you need to streamline your organization's leave processes.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium" style={{ color: 'var(--color-navy)' }}>Easy Leave Requests</h3>
                <p className="mt-2" style={{ color: 'var(--color-blue-slate)' }}>
                  Submit leave requests with a few clicks. Choose dates, type, and add comments.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium" style={{ color: 'var(--color-navy)' }}>Quick Approvals</h3>
                <p className="mt-2" style={{ color: 'var(--color-blue-slate)' }}>
                  Managers can approve or decline requests from anywhere, anytime.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium" style={{ color: 'var(--color-navy)' }}>Balance Tracking</h3>
                <p className="mt-2" style={{ color: 'var(--color-blue-slate)' }}>
                  Real-time tracking of available leave balances for different leave types.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium" style={{ color: 'var(--color-navy)' }}>Team Calendar</h3>
                <p className="mt-2" style={{ color: 'var(--color-blue-slate)' }}>
                  Visual team calendar to see who's out when and plan accordingly.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium" style={{ color: 'var(--color-navy)' }}>Notifications</h3>
                <p className="mt-2" style={{ color: 'var(--color-blue-slate)' }}>
                  Automatic notifications for request status, approvals, and reminders.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="h-12 w-12 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium" style={{ color: 'var(--color-navy)' }}>Reports & Analytics</h3>
                <p className="mt-2" style={{ color: 'var(--color-blue-slate)' }}>
                  Generate reports on leave patterns, balances, and usage trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f0f2f9' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-navy)' }}>
            Ready to simplify leave management?
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-blue-slate)' }}>
            Join thousands of organizations that trust LeaveEase to handle their leave management needs.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-md" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
              Get Started
            </Link>
          </div>
          
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;