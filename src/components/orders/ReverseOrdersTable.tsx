"use client";
import React from 'react';
import { 
  Search, 
  Package, 
  Clock, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  MoreVertical 
} from 'lucide-react';
import type { ReverseOrder } from '@/types/orders';

interface ReverseOrdersTableProps {
  orders: ReverseOrder[];
  loading: boolean;
  error: string | null;
  selectedOrders?: string[];
  onSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOrder?: (orderId: string) => void;
  onOrderAction?: (orderId: string, action: string) => void;
}

const ReverseOrdersTable: React.FC<ReverseOrdersTableProps> = ({
  orders,
  loading,
  error,
  selectedOrders = [],
  onSelectAll,
  onSelectOrder,
  onOrderAction
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'ready-for-pickup':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'in-transit':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready-for-pickup':
        return 'bg-blue-100 text-blue-800';
      case 'in-transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Orders</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading reverse orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300">
            <Package className="w-full h-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Reverse Orders Found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onSelectAll && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedOrders.length === orders.length}
                    onChange={onSelectAll}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Return Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight & Zone
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                {onSelectOrder && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => onSelectOrder(order.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                )}
                
                {/* Order Details */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">
                      {order.date} • {order.time}
                    </div>
                    {order.awbNumber && (
                      <div className="text-xs text-blue-600 mt-1">AWB: {order.awbNumber}</div>
                    )}
                  </div>
                </td>

                {/* Return Info */}
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    {order.returnReason && (
                      <div className="text-sm text-gray-900">{order.returnReason}</div>
                    )}
                    {order.returnLocation && (
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {order.returnLocation}
                      </div>
                    )}
                    {order.originalOrderId && (
                      <div className="text-xs text-gray-500">
                        Original: {order.originalOrderId}
                      </div>
                    )}
                  </div>
                </td>

                {/* Product Details */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {order.productDetails}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {order.pickupAddress}
                    </div>
                    {order.fragilePackage && (
                      <div className="text-xs text-orange-600 mt-1">⚠️ Fragile</div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </td>

                {/* Weight & Zone */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-900">{order.weight}</div>
                    <div className="text-sm text-gray-500">{order.zone}</div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  {onOrderAction && (
                    <button
                      onClick={() => onOrderAction(order.id, 'view')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReverseOrdersTable;
