"use client"
import { Building2, DollarSign } from 'lucide-react';
import SettingsCard from '@/components/settings/settingsCard';
import SettingsHeader from '@/components/settings/settingsHeader';
import { useState } from 'react';

export default function SettingsPage() {
  const [searchText, setSearchText] = useState('');
  const safeSearchText = typeof searchText === 'string' ? searchText : '';
  
  const settingsSections = [
    {
      title: 'COMPANY SETUP',
      icon: Building2,
      iconBgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
      items: [
        {
          title: 'Company Details',
          description: 'View, edit and update the company related details like brand name, email, logo.',
          href: '/settings/company-setup/company-details'
        },
        // {
        //   title: 'Domestic KYC',
        //   description: 'Submit Know Your Customer (KYC) information for uninterrupted shipping.',
        //   href: '/settings/company-setup/domestic-kyc'
        // },
        {
          title: 'Pickup Addresses',
          description: 'Manage all your pickup addresses here',
          href: '/settings/company-setup/pickup-address'
        },
        // {
        //   title: 'Billing, Invoice, & GSTIN',
        //   description: 'Add your billing address, invoice preferences, or set up GSTIN invoicing.',
        //   href: '/settings/company-setup/billing-invoice-gst'
        // },
        {
          title: 'Labels',
          description: 'Choose the suitable label format for your company',
          href: '/settings/company-setup/labels'
        },
        {
          title: 'Password & Login Security',
          description: 'Manage and update your account password & Login Security here',
          href: '/settings/company-setup//password-security'
        }
      ]
    },
    {
      title: 'SELLER REMITTANCE',
      icon: DollarSign,
      iconBgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
      items: [
        {
          title: 'Bank Details',
          description: 'Add bank account details where you want your COD to be remitted.',
          href: '/settings/seller-remittance/bank-details'
        }
      ]
    },
    // {
    //   title: 'COURIER MANAGEMENT',
    //   icon: DollarSign,
    //   iconBgColor: 'bg-teal-100',
    //   iconColor: 'text-teal-600',
    //   items: [
    //     {
    //       title: 'Courier Priority',
    //       description: 'Set your courier priority ranking on basis of which they will be assigned to orders during bulk courier assignment',
    //       href: '/settings/courier-management/courier-priority'
    //     },
    //     {
    //       title: 'Courier Rules',
    //       description: 'Gain more shipping control by creating custom courier rules which will be auto-applied during bulk shipments',
    //       href: '/settings/courier-management/courier-rules'
    //     }
    //   ]
    // },
    // {
    //   title: 'RETURNS AND EXCHANGE',
    //   icon: DollarSign,
    //   iconBgColor: 'bg-teal-100',
    //   iconColor: 'text-teal-600',
    //   items: [
    //     {
    //       title: 'Return Settings',
    //       description: 'Set up and enable return settings as per your preference',
    //       href: '/settings/return-exchange/return-settings'
    //     }
    //   ]
    // },
    // {
    //   title: 'ADDITIONAL SETTINGS',
    //   icon: DollarSign,
    //   iconBgColor: 'bg-teal-100',
    //   iconColor: 'text-teal-600',
    //   items: [
    //     {
    //       title: 'Manage Users',
    //       description: 'Create users & give them Shiprocket access for selected functions based on their roles',
    //       href: '/settings/additional-settings/manage-users'
    //     },
    //     {
    //       title: 'API Keys',
    //       description: 'Add or Update new API user, reset their password or make user active or Inactive',
    //       href: '/settings/additional-settings/api-keys'
    //     }
    //   ]
    // }
  ];

  const filteredSections = settingsSections
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.title.toLowerCase().includes(safeSearchText.toLowerCase()) ||
        item.description.toLowerCase().includes(safeSearchText.toLowerCase())
      )
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <SettingsHeader searchText={searchText} setSearchText={setSearchText} />
      
      {filteredSections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No settings found</div>
          <div className="text-gray-500 text-sm">
            Try adjusting your search terms to find what you&pos;re looking for.
          </div>
        </div>
      ) : (
        filteredSections.map(section => (
          <div key={section.title} className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${section.iconBgColor} hidden sm:flex`}>
                <section.icon className={`w-5 h-5 ${section.iconColor}`} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800 tracking-wide">
                {section.title}
              </h2>
            </div>
            
            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {section.items.map(item => (
                <SettingsCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}