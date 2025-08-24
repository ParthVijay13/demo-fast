"use client";
import React, { useState } from 'react';
import { Truck, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAppDispatch } from '@/app/redux/store';
import { manifestOrders, fetchOrders } from '@/app/redux/slices/ordersSlice';

interface ManifestOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrderIds: string[];
  orders: any[];
}

interface ManifestResult {
  successful: Array<{
    order_id: string;
    id: string;
    awb_number: string;
    status: string;
  }>;
  failed: Array<{
    order_id: string;
    id: string;
    error: string;
  }>;
  summary: {
    total_requested: number;
    successful_count: number;
    failed_count: number;
  };
}

const ManifestOrdersModal: React.FC<ManifestOrdersModalProps> = ({
  isOpen,
  onClose,
  selectedOrderIds,
  orders
}) => {
  const dispatch = useAppDispatch();
  const [isManifesting, setIsManifesting] = useState(false);
  const [manifestResult, setManifestResult] = useState<ManifestResult | null>(null);

  if (!isOpen) return null;

  const selectedOrders = orders.filter(order => selectedOrderIds.includes(order.id));

  const handleManifest = async () => {
    setIsManifesting(true);
    try {
      const result = await dispatch(manifestOrders(selectedOrderIds)).unwrap();
      setManifestResult(result);
      
      // Refresh orders list
      await dispatch(fetchOrders());
    } catch (error) {
      console.error('Manifest failed:', error);
      alert('Manifest failed. Please try again.');
    } finally {
      setIsManifesting(false);
    }
  };

  const handleClose = () => {
    setManifestResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Manifest Orders
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!manifestResult ? (
          <div className="space-y-6">
            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">What is Manifesting?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Manifesting submits orders to the courier partner (Delhivery)</li>
                <li>• AWB numbers will be generated for each order</li>
                <li>• Orders will be ready for pickup/dispatch</li>
                <li>• Only PENDING orders can be manifested</li>
                <li>• This action cannot be undone</li>
              </ul>
            </div>

            {/* Selected Orders */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Selected Orders ({selectedOrders.length})
              </h3>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrders.map((order, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="px-4 py-2 font-medium">{order.order_id || order.id}</td>
                        <td className="px-4 py-2">{order.consignee_name || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.payment_mode === 'COD'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {order.payment_mode}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">Important Notice</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Once manifested, orders cannot be cancelled or modified easily. 
                    Please ensure all order details are correct before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isManifesting}
              >
                Cancel
              </button>
              <button
                onClick={handleManifest}
                disabled={isManifesting || selectedOrders.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isManifesting ? 'Manifesting...' : `Manifest ${selectedOrders.length} Orders`}
              </button>
            </div>
          </div>
        ) : (
          /* Manifest Results */
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{manifestResult.summary.total_requested}</div>
                <div className="text-sm text-blue-600">Total Requested</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{manifestResult.summary.successful_count}</div>
                <div className="text-sm text-green-600">Manifested</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-700">{manifestResult.summary.failed_count}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            {/* Successful Manifests */}
            {manifestResult.successful.length > 0 && (
              <div>
                <h3 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Successfully Manifested ({manifestResult.successful.length})
                </h3>
                <div className="max-h-40 overflow-y-auto border border-green-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">AWB Number</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manifestResult.successful.map((item, index) => (
                        <tr key={index} className="border-t border-green-100">
                          <td className="px-4 py-2">{item.order_id}</td>
                          <td className="px-4 py-2 font-mono text-sm">{item.awb_number}</td>
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

            {/* Failed Manifests */}
            {manifestResult.failed.length > 0 && (
              <div>
                <h3 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Failed Manifests ({manifestResult.failed.length})
                </h3>
                <div className="max-h-40 overflow-y-auto border border-red-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manifestResult.failed.map((item, index) => (
                        <tr key={index} className="border-t border-red-100">
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
            <div className="flex justify-end">
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

export default ManifestOrdersModal;
