"use client";
import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { bulkUploadOrders, fetchOrders } from '@/app/redux/slices/ordersSlice';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadResult {
  successful: Array<{
    row: number;
    order_id: string;
    id: string;
    status: string;
  }>;
  failed: Array<{
    row: number;
    order_id: string;
    error: string;
  }>;
  summary: {
    total_rows: number;
    successful_count: number;
    failed_count: number;
  };
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { creating } = useAppSelector((state) => state.orders);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setUploadResult(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const result = await dispatch(bulkUploadOrders(selectedFile)).unwrap();
      setUploadResult(result);
      
      // Refresh orders list if there were successful uploads
      if (result.summary.successful_count > 0) {
        await dispatch(fetchOrders());
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `order_id,consignee_name,consignee_phone,consignee_address_line_1,consignee_address_line_2,consignee_pincode,consignee_city,consignee_state,consignee_country,payment_mode,cod_amount,shipment_mode,warehouse_name,sku_code,item_name,category,price,discount,package_weight,package_length,package_breadth,package_height,is_fragile
ORD001,John Doe,9876543210,123 Main Street,Near Park,400001,Mumbai,Maharashtra,India,PREPAID,,SURFACE,Main Warehouse,SKU001,Product 1,Electronics,999.99,0,0.5,10,8,5,false
ORD002,Jane Smith,9876543211,456 Oak Avenue,,560001,Bangalore,Karnataka,India,COD,1299.99,EXPRESS,Main Warehouse,SKU002,Product 2,Fashion,1299.99,100,0.3,15,12,3,true`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_orders_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setIsUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Upload Orders
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!uploadResult ? (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Upload Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload a CSV file with order details</li>
                <li>• Each row represents one order</li>
                <li>• Maximum file size: 10MB</li>
                <li>• All required fields must be filled</li>
                <li>• Phone numbers must be 10 digits</li>
                <li>• Pincodes must be 6 digits</li>
                <li>• Payment mode: PREPAID or COD</li>
                <li>• Shipment mode: SURFACE or EXPRESS</li>
              </ul>
            </div>

            {/* Sample CSV Download */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="font-medium">Sample CSV Template</h3>
                  <p className="text-sm text-gray-600">Download to see the required format</p>
                </div>
              </div>
              <button
                onClick={downloadSampleCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Download className="w-4 h-4" />
                Download Sample
              </button>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv"
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Change File
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Orders'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Select CSV file to upload</p>
                    <p className="text-gray-600">or drag and drop here</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Browse Files
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Upload Results */
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{uploadResult.summary.total_rows}</div>
                <div className="text-sm text-blue-600">Total Rows</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{uploadResult.summary.successful_count}</div>
                <div className="text-sm text-green-600">Successful</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-700">{uploadResult.summary.failed_count}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            {/* Successful Orders */}
            {uploadResult.successful.length > 0 && (
              <div>
                <h3 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Successfully Created Orders ({uploadResult.successful.length})
                </h3>
                <div className="max-h-40 overflow-y-auto border border-green-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Row</th>
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadResult.successful.map((item, index) => (
                        <tr key={index} className="border-t border-green-100">
                          <td className="px-4 py-2">{item.row}</td>
                          <td className="px-4 py-2">{item.order_id}</td>
                          <td className="px-4 py-2">
                            <span className="text-green-700 bg-green-100 px-2 py-1 rounded text-xs">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Failed Orders */}
            {uploadResult.failed.length > 0 && (
              <div>
                <h3 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Failed Orders ({uploadResult.failed.length})
                </h3>
                <div className="max-h-40 overflow-y-auto border border-red-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Row</th>
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadResult.failed.map((item, index) => (
                        <tr key={index} className="border-t border-red-100">
                          <td className="px-4 py-2">{item.row}</td>
                          <td className="px-4 py-2">{item.order_id}</td>
                          <td className="px-4 py-2 text-red-700">{item.error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setUploadResult(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Upload Another File
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUploadModal;
