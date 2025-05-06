import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg text-center space-y-8 border border-indigo-100">
        {/* Improved 404 Illustration */}
        <div className="mx-auto w-72 h-72 relative">
          <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Background elements */}
            <circle cx="120" cy="120" r="100" fill="#f0f2f9" />
            <circle cx="120" cy="120" r="90" fill="#f8faff" />
            
            {/* Decorative circles */}
            <circle cx="70" cy="60" r="10" fill="#e0e7ff" />
            <circle cx="180" cy="70" r="6" fill="#c7d2fe" />
            <circle cx="50" cy="160" r="8" fill="#dbeafe" />
            <circle cx="190" cy="150" r="12" fill="#e0e7ff" />
            
            {/* Large 404 text with better styling and shadow effect */}
            <g>
              {/* Shadow effect */}
              <text x="58" y="140" fontSize="65" fill="#d1d5db" fontWeight="bold" fontFamily="Arial, sans-serif">404</text>
              
              {/* Main text */}
              <text x="55" y="138" fontSize="65" fill="#4338ca" fontWeight="bold" fontFamily="Arial, sans-serif">404</text>
            </g>
            
            {/* Magnifying glass searching */}
            <circle cx="170" cy="80" r="25" fill="none" stroke="#6366f1" strokeWidth="4" />
            <line x1="188" y1="98" x2="208" y2="118" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
            <line x1="170" y1="65" x2="170" y2="95" stroke="#c7d2fe" strokeWidth="2" />
            <line x1="155" y1="80" x2="185" y2="80" stroke="#c7d2fe" strokeWidth="2" />
            
            {/* Broken link symbol */}
            <path d="M50,90 C40,85 40,70 50,65 L65,50 C75,45 90,45 95,55 L90,60 C85,55 75,55 70,60 L55,75 C50,80 50,90 55,95 C60,100 70,100 75,95 L80,90" 
                  fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
            <path d="M90,140 C100,145 100,160 90,165 L75,180 C65,185 50,185 45,175 L50,170 C55,175 65,175 70,170 L85,155 C90,150 90,140 85,135 C80,130 70,130 65,135 L60,140" 
                  fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
            
            {/* Dotted path line */}
            <path fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" d="M40,180 C80,160 160,160 200,180" />
          </svg>
        </div>
        
        {/* Error message with improved copy */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-indigo-900">Page Not Found</h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            We've searched high and low, but the page you requested seems to be missing or doesn't exist.
          </p>
        </div>
        
        {/* Action buttons with hover effects */}
        <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-md w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-indigo-300 text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors duration-200 shadow-sm w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go Back
          </button>
        </div>
      </div>
      
      {/* Footer text */}
      <p className="mt-8 text-sm text-indigo-400">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
};

export default NotFound;