"use client"
import React, { useState } from 'react';
import { Info, Package, User, Phone, RotateCcw, Headphones, Image } from 'lucide-react';

interface LabelPreferenceState {
  labelFormat: string;
  // Brand Logo
  displayBrandLogo: boolean;
  // Seller Details
  displaySellerName: boolean;
  displaySellerGST: boolean;
  displaySellerAddress: boolean;
  displaySellerPincode: boolean;
  // Product Details
  displaySKU: boolean;
  displayProductName: boolean;
  displayQuantity: boolean;
  displayAmount: boolean;
  displayTaxes: boolean;
  // Return Address
  displayReturnAddress: boolean;
  // Support Details
  displaySupportDetails: boolean;
  // Footer
  displayFooterSupportContact: boolean;
}

const LabelPreference: React.FC = () => {
  const [preferences, setPreferences] = useState<LabelPreferenceState>({
    labelFormat: 'thermal-full',
    // Brand Logo
    displayBrandLogo: true,
    // Seller Details
    displaySellerName: true,
    displaySellerGST: true,
    displaySellerAddress: true,
    displaySellerPincode: true,
    // Product Details
    displaySKU: false,
    displayProductName: true,
    displayQuantity: true,
    displayAmount: true,
    displayTaxes: false,
    // Return Address
    displayReturnAddress: true,
    // Support Details
    displaySupportDetails: true,
    // Footer
    displayFooterSupportContact: true,
  });

  // const handleLabelFormatChange = (format: string) => {
  //   setPreferences({ ...preferences, labelFormat: format });
  // };

  const handleCheckboxChange = (field: keyof LabelPreferenceState, value: boolean) => {
    setPreferences({ ...preferences, [field]: value });
  };

  const handleSave = () => {
    console.log('Saving preferences:', preferences);
    alert('Label preferences saved successfully!');
  };

  // Mandatory fields data - exactly as provided
  const mandatoryFields = [
    {
      section: 'Courier Details',
      fields: ['Courier Company Logo', 'Courier Company Name']
    },
    {
      section: 'Tracking Information',
      fields: ['AWB Number', 'Barcode', 'Manifested Date']
    },
    {
      section: 'Payment Information',
      fields: ['Payment Mode', 'Amount']
    },
    {
      section: 'Consignee Details',
      fields: ['Name', 'Address', 'Phone Number']
    },
    {
      section: 'Last Mile',
      fields: ['DC Name', 'Pincode']
    },
    {
      section: 'Shipping Information',
      fields: ['Transport Mode', 'Order ID', 'Order Barcode']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Label Preference</h1>
        <p className="text-gray-600">Configure your shipping label format and customize the information displayed</p>
      </div>



      {/* Mandatory Fields Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
          <Info className="w-5 h-5" />
          Mandatory Fields (Always Displayed)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mandatoryFields.map(({ section, fields }) => (
            <div key={section} className="bg-white p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2 text-sm">{section}:</h3>
              <div className="flex flex-wrap gap-1.5">
                {fields.map((field) => (
                  <span key={field} className="px-2.5 py-1 bg-blue-100 text-xs text-blue-700 rounded-full border border-blue-200">
                    {field}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Fields Sections */}
      <div className="space-y-6">
        {/* Brand Logo Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Image className="w-5 h-5 text-purple-600" />
            Brand Logo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displayBrandLogo}
                onChange={(e) => handleCheckboxChange('displayBrandLogo', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Display Brand Logo</span>
                <p className="text-sm text-gray-500">Show your brand logo on the shipping label</p>
              </div>
            </label>
          </div>
        </div>

        {/* Seller Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <User className="w-5 h-5 text-purple-600" />
            Seller Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displaySellerName}
                onChange={(e) => handleCheckboxChange('displaySellerName', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Seller Name</span>
                <p className="text-sm text-gray-500">Display seller/business name on label</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displaySellerGST}
                onChange={(e) => handleCheckboxChange('displaySellerGST', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">GST Number</span>
                <p className="text-sm text-gray-500">Show GST registration number</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displaySellerAddress}
                onChange={(e) => handleCheckboxChange('displaySellerAddress', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Address</span>
                <p className="text-sm text-gray-500">Display complete seller address</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displaySellerPincode}
                onChange={(e) => handleCheckboxChange('displaySellerPincode', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Pincode</span>
                <p className="text-sm text-gray-500">Show seller location pincode</p>
              </div>
            </label>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Package className="w-5 h-5 text-purple-600" />
            Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displaySKU}
                onChange={(e) => handleCheckboxChange('displaySKU', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">SKU</span>
                <p className="text-sm text-gray-500">Display product SKU codes</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displayProductName}
                onChange={(e) => handleCheckboxChange('displayProductName', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Product Name</span>
                <p className="text-sm text-gray-500">Show product names on label</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displayQuantity}
                onChange={(e) => handleCheckboxChange('displayQuantity', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Quantity</span>
                <p className="text-sm text-gray-500">Display item quantities</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displayAmount}
                onChange={(e) => handleCheckboxChange('displayAmount', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Amount</span>
                <p className="text-sm text-gray-500">Show product prices</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displayTaxes}
                onChange={(e) => handleCheckboxChange('displayTaxes', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Taxes</span>
                <p className="text-sm text-gray-500">Display tax breakdown</p>
              </div>
            </label>
          </div>
        </div>

        {/* Return Address Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <RotateCcw className="w-5 h-5 text-purple-600" />
            Return Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displayReturnAddress}
                onChange={(e) => handleCheckboxChange('displayReturnAddress', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Display Return Address</span>
                <p className="text-sm text-gray-500">Show complete return address on label</p>
                <p className="text-xs text-amber-600 mt-1">Important for easy returns processing</p>
              </div>
            </label>
          </div>
        </div>

        {/* Support Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Headphones className="w-5 h-5 text-purple-600" />
            Support Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displaySupportDetails}
                onChange={(e) => handleCheckboxChange('displaySupportDetails', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Display Support Details</span>
                <p className="text-sm text-gray-500">Show customer support information</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Phone className="w-5 h-5 text-purple-600" />
            Footer - Brand Support Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.displayFooterSupportContact}
                onChange={(e) => handleCheckboxChange('displayFooterSupportContact', e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-700">Brand Support Contact Number</span>
                <p className="text-sm text-gray-500">Display support contact in label footer</p>
                <p className="text-xs text-green-600 mt-1">Recommended for better customer experience</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default LabelPreference;