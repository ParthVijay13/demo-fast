'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  MapPin,
  Receipt,
  Tag,
  Lock,
  Banknote,
  ChevronLeft
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
}

const sidebarSections: { label: string; path: string; items: NavItem[] }[] = [
  {
    label: 'Company Setup',
    path: '/settings/company-setup',
    items: [
      {
        title: 'Company Details',
        href: '/settings/company-setup/company-details',
        icon: Building2
      },
      // {
      //   title: 'Domestic KYC',
      //   href: '/settings/company-setup/domestic-kyc',
      //   icon: FileText
      // },
      {
        title: 'Pickup Addresses',
        href: '/settings/company-setup/pickup-address',
        icon: MapPin
      },
      {
        title: 'Billing, Invoice, & GSTIN',
        href: '/settings/company-setup/billing-invoice-gst',
        icon: Receipt
      },
      {
        title: 'Labels',
        href: '/settings/company-setup/labels',
        icon: Tag
      },
      {
        title: 'Password & Login Security',
        href: '/settings/company-setup/password-security',
        icon: Lock
      }
    ]
  },
  {
    label: 'Seller Remittance',
    path: '/settings/seller-remittance',
    items: [
      {
        title: 'Bank Details',
        href: '/settings/seller-remittance/bank-details',
        icon: Banknote
      }
    ]
  },
  {
    label: 'Courier Management',
    path: '/settings/courier-management',
    items: [
      {
        title: 'Courier Priority',
        href: '/settings/courier-management/courier-priority',
        icon: Banknote
      },
      {
        title: 'Courier Rules',
        href: '/settings/courier-management/courier-rules',
        icon: Banknote
      }
    ]
  },
  {
    label: 'Return and Exchange',
    path: '/settings/return-exchange',
    items: [
      {
        title: 'Return Rules',
        href: '/settings/return-exchange/return-settings',
        icon: Banknote
      }
    ]
  },
  {
    label: 'Additional Settings',
    path: '/settings/additional-settings',
    items: [
      {
        title: 'Manage Users',
        href: '/settings/additional-settings/manage-users',
        icon: Banknote
      }
    ]
  },

];

const SettingsSidebar = () => {
  const pathname = usePathname();

  const activeSection = sidebarSections.find((section) =>
    pathname.startsWith(section.path)
  );

  if (!activeSection) return null;

  return (
    <div className="w-64 bg-white border-r border h-[40vh] overflow-y-auto rounded-2xl">
      <div className="p-4">
        <Link
          href="/settings"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back to Settings</span>
        </Link>

        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {activeSection.label}
          </h3>

          <nav className="space-y-1">
            {activeSection.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                    ${isActive
                      ? 'bg-purple-50 text-purple-700 font-medium border-l-4 border-purple-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  {Icon && (
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                  )}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
