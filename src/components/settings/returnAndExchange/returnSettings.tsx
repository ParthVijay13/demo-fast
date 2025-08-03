"use client"

import React, { useState } from 'react';
import { Upload, Download, Calendar, Monitor, Package, FileText, Laptop } from 'lucide-react';

interface ReturnReason {
  id: string;
  label: string;
  imageRequired: 'Mandatory' | 'Optional';
  checked: boolean;
}

const ReturnPolicySettings: React.FC = () => {
  const [returnWindow, setReturnWindow] = useState<number>(0);
  const [returnOption, setReturnOption] = useState<'all' | 'customize'>('customize');
  const [returnReasons, setReturnReasons] = useState<ReturnReason[]>([
    { id: 'damaged', label: 'Item is damaged', imageRequired: 'Mandatory', checked: false },
    { id: 'wrong-item', label: 'Received wrong item', imageRequired: 'Mandatory', checked: false },
    { id: 'parcel-damaged', label: 'Parcel damaged on arrival', imageRequired: 'Mandatory', checked: false },
    { id: 'quality', label: 'Quality not as expected', imageRequired: 'Optional', checked: false },
    { id: 'missing', label: 'Missing Item or accessories', imageRequired: 'Optional', checked: false },
    { id: 'performance', label: 'Performance not adequate', imageRequired: 'Optional', checked: false },
    { id: 'size', label: 'Size not as expected', imageRequired: 'Optional', checked: false },
    { id: 'not-fit', label: 'Does not fit', imageRequired: 'Optional', checked: false },
    { id: 'not-described', label: 'Not as described', imageRequired: 'Optional', checked: false },
    { id: 'late', label: 'Arrived too late', imageRequired: 'Optional', checked: false },
    { id: 'changed-mind', label: 'Changed my mind', imageRequired: 'Optional', checked: false },
    { id: 'other', label: 'Other', imageRequired: 'Mandatory', checked: false }
  ]);

  const handleReasonToggle = (id: string) => {
    setReturnReasons(prev => 
      prev.map(reason => 
        reason.id === id ? { ...reason, checked: !reason.checked } : reason
      )
    );
  };

  const handleSelectAll = () => {
    const allChecked = returnReasons.every(reason => reason.checked);
    setReturnReasons(prev => 
      prev.map(reason => ({ ...reason, checked: !allChecked }))
    );
  };

  const processSteps = [
    {
      icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />,
      title: "Buyer request Return from Tracking Page"
    },
    {
      icon: <Laptop className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />,
      title: "Accept/Decline your Return Requests"
    },
    {
      icon: <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />,
      title: "Schedule Pickup for Returns"
    },
    {
      icon: <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />,
      title: "Process refund or send Payout Links with RazorpayX Integration"
    },
    {
      icon: <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />,
      title: "Acknowledge Returned Product(s) and Auto Restock"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
          Return Policy Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          How does the return process work?
        </p>
      </div>

      {/* Process Flow - Responsive */}
      <div className="mb-6 sm:mb-8">
        {/* Desktop/Tablet Horizontal Flow */}
        <div className="hidden md:flex items-center justify-between mb-6">
          {processSteps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center max-w-32 lg:max-w-48">
                <div className="mb-3">
                  {step.icon}
                </div>
                <p className="text-xs lg:text-sm text-gray-700 leading-tight">{step.title}</p>
              </div>
              {index < processSteps.length - 1 && (
                <div className="flex-1 mx-2 lg:mx-4">
                  <div className="border-t-2 border-dashed border-gray-300"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Vertical Flow */}
        <div className="md:hidden space-y-4 mb-6">
          {processSteps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {step.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-tight">{step.title}</p>
              </div>
              {index < processSteps.length - 1 && (
                <div className="absolute left-7 mt-8 w-0.5 h-4 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Return Window */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Define the return window for the products
        </label>
        <p className="text-xs sm:text-sm text-gray-600 mb-3">
          No. of days upto which the customer can place return request for the products
        </p>
        <div className="flex items-center">
          <input
            type="number"
            value={returnWindow}
            onChange={(e) => setReturnWindow(Number(e.target.value))}
            className="w-16 sm:w-20 px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <span className="ml-2 text-xs sm:text-sm text-gray-700">Days</span>
        </div>
      </div>

      {/* Product Selection */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Which Products are allowed to be returned?
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Select the SKUs or the products that are allowed to be returned
        </p>
        
        <div className="space-y-3">
          <label className="flex items-start">
            <input
              type="radio"
              name="returnOption"
              value="all"
              checked={returnOption === 'all'}
              onChange={(e) => setReturnOption(e.target.value as 'all' | 'customize')}
              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 mt-0.5 flex-shrink-0"
            />
            <span className="ml-2 text-xs sm:text-sm text-gray-700">
              All Products SKUs are allowed to be returned
            </span>
          </label>
          
          <label className="flex items-start">
            <input
              type="radio"
              name="returnOption"
              value="customize"
              checked={returnOption === 'customize'}
              onChange={(e) => setReturnOption(e.target.value as 'all' | 'customize')}
              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 mt-0.5 flex-shrink-0"
            />
            <span className="ml-2 text-xs sm:text-sm text-gray-700">
              Customize the list for returnable products
            </span>
          </label>
        </div>

        {returnOption === 'customize' && (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-700 mb-2">
                Please upload the list of SKU&pos;s that are eligible for return{' '}
                <span className="text-gray-500">(Only csv file format will be accepted.)</span>
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.type !== 'text/csv') {
                        alert('Please upload a valid CSV file');
                        return;
                      }
                      console.log('CSV file selected:', file.name);
                    }
                  }}
                />
                <div className="flex items-center justify-center sm:justify-start px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="text-xs sm:text-sm">Browse and Upload (csv)</span>
                </div>
              </label>
            </div>
            
            <button className="flex items-center text-purple-600 hover:text-purple-700 text-xs sm:text-sm">
              <Download className="w-4 h-4 mr-2" />
              Download Sample File
            </button>
          </div>
        )}
      </div>

      {/* Return Reasons - Responsive Grid */}
      <div className="mb-8">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          List of reasons for return
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Select the reason that will be shown to your buyer
        </p>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {returnReasons.map((reason) => (
            <label key={reason.id} className="flex items-start space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={reason.checked}
                onChange={() => handleReasonToggle(reason.id)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-gray-900 break-words">
                  {reason.label}
                </div>
                <div className="text-xs text-gray-500">
                  Image: {reason.imageRequired}
                </div>
              </div>
            </label>
          ))}
        </div>
        
        <label className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors w-fit">
          <input
            type="checkbox"
            checked={returnReasons.every(reason => reason.checked)}
            onChange={handleSelectAll}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="ml-2 text-xs sm:text-sm text-gray-700 font-medium">
            Select All
          </span>
        </label>
      </div>

      {/* Save Button - Responsive */}
      <div className="flex justify-center">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto max-w-xs">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default ReturnPolicySettings;
