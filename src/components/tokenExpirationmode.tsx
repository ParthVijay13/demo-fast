// "use client"
import React from 'react';
// import { useRouter } from 'next/navigation'

const TokenExpiredModal: React.FC = () => {
  // const router = useRouter()
  const handleLoginAgain = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm z-50" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto">
          {/* Modal content */}
          <div className="p-8 sm:p-12 text-center">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg 
                className="h-6 w-6 text-red-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Session Expired
            </h3>
            
            {/* Message */}
            <p className="text-sm text-gray-500 mb-6">
              Your token has been expired. Please login again to continue.
            </p>
            
            {/* Login Again Button */}
            <button
              onClick={handleLoginAgain}
              className="w-full inline-flex justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenExpiredModal;
