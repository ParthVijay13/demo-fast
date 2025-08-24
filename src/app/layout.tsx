import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Providers from './providers';
// import ProtectedRoute from '@/components/ProtectedRoute';
const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        
        {/* <AuthProvider> */}
        
        <ThemeProvider>
          <Providers>
            <SidebarProvider>{children}</SidebarProvider>
          </Providers>
        </ThemeProvider>
        
        {/* </AuthProvider> */}
        
      </body>
    </html>
  );
}
