'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
// import SettingsHeader from '@/components/settings/settingsHeader';
// import Breadcrumb from '@/components/settings/breadcrumb';
import Link from 'next/link';

import SettingsSidebar from '@/components/settings/settingsSidebar';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800"><Link href ="/settings">Settings</Link></h1>
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* {<Breadcrumb />} */}
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <SettingsSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="relative bg-white w-64 h-full shadow-xl">
              {/* Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Sidebar Content */}
              <div className="h-full">
                <SettingsSidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 w-full md:w-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;