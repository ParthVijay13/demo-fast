'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const Breadcrumb = () => {
  const pathname = usePathname();
  
  // Map of paths to their display names
  const pathNameMap: { [key: string]: string } = {
    'settings': 'Settings',
    'company-setup': 'Company Setup',
    'company-details': 'Company Details',
    'domestic-kyc': 'Domestic KYC',
    'pickup-addresses': 'Pickup Addresses',
    'billing-invoice-gst': 'Billing, Invoice, & GSTIN',
    'labels': 'Labels',
    'password-security': 'Password & Login Security',
    'bank-details': 'Bank Details',
    'early-cod': 'Early COD Remittance',
    'postpaid-plan': 'Postpaid Plan'
  };

  // Generate breadcrumb items from the current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    console.log(pathSegments);
    
    const breadcrumbs: BreadcrumbItem[] = [];
    
    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      
      const label = pathNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      breadcrumbs.push({
        label,
        href: index < pathSegments.length - 1 ? href : undefined // Last item doesn't have href
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumb on the main settings page
  }

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-8 py-3">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              {item.href ? (
                <Link 
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;