"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Upload, Download, FileText, ChevronDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { 
  uploadBulkOrders, 
  downloadTemplate, 
  clearUploadError, 
  clearDownloadError, 
  clearUploadResult,
  selectBulkUploading,
  selectBulkUploadError,
  selectBulkUploadResult,
  selectDownloadingTemplate,
  selectDownloadError
} from '@/app/redux/slices/bulkUploadSlice';

interface GlossaryItem {
  title: string;
  mandatory: boolean;
  description: string;
  sample: string;
}

type UploadOption = 'orders' | 'shipments';
type ChannelOption = '' | 'delivery' | 'express';

 const BulkUploadOrders: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const uploading = useAppSelector(selectBulkUploading);
  const uploadError = useAppSelector(selectBulkUploadError);
  const uploadResult = useAppSelector(selectBulkUploadResult);
  const downloadingTemplate = useAppSelector(selectDownloadingTemplate);
  const downloadError = useAppSelector(selectDownloadError);

  const [selectedOption, setSelectedOption] = useState<UploadOption>('orders');
  const [selectedChannel, setSelectedChannel] = useState<ChannelOption>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const glossaryData: GlossaryItem[] = [
    {
      title: "Order ID",
      mandatory: true,
      description: "Unique identifier for the order. Must be unique across all orders.",
      sample: "ORD_12345"
    },
    {
      title: "Consignee Name",
      mandatory: true,
      description: "Full name of the person receiving the order.",
      sample: "John Doe"
    },
    {
      title: "Consignee Phone",
      mandatory: true,
      description: "10-digit phone number of the consignee.",
      sample: "9876543210"
    },
    {
      title: "Consignee Address Line 1",
      mandatory: true,
      description: "Primary address line for delivery.",
      sample: "123 Main Street"
    },
    {
      title: "Consignee Pincode",
      mandatory: true,
      description: "6-digit postal code for delivery address.",
      sample: "110001"
    },
    {
      title: "Payment Mode",
      mandatory: true,
      description: "Payment method - must be 'Prepaid' or 'COD'.",
      sample: "Prepaid"
    },
    {
      title: "Shipment Mode",
      mandatory: true,
      description: "Shipping method - must be 'Surface' or 'Express'.",
      sample: "Express"
    },
    {
      title: "Warehouse Name",
      mandatory: true,
      description: "Name of the warehouse/pickup location (must exist in your warehouses).",
      sample: "Main Warehouse"
    },
    {
      title: "SKU Code",
      mandatory: true,
      description: "Stock keeping unit code for the product.",
      sample: "SKU001"
    },
    {
      title: "Item Name",
      mandatory: true,
      description: "Name/description of the product being shipped.",
      sample: "Smartphone"
    },
    {
      title: "Category",
      mandatory: true,
      description: "Product category for classification.",
      sample: "Electronics"
    },
    {
      title: "Price",
      mandatory: true,
      description: "Price of the product (numeric value).",
      sample: "15000"
    },
    {
      title: "COD Amount",
      mandatory: false,
      description: "Cash on delivery amount (required if payment mode is COD).",
      sample: "15000"
    },
    {
      title: "Package Weight",
      mandatory: false,
      description: "Weight of the package in grams.",
      sample: "500"
    },
    {
      title: "Package Dimensions",
      mandatory: false,
      description: "Length, breadth, height in cm (optional).",
      sample: "20,15,10"
    }
  ];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Clear errors and results on component mount
  useEffect(() => {
    dispatch(clearUploadError());
    dispatch(clearDownloadError());
    dispatch(clearUploadResult());
  }, [dispatch]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Please select a CSV file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Please select a CSV file');
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await dispatch(downloadTemplate()).unwrap();
    } catch (error) {
      console.error('Failed to download template:', error);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    try {
      await dispatch(uploadBulkOrders(selectedFile)).unwrap();
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Bulk Upload Orders</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
            <FileText className="w-4 h-4" />
            Learn More
          </button>
        </div>

        {/* Error Display */}
        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{uploadError}</span>
            </div>
          </div>
        )}

        {downloadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{downloadError}</span>
            </div>
          </div>
        )}

        {/* Success Result Display */}
        {uploadResult && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800 mb-3">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Bulk upload completed successfully!</span>
            </div>
            <div className="text-sm text-green-700">
              <p>Total rows: {uploadResult.summary.total_rows}</p>
              <p>Successful: {uploadResult.summary.successful_count}</p>
              <p>Failed: {uploadResult.summary.failed_count}</p>
            </div>
            {uploadResult.failed.length > 0 && (
              <div className="mt-3">
                <details className="text-sm">
                  <summary className="cursor-pointer text-red-700 font-medium">View failed rows</summary>
                  <div className="mt-2 space-y-1">
                    {uploadResult.failed.map((error, index) => (
                      <div key={index} className="text-red-600">
                        Row {error.row}: {error.error}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upload Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upload Orders */}
              <div 
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOption === 'orders' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedOption('orders')}
              >
                {selectedOption === 'orders' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">Upload Orders</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Recommended</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    New orders will be created and you can manifest them later. View these in the Pending Orders tab
                  </p>
                </div>
              </div>

              {/* Upload Shipments */}
              <div 
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOption === 'shipments' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedOption('shipments')}
              >
                {selectedOption === 'shipments' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Upload Shipments</h3>
                  <p className="text-sm text-gray-600">
                    AWBs will be created and manifested immediately. View them in the Ready to Ship tab
                  </p>
                </div>
              </div>
            </div>

            {/* Channel Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Channel
              </label>
              <div className="relative">
                <select 
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value as ChannelOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select a channel</option>
                  <option value="delivery">Delivery</option>
                  <option value="express">Express</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <p className="text-sm text-gray-500">
                Orders uploaded will be linked to this channel
              </p>
            </div>

            {/* File Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : selectedFile
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                    selectedFile ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {selectedFile ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <FileText className="w-8 h-8 text-blue-600" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedFile ? 'File selected successfully!' : 'Drop your .CSV file with list of orders'}
                  </h3>
                  {selectedFile && (
                    <p className="text-sm text-green-600 font-medium">
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                  <p className="text-gray-600">
                    Please download and use the template from the top right corner
                  </p>
                  <p className="text-sm text-gray-500">
                    You can drag and drop or{' '}
                    <button className="text-blue-600 hover:text-blue-700 underline">
                      Click here to upload
                    </button>
                    , we'll create the orders for you
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Upload Button */}
            {selectedFile && (
              <div className="flex justify-center">
                <button
                  onClick={handleUploadFile}
                  disabled={uploading}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                    uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {uploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    'Upload Orders'
                  )}
                </button>
              </div>
            )}

            {/* Glossary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Glossary</h2>
              </div>
              
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mandatory
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sample
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {glossaryData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {item.title}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`px-2 py-1 text-xs rounded ${
                              item.mandatory 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.mandatory ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 max-w-md">
                            {item.description}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 font-mono">
                            {item.sample}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 space-y-6 sticky top-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Instructions</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Download CSV Template?</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Download template & Fill rows with order data
                      </p>
                      <button 
                        onClick={handleDownloadTemplate}
                        disabled={downloadingTemplate}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full justify-center transition-colors ${
                          downloadingTemplate
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {downloadingTemplate ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download Template
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Check Mandatory data and upload</h4>
                      <p className="text-sm text-gray-600">
                        Make sure all the mandatory fields are filled and then upload
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkUploadOrders;