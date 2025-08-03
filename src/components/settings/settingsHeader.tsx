'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
type SettingsHeaderProps = {
  searchText: string;
  setSearchText: (value: string) => void;
};
const SettingsHeader:React.FC<SettingsHeaderProps>=({ searchText, setSearchText }) => {
  const router = useRouter();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMobileSearchOpen) {
      setSearchText(''); // Clear search when closing
    }
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between  ">
          <h1 
            className="text-xl sm:text-2xl font-semibold cursor-pointer text-gray-800 hover:text-gray-600 transition-colors mr-auto " 
            onClick={() => router.push('/settings')}
          >
            Settings
          </h1>
          <div className="relative mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={searchText}
              placeholder="Search for any setting or feature"
              className="pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 sm:w-80 lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all duration-200"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden">
          {!isMobileSearchOpen ? (
            // Mobile Header - Default State
            <div className="flex items-center justify-between">
              <h1 
                className="text-lg font-semibold cursor-pointer text-gray-800 " 
                onClick={() => router.push('/settings')}
              >
                Settings
              </h1>
              <button
                onClick={handleSearchToggle}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            // Mobile Search - Active State
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchText}
                  placeholder="Search settings..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                />
              </div>
              <button
                onClick={handleSearchToggle}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Search Results Indicator */}
        {isMobileSearchOpen && searchText && (
          <div className="sm:hidden mt-2 text-xs text-gray-500">
            Searching for &quot;{searchText}&quot;
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsHeader;