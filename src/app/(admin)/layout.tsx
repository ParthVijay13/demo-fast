// "use client";

// import { useSidebar } from "@/context/SidebarContext";
// import AppHeader from "@/layout/AppHeader";
// import AppSidebar from "@/layout/AppSidebar";
// import Backdrop from "@/layout/Backdrop";
// import React from "react";
// import { AuthProvider } from '../../context/AuthContext';
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { Providers } from "../providers";
// import ToastContainer from "@/components/toastContainer";
// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { isExpanded, isHovered, isMobileOpen } = useSidebar();

//   // Dynamic class for main content margin based on sidebar state
//   const mainContentMargin = isMobileOpen
//     ? "ml-0"
//     : isExpanded || isHovered
//     ? "lg:ml-[290px]"
//     : "lg:ml-[90px]";

//   return (
//     <div className="min-h-screen  xl:flex">
//       {/* Sidebar and Backdrop */}
//       <AuthProvider>
//       <ProtectedRoute>
//       <Providers>
//           {children}
//           <ToastContainer />
//         </Providers>
//       <AppSidebar />
//       <Backdrop />
//       {/* Main Content Area */}
//       <div
//         className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
//       >
//         {/* Header */}
//         <AppHeader />
//         {/* Page Content */}
//         <div className="p-4  md:p-6">{children}</div>
//       </div>
//       </ProtectedRoute>
//       </AuthProvider>
//     </div>
//   );
// }


// src/app/(admin)/layout.tsx   (client component)
'use client';

import React from 'react';
import { useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/layout/AppHeader';
import AppSidebar from '@/layout/AppSidebar';
import Backdrop from '@/layout/Backdrop';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
// import ToastContainer from "@/components/toastContainer";
import { Toaster } from 'react-hot-toast';
// import ToastContainer from '@/components/ToastContainer';
// import { Providers } from '../providers';
// import { DynamicRouteGuard } from '../../../routeGuard/dynamicRouteGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
    ? 'lg:ml-[290px]'
    : 'lg:ml-[90px]';

  return (
                 
      // <AuthProvider>
        <ProtectedRoute>
          {/* <DynamicRouteGuard> */}
          <div className="min-h-screen xl:flex">
            {/* Sidebar & backdrop */}
            
            <AppSidebar />
            <Backdrop />

            {/* Main content */}
            <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
              <AppHeader />
              <div className="p-4 md:p-6">{children}</div>
            </div>

            {/* Global toasts */}
            {/* <ToastContainer /> */}
            <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontSize: '14px' },
            success: { iconTheme: { primary: 'green', secondary: 'white' } },
            error:   { iconTheme: { primary: 'red',   secondary: 'white' } },
          }}
        />

          </div>
          {/* </DynamicRouteGuard> */}
        </ProtectedRoute>
      // </AuthProvider>
    
  );
}
