"use client";
import React, { useMemo, useState, useCallback } from 'react';
import { 
  Clock, Package, Truck, CheckCircle, AlertCircle, MapPin, Edit3, MoreHorizontal, 
  Copy, FileText, Printer, X
} from 'lucide-react';
import type { Order, OrderStatus } from '@/types/orders';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  selectedOrders: string[];
  generatingAwbId: string | null;
  currentStatus: OrderStatus | 'all-shipments';
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOrder: (orderId: string) => void;
  onGenerateAwb: (orderId: string) => Promise<void>;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  selectedOrders,
  generatingAwbId,
  currentStatus,
  onSelectAll,
  onSelectOrder,
  onGenerateAwb
}) => {
  const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600 bg-yellow-50', label: 'Pending' };
      case 'ready-to-ship': return { icon: <Package className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50', label: 'Ready To Ship' };
      case 'ready-for-pickup': return { icon: <Package className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50', label: 'Ready For Pickup' };
      case 'in-transit': return { icon: <Truck className="w-4 h-4" />, color: 'text-orange-600 bg-orange-50', label: 'In-Transit' };
      case 'delivered': return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-50', label: 'Delivered' };
      case 'out-for-delivery': return { icon: <Truck className="w-4 h-4" />, color: 'text-cyan-600 bg-cyan-50', label: 'Out for Delivery' };
      case 'ndr': return { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600 bg-red-50', label: 'NDR' };
      case 'rto-in-transit': return { icon: <Truck className="w-4 h-4" />, color: 'text-red-600 bg-red-50', label: 'RTO - In Transit' };
      case 'rto-delivered': return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-indigo-600 bg-indigo-50', label: 'RTO Delivered' };
      default: return { icon: <Package className="w-4 h-4" />, color: 'text-gray-600 bg-gray-50', label: 'Unknown' };
    }
  };

  const getTableColumns = () => {
    switch (currentStatus) {
      case 'pending':
        return [
          { key: 'orderId', label: 'ORDER ID', sortable: true },
          { key: 'pickupAndDelivery', label: 'PICKUP AND DELIVERY ADDRESS', sortable: false },
          { key: 'productDetails', label: 'PRODUCT DETAILS', sortable: false },
          { key: 'packagingDetails', label: 'PACKAGING DETAILS', sortable: false },
          { key: 'deliveryDetails', label: 'DELIVERY DETAILS', sortable: false },
          { key: 'actions', label: '', sortable: false }
        ];
      case 'ready-to-ship':
        return [
          { key: 'orderId', label: 'ORDER ID AND AWB', sortable: true },
          { key: 'manifestedDate', label: 'MANIFESTED DATE', sortable: true },
          { key: 'pickupAndDelivery', label: 'PICKUP AND DELIVERY ADDRESS', sortable: false },
          { key: 'transportMode', label: 'TRANSPORT MODE AND ZONE', sortable: true },
          { key: 'paymentMode', label: 'PAYMENT MODE', sortable: true },
          { key: 'actions', label: '', sortable: false }
        ];
      case 'ready-for-pickup':
        return [
          { key: 'orderId', label: 'ORDER ID AND AWB', sortable: true },
          { key: 'manifestedDate', label: 'MANIFESTED DATE', sortable: true },
          { key: 'pickupAndDelivery', label: 'PICKUP AND DELIVERY ADDRESS', sortable: false },
          { key: 'transportMode', label: 'TRANSPORT MODE AND ZONE', sortable: false },
          { key: 'paymentMode', label: 'PAYMENT MODE', sortable: false },
          { key: 'actions', label: '', sortable: false }
        ];
      case 'in-transit':
        return [
          { key: 'orderId', label: 'ORDER ID AND AWB', sortable: true },
          { key: 'pickupAndDelivery', label: 'PICKUP AND DELIVERY ADDRESS', sortable: false },
          { key: 'status', label: 'STATUS', sortable: true },
          { key: 'promisedDelivery', label: 'PROMISED DELIVERY DATE', sortable: true },
          { key: 'estimatedDelivery', label: 'ESTIMATED DELIVERY', sortable: true },
          { key: 'lastUpdate', label: 'LAST UPDATE', sortable: true },
          { key: 'transportMode', label: 'TRANSPORT MODE AND ZONE', sortable: false },
          { key: 'paymentMode', label: 'PAYMENT MODE', sortable: false },
          { key: 'actions', label: '', sortable: false }
        ];
      case 'delivered':
        return [
          { key: 'orderId', label: 'ORDER ID AND AWB', sortable: true },
          { key: 'deliveredOn', label: 'DELIVERED ON', sortable: true },
          { key: 'pickupAndDelivery', label: 'PICKUP AND DELIVERY ADDRESS', sortable: false },
          { key: 'transportMode', label: 'TRANSPORT MODE AND ZONE', sortable: false },
          { key: 'paymentMode', label: 'PAYMENT MODE', sortable: false },
          { key: 'deliveredWeight', label: 'DELIVERED WEIGHT', sortable: false },
          { key: 'actions', label: '', sortable: false }
        ];
      case 'rto-in-transit':
        return [
          { key: 'orderId', label: 'ORDER ID AND AWB', sortable: true },
          { key: 'returnedOn', label: 'RETURNED ON', sortable: true },
          { key: 'state', label: 'STATE', sortable: true },
          { key: 'pickupAndDelivery', label: 'PICKUP AND DELIVERY ADDRESS', sortable: false },
          { key: 'transportMode', label: 'TRANSPORT MODE AND ZONE', sortable: false },
          { key: 'paymentMode', label: 'PAYMENT MODE', sortable: false },
          { key: 'actions', label: '', sortable: false }
        ];
      default:
        return [
          { key: 'orderId', label: 'ORDER ID & AWB', sortable: true },
          { key: 'manifestedDate', label: 'MANIFESTED DATE', sortable: true },
          { key: 'status', label: 'STATUS', sortable: true },
          { key: 'pickupAndDelivery', label: 'PICKUP AND DELIVERY ADDRESS', sortable: false },
          { key: 'transportMode', label: 'TRANSPORT MODE & ZONE', sortable: true },
          { key: 'paymentMode', label: 'PAYMENT MODE', sortable: true },
          { key: 'actions', label: 'ACTIONS', sortable: false }
        ];
    }
  };

  const columns = getTableColumns();

  type SortKey = 'orderId' | 'returnedOn' | 'state' | 'pickup' | 'transport' | 'payment';
  const [sortKey, setSortKey] = useState<SortKey>('orderId');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback((key: SortKey) => {
    setSortKey(prev => (prev === key ? key : key));
    setSortDir(prev => (sortKey === key ? (prev === 'asc' ? 'desc' : 'asc') : 'asc'));
  }, [sortKey]);

  const sortedOrders = useMemo(() => {
    const list = [...orders];
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'orderId':
          return a.id.localeCompare(b.id) * dir;
        case 'returnedOn':
          return (a.returnedOn || '').localeCompare(b.returnedOn || '') * dir;
        case 'state':
          return (a.status || '').localeCompare(b.status || '') * dir;
        case 'pickup':
          return (a.pickupAddress || '').localeCompare(b.pickupAddress || '') * dir;
        case 'transport':
          return ((a.transportMode || '') + (a.zone || '')).localeCompare(((b.transportMode || '') + (b.zone || ''))) * dir;
        case 'payment':
          return (a.paymentMode || '').localeCompare(b.paymentMode || '') * dir;
      }
    });
    return list;
  }, [orders, sortKey, sortDir]);

  const renderOrderIdCell = (order: Order) => (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
        <span className="text-xs font-medium text-blue-600">
          {order.id.includes('/') ? order.id.split('/')[0].slice(0, 2) : order.id.slice(0, 2)}
        </span>
      </div>
      <div>
        <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
          {order.id}
        </div>
        {order.awbNumber && (
          <div className="text-xs text-gray-500">{order.awbNumber}</div>
        )}
      </div>
    </div>
  );

  const renderPickupDeliveryCell = (order: Order) => (
    <div className="text-sm space-y-2">
      <div className="flex items-start space-x-2">
        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
        <div className="min-w-0 flex-1">
          <div className="text-gray-900 truncate">{order.pickupAddress}</div>
          {order.pickupContact && (
            <div className="text-xs text-gray-500">{order.pickupContact}</div>
          )}
        </div>
      </div>
      {order.deliveryAddress && (
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
          <div className="min-w-0 flex-1">
            <div className="text-gray-900 truncate">{order.deliveryAddress}</div>
            {order.deliveryContact && (
              <div className="text-xs text-gray-500">{order.deliveryContact}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderActionsCell = (order: Order) => {
    if (currentStatus === 'pending') {
      return (
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => onGenerateAwb(order.id)}
            disabled={generatingAwbId === order.id}
            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            {generatingAwbId === order.id ? 'Getting...' : 'Get AWB'}
          </button>
        </div>
      );
    }

    if (currentStatus === 'ready-to-ship') {
      return (
        <div className="flex items-center space-x-1">
          <button className="px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
            Print Label
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
          <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
            Add to Pickup
          </button>
        </div>
      );
    }

    if (currentStatus === 'ready-for-pickup') {
      return (
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
          <button className="px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
            Print Label
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <button className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800">
          Clone Order
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
        {currentStatus === 'delivered' && (
          <button className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800">
            Initiate Return
          </button>
        )}
        {currentStatus === 'in-transit' && (
          <button className="px-2 py-1 text-xs text-red-600 hover:text-red-800">
            Cancel Shipment
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={column.sortable ? () => onSort(column.key as SortKey) : undefined}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Package className="h-12 w-12 text-gray-300 mb-2" />
                    <span>No orders found</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedOrders.map((order) => {
                const statusDetails = getStatusDetails(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => onSelectOrder(order.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>

                    {/* Order ID Cell */}
                    <td className="px-4 py-4">{renderOrderIdCell(order)}</td>

                    {/* Dynamic columns based on status */}
                    {currentStatus === 'pending' && (
                      <>
                        <td className="px-4 py-4 max-w-xs">{renderPickupDeliveryCell(order)}</td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.productDetails}</div>
                          <div className="text-xs text-gray-500">₹ {order.productPrice} | {order.paymentMode}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">Pkg Wt. {order.weight}</div>
                          <div className="text-xs text-gray-500">
                            Vol Wt. {order.dimensions ? `${order.dimensions.length} x ${order.dimensions.breadth} x ${order.dimensions.height} cm` : 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-900">{order.transportMode || 'Surface'}</div>
                              <div className="text-xs text-gray-500">{order.zone}</div>
                            </div>
                          </div>
                        </td>
                      </>
                    )}

                    {(currentStatus === 'ready-to-ship' || currentStatus === 'ready-for-pickup') && (
                      <>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.date}, {new Date().getFullYear()}</div>
                          <div className="text-xs text-gray-500">{order.time}</div>
                        </td>
                        <td className="px-4 py-4 max-w-xs">{renderPickupDeliveryCell(order)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-900">{order.transportMode || 'Surface'}</div>
                              <div className="text-xs text-gray-500">{order.zone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.paymentMode}</div>
                        </td>
                      </>
                    )}

                    {currentStatus === 'in-transit' && (
                      <>
                        <td className="px-4 py-4 max-w-xs">{renderPickupDeliveryCell(order)}</td>
                        <td className="px-4 py-4">
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${statusDetails.color}`}>
                            {statusDetails.icon}
                            <span>{statusDetails.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.date}, {new Date().getFullYear()}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.date}, {new Date().getFullYear()}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.date}, Today</div>
                          <div className="text-xs text-gray-500">Shipment picked up at {order.pickupAddress?.split(' ')[0]}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-900">{order.transportMode || 'Surface'}</div>
                              <div className="text-xs text-gray-500">{order.zone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.paymentMode}</div>
                        </td>
                      </>
                    )}

                    {currentStatus === 'delivered' && (
                      <>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.date}, Today</div>
                        </td>
                        <td className="px-4 py-4 max-w-xs">{renderPickupDeliveryCell(order)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-900">{order.transportMode || 'Surface'}</div>
                              <div className="text-xs text-gray-500">{order.zone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.paymentMode}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.weight}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            <FileText className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-blue-600">Print POD</span>
                          </div>
                        </td>
                      </>
                    )}

                    {currentStatus === 'rto-in-transit' && (
                      <>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.date}, Today</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${statusDetails.color}`}>
                            <span>{statusDetails.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 max-w-xs">{renderPickupDeliveryCell(order)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-900">{order.transportMode || 'Surface'}</div>
                              <div className="text-xs text-gray-500">{order.zone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.paymentMode}</div>
                        </td>
                      </>
                    )}

                    {(currentStatus === 'all-shipments' || !['pending', 'ready-to-ship', 'ready-for-pickup', 'in-transit', 'delivered', 'rto-in-transit'].includes(currentStatus)) && (
                      <>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.date}, {new Date().getFullYear()}</div>
                          <div className="text-xs text-gray-500">{order.time}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${statusDetails.color}`}>
                            {statusDetails.icon}
                            <span>{statusDetails.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 max-w-xs">{renderPickupDeliveryCell(order)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-900">{order.transportMode || 'Surface'}</div>
                              <div className="text-xs text-gray-500">{order.zone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{order.paymentMode}</div>
                        </td>
                      </>
                    )}

                    {/* Actions column */}
                    <td className="px-4 py-4">{renderActionsCell(order)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
