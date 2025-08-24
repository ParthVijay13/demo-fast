"use client"
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Type definitions
interface GlossaryItem {
  title: string;
  mandatory: boolean;
  description: string;
  sample: string;
}

type OrderType = 'reverse-orders' | 'reverse-shipments';

interface Channel {
  id: string;
  name: string;
}

const ReverseOrderForm: React.FC = () => {
  const router = useRouter();
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('reverse-orders');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const channels: Channel[] = [
    { id: 'delhivery', name: 'DELHIVERY' },
    { id: 'express', name: 'EXPRESS' },
    
  ];

  const glossaryData: GlossaryItem[] = [
    {
      title: 'Reverse Order Number',
      mandatory: true,
      description: "It's a unique number given for easy order identification. Enter Order ID for trackability.",
      sample: '5001123'
    },
    {
      title: 'Customer Name',
      mandatory: true,
      description: 'Full name of the Customer from whom pickup is to be initiated.',
      sample: 'James Albert'
    },
    {
      title: 'Customer Email ID',
      mandatory: false,
      description: 'Email ID of the customer from whom pickup is to be initiated',
      sample: 'james@mail.com'
    }
  ];

  const handleOrderTypeChange = (type: OrderType): void => {
    setSelectedOrderType(type);
  };

  const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedChannel(event.target.value);
  };

  const handleFileUpload = (file: File): void => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setUploadedFile(file);
    } else {
      alert('Please upload a CSV file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleClickUpload = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const downloadTemplate = (): void => {
    // In a real application, this would trigger a template download
    console.log('Downloading CSV template...');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button className="text-gray-600 hover:text-gray-800 text-lg" onClick={() => router.back()}>
            ←
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Upload Reverse Orders</h1>
          <button className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            📖 Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Option Cards */}
            <div className="flex flex-col md:flex-row gap-4">
              <div
                className={`flex-1 p-5 border-2 rounded-lg cursor-pointer relative ${
                  selectedOrderType === 'reverse-orders'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleOrderTypeChange('reverse-orders')}
              >
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Recommended
                </div>
                <h3 className="text-lg font-medium mb-2">Reverse Orders</h3>
                <p className="text-gray-600 text-sm mb-3">
                  New orders will be created and you can manifest them later. View these in the Pending Orders tab
                </p>
                {selectedOrderType === 'reverse-orders' && (
                  <div className="text-green-500 text-xl">✓</div>
                )}
              </div>

              <div
                className={`flex-1 p-5 border-2 rounded-lg cursor-pointer ${
                  selectedOrderType === 'reverse-shipments'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleOrderTypeChange('reverse-shipments')}
              >
                <h3 className="text-lg font-medium mb-2">Reverse Shipments</h3>
                <p className="text-gray-600 text-sm mb-3">
                  AWBs will be created and manifested immediately. View them in the Ready for pickup tab
                </p>
                {selectedOrderType === 'reverse-shipments' && (
                  <div className="text-green-500 text-xl">✓</div>
                )}
              </div>
            </div>

            {/* Channel Selection */}
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Select Channel</h3>
              <select
                className="w-full p-3 border border-gray-300 rounded text-gray-700"
                value={selectedChannel}
                onChange={handleChannelChange}
              >
                <option value="">Select a channel</option>
                {channels.map(channel => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Orders uploaded will be linked to this channel
              </p>
            </div>

            {/* Upload Area */}
            <div
              className={`bg-white border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragOver
                  ? 'border-purple-500 bg-purple-50'
                  : uploadedFile
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickUpload}
            >
              {uploadedFile ? (
                <div className="text-green-600">
                  <div className="text-2xl mb-2">✓</div>
                  <div>File uploaded: {uploadedFile.name}</div>
                </div>
              ) : (
                <>
                  <div className="relative inline-block mb-5">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">CSV</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 text-purple-600 text-xl">↗</div>
                  </div>
                  <div className="mb-3">Drop your .CSV file with list of orders</div>
                  <div className="text-sm text-gray-600 mb-4">
                    Please download and use the template from the top right corner
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    You can drag and drop or Click here to upload, we'll create the orders for you
                  </div>
                </>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Right Column - Instructions */}
          <div className="bg-white rounded-lg p-5 h-fit">
            <h3 className="text-lg font-medium mb-5 flex items-center gap-2">
              📝 Instructions
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">Download CSV Template?</div>
                  <div className="text-sm text-gray-600 mb-3">
                    Download template & Fill rows with order data
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="bg-white border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    ⬇ Download Template
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">Check Mandatory data and upload</div>
                  <div className="text-sm text-gray-600">
                    Make sure all the mandatory fields are filled and then upload
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glossary Table */}
        <div className="bg-white rounded-lg overflow-hidden mt-8">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-medium flex items-center gap-2">
              📋 Glossary
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mandatory
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sample
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {glossaryData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.title}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.mandatory
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {item.mandatory ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{item.description}</td>
                    <td className="px-4 py-4">
                      <code className="px-2 py-1 bg-gray-100 text-sm rounded">
                        {item.sample}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseOrderForm;