import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-16 pb-12 mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-white)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: 'var(--color-navy)' }}>
            About LeaveEase
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--color-blue-slate)' }}>
            Transforming how organizations manage employee leave with modern solutions.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-slate)' }}>Our Story</h2>
            <div className="space-y-6" style={{ color: 'var(--color-blue-slate)' }}>
              <p>
                LeaveEase was founded in 2025 with a simple mission: to eliminate the hassle and confusion of traditional leave management processes. After experiencing firsthand the challenges of tracking leave in growing organizations, our founders set out to create a solution that would make leave management effortless for both employees and HR teams.
              </p>
              <p>
                What began as a simple leave tracking tool has evolved into a comprehensive platform that handles everything from request submissions to analytics, helping organizations of all sizes streamline their leave management processes.
              </p>
              <p>
                Today, LeaveEase serves thousands of organizations worldwide, from small startups to large enterprises, all benefiting from our intuitive interface and powerful features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-12 mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f0f2f9' }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-slate)' }}>Our Mission</h2>
            <div className="space-y-6" style={{ color: 'var(--color-blue-slate)' }}>
              <p>
                At LeaveEase, we believe that managing time off shouldn't be time-consuming. Our mission is to create software that makes leave management simple, transparent, and efficient for everyone involved.
              </p>
              <p>
                We're committed to continuously improving our platform based on user feedback and industry best practices, ensuring that LeaveEase remains the most user-friendly and comprehensive leave management solution on the market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: 'var(--color-navy)' }}>Why Choose LeaveEase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--color-navy)' }}>Time-Saving</h3>
              </div>
              <p style={{ color: 'var(--color-blue-slate)' }}>
                Reduce the time spent on administrative tasks by up to 70% with our automated leave management workflows.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--color-navy)' }}>Compliance</h3>
              </div>
              <p style={{ color: 'var(--color-blue-slate)' }}>
                Ensure compliance with labor laws and company policies with our configurable rule engine and audit trails.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--color-navy)' }}>User-Friendly</h3>
              </div>
              <p style={{ color: 'var(--color-blue-slate)' }}>
                Enjoy an intuitive interface that requires minimal training, resulting in high adoption rates across organizations.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--color-navy)' }}>Insightful Analytics</h3>
              </div>
              <p style={{ color: 'var(--color-blue-slate)' }}>
                Gain valuable insights into leave patterns and trends with our comprehensive reporting tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f0f2f9' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: 'var(--color-navy)' }}>Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-slate)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>Kunal Bhat</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-bright-blue)' }}>Co-Founder</p>
              <p className="text-sm" style={{ color: 'var(--color-blue-slate)' }}>
                With over 15 years in HR technology, Kunal leads our vision to transform leave management.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-slate)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>Patel Shivansh </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-bright-blue)' }}>Co-Founder</p>
              <p className="text-sm" style={{ color: 'var(--color-blue-slate)' }}>
                Shivansh brings technical expertise from his years at leading tech companies to build our robust platform.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-slate)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>Raza Soneji</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-bright-blue)' }}>Co-Founder</p>
              <p className="text-sm" style={{ color: 'var(--color-blue-slate)' }}>
                Raza ensures our customers achieve maximum value from the LeaveEase platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-navy)' }}>
            Have questions about LeaveEase?
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-blue-slate)' }}>
            Our team is ready to answer your questions and help you get started.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-md" style={{ backgroundColor: 'var(--color-bright-blue)' }}>
              Contact Us
            </Link>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md shadow-sm" style={{ borderColor: 'var(--color-blue-slate)', color: 'var(--color-slate)' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;