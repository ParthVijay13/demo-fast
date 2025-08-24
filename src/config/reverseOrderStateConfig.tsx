import React from 'react';
import { 
  Clock, Package, Truck, CheckCircle, AlertCircle, MapPin, 
  MoreHorizontal, Copy, FileText, Printer, X, Plus, User, Calendar
} from 'lucide-react';

export type ReverseOrderState =
  | 'pending'
  | 'ready_for_pickup'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'all_shipments';

export type ReverseColumnConfig = {
  id: string;                
  header: string;            
  accessor: (row: any) => React.ReactNode; 
  sortable?: boolean;
  minWidth?: number;
  hideOn?: Array<'sm'|'md'>; 
};

export type ReverseFilterConfig =
  | { id: 'search'; placeholder: string; scope: 'awbs'|'orders'; max?: number }
  | { id: 'date' ; label: string; kind: 'single'|'range'; param: string }
  | { id: 'select'; label: string; param: string; optionsSource: 'returnLocations'|'transportModes'|'paymentModes'|'zones'|'shipmentStatuses'|'more'|'customerLocations'|'paymentStatuses'; multi?: boolean };

export type ReverseStateConfig = {
  columns: ReverseColumnConfig[];
  filters: ReverseFilterConfig[];
  rowActions?: Array<'printLabel'|'printPOD'|'cloneOrder'|'addToPickup'|'cancelShipment'|'initiateReturn'|'getAwb'|'trackShipment'|'contactCustomer'>;
  defaultSort?: { columnId: string; direction: 'asc'|'desc' };
};

// Helper functions for rendering reverse order cells
export const renderReverseOrderIdCell = (order: any): React.ReactNode => {
  return React.createElement('div', { className: "flex items-center space-x-3" },
    React.createElement('div', { className: "w-8 h-8 bg-red-100 rounded flex items-center justify-center" },
      React.createElement('span', { className: "text-xs font-medium text-red-600" },
        order.id.includes('/') ? order.id.split('/')[0].slice(0, 2) : order.id.slice(0, 2)
      )
    ),
    React.createElement('div', null,
      React.createElement('div', { className: "text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer" },
        order.id
      ),
      order.awbNumber && React.createElement('div', { className: "text-xs text-gray-500" }, order.awbNumber)
    )
  );
};

export const renderAwbOrderIdCell = (order: any): React.ReactNode => {
  return React.createElement('div', { className: "space-y-1" },
    React.createElement('div', { className: "flex items-center space-x-2" },
      React.createElement('div', { className: "w-6 h-6 bg-blue-100 rounded flex items-center justify-center" },
        React.createElement(Package, { className: "w-3 h-3 text-blue-600" })
      ),
      React.createElement('div', { className: "text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer" },
        order.id
      )
    ),
    order.awbNumber && React.createElement('div', { className: "text-xs text-gray-500 font-mono" }, 
      order.awbNumber
    )
  );
};

export const renderPackageDetailsCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900 font-medium">{order.packageType || 'Standard Package'}</div>
    <div className="text-xs text-gray-500">
      Weight: {order.weight || '1.2 kg'} | Dims: {order.dimensions || '25x20x15 cm'}
    </div>
    <div className="text-xs text-gray-500">
      Value: ₹{order.declaredValue || order.productPrice || '550.00'}
    </div>
  </div>
);

export const renderPickupReturnAddressCell = (order: any): React.ReactNode => (
  <div className="text-sm space-y-2">
    <div className="flex items-start space-x-2">
      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
      <div className="min-w-0 flex-1">
        <div className="text-gray-900 truncate font-medium">{order.pickupAddress}</div>
        {order.pickupContact && (
          <div className="text-xs text-gray-500">{order.pickupContact}</div>
        )}
      </div>
    </div>
    {order.returnAddress && (
      <div className="flex items-start space-x-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
        <div className="min-w-0 flex-1">
          <div className="text-gray-900 truncate">{order.returnAddress}</div>
          {order.returnContact && (
            <div className="text-xs text-gray-500">{order.returnContact}</div>
          )}
        </div>
      </div>
    )}
  </div>
);

export const renderOrderDateCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">{order.orderDate || order.date}, 2025</div>
    <div className="text-xs text-gray-500">{order.orderTime || order.time || '10:30 AM'}</div>
  </div>
);

export const renderManifestedOnCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">{order.manifestedDate || order.date}, 2025</div>
    <div className="text-xs text-gray-500">{order.manifestedTime || order.time || '11:39 PM'}</div>
  </div>
);

export const renderInitiatedOnCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">{order.initiatedDate || order.date}, 2025</div>
    <div className="text-xs text-gray-500">{order.initiatedTime || order.time || '11:35 PM'}</div>
  </div>
);

export const renderNoOfItemsCell = (order: any): React.ReactNode => (
  <div className="text-center">
    <div className="text-sm font-medium text-gray-900">{order.itemCount || order.noOfItems || 1}</div>
    <div className="text-xs text-gray-500">items</div>
  </div>
);

export const renderLastUpdateCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">{order.lastUpdateDate || '16 Aug, 2025'}</div>
    <div className="text-xs text-gray-500 truncate">
      {order.lastUpdateStatus || 'Vehicle Departed at Bangalore_Hoskote_GW (Karnataka)'}
    </div>
  </div>
);

export const renderDeliveryAttemptsCell = (order: any): React.ReactNode => (
  <div className="text-center">
    <div className="text-sm font-medium text-gray-900">{order.deliveryAttempts || 0}</div>
    <div className="text-xs text-gray-500">attempts</div>
    {order.deliveryAttempts > 0 && (
      <div className="text-xs text-orange-600 mt-1">Last: {order.lastAttemptDate || 'Today'}</div>
    )}
  </div>
);

export const renderDeliveredDateCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">{order.deliveredDate || order.date}, 2025</div>
    <div className="text-xs text-gray-500">{order.deliveredTime || '2:45 PM'}</div>
  </div>
);

export const renderCustomerDetailsCell = (order: any): React.ReactNode => (
  <div className="flex items-center space-x-3">
    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
      <User className="w-4 h-4 text-green-600" />
    </div>
    <div>
      <div className="text-sm font-medium text-gray-900">{order.customerName || 'Customer'}</div>
      <div className="text-xs text-gray-500">{order.customerPhone || order.pickupContact}</div>
    </div>
  </div>
);

export const renderDeliveryConfirmationCell = (order: any): React.ReactNode => (
  <div>
    <div className="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
      <CheckCircle className="w-3 h-3" />
      <span>{order.deliveryConfirmation || 'Confirmed'}</span>
    </div>
    {order.deliveredBy && (
      <div className="text-xs text-gray-500 mt-1">By: {order.deliveredBy}</div>
    )}
  </div>
);

export const renderPaymentStatusCell = (order: any): React.ReactNode => {
  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const status = order.paymentStatus || 'Pending';
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(status)}`}>
      {status}
    </div>
  );
};

export const renderCancelledDateCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">{order.cancelledDate || order.date}, 2025</div>
    <div className="text-xs text-red-500">{order.cancellationReason || 'Customer request'}</div>
  </div>
);

export const renderReversePaymentModeCell = (order: any): React.ReactNode => (
  <div className="text-sm text-gray-900">{order.paymentMode || 'Pickup'}</div>
);

export const renderTransportModeCell = (order: any): React.ReactNode => (
  <div className="flex items-center space-x-2">
    <Truck className="w-4 h-4 text-blue-500" />
    <div className="text-sm text-gray-900">{order.transportMode || 'Surface'}</div>
  </div>
);

export const renderOrderPriceCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm font-medium text-gray-900">₹{order.orderPrice || order.productPrice || '550.00'}</div>
    <div className="text-xs text-gray-500">{order.paymentMode || 'COD'}</div>
  </div>
);

export const REVERSE_ORDER_STATE_CONFIG: Record<ReverseOrderState, ReverseStateConfig> = {
  pending: {
    columns: [
      {
        id: 'orderId',
        header: 'ORDER ID',
        accessor: renderReverseOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'orderDate',
        header: 'ORDER DATE',
        accessor: renderOrderDateCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'packageDetails',
        header: 'PACKAGE DETAILS',
        accessor: renderPackageDetailsCell,
        sortable: false,
        minWidth: 200,
        hideOn: ['sm']
      },
      {
        id: 'addresses',
        header: 'PICKUP AND DELIVERY ADDRESS',
        accessor: renderPickupReturnAddressCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'transportMode',
        header: 'TRANSPORT MODE',
        accessor: renderTransportModeCell,
        sortable: false,
        minWidth: 150,
        hideOn: ['sm']
      },
      {
        id: 'orderPrice',
        header: 'ORDER PRICE',
        accessor: renderOrderPriceCell,
        sortable: true,
        minWidth: 120
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search up to 100 Orders', scope: 'orders', max: 100 },
      { id: 'date', label: 'Date Range', kind: 'range', param: 'date_range' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'More Filters', param: 'more', optionsSource: 'more' }
    ],
    rowActions: ['getAwb'],
    defaultSort: { columnId: 'orderDate', direction: 'desc' }
  },

  ready_for_pickup: {
    columns: [
      {
        id: 'awbOrderId',
        header: 'AWB AND ORDER ID',
        accessor: renderAwbOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'manifestedOn',
        header: 'MANIFESTED ON',
        accessor: renderManifestedOnCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'addresses',
        header: 'PICKUP AND RETURN ADDRESS',
        accessor: renderPickupReturnAddressCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderReversePaymentModeCell,
        sortable: false,
        minWidth: 120
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search up to 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Manifested Date', kind: 'range', param: 'manifested_date' },
      { id: 'select', label: 'Return Location', param: 'return_location', optionsSource: 'returnLocations' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' }
    ],
    rowActions: ['printLabel', 'addToPickup'],
    defaultSort: { columnId: 'manifestedOn', direction: 'desc' }
  },

  in_transit: {
    columns: [
      {
        id: 'awbOrderId',
        header: 'AWB AND ORDER ID',
        accessor: renderAwbOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'initiatedOn',
        header: 'INITIATED ON',
        accessor: renderInitiatedOnCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'noOfItems',
        header: 'NO OF ITEMS',
        accessor: renderNoOfItemsCell,
        sortable: true,
        minWidth: 100,
        hideOn: ['sm']
      },
      {
        id: 'addresses',
        header: 'PICKUP AND RETURN ADDRESS',
        accessor: renderPickupReturnAddressCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'lastUpdate',
        header: 'LAST UPDATE',
        accessor: renderLastUpdateCell,
        sortable: true,
        minWidth: 200,
        hideOn: ['md']
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderReversePaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search up to 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Initiated Date', kind: 'range', param: 'initiated_date' },
      { id: 'select', label: 'Return Location', param: 'return_location', optionsSource: 'returnLocations' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' }
    ],
    rowActions: ['trackShipment', 'cloneOrder'],
    defaultSort: { columnId: 'lastUpdate', direction: 'desc' }
  },

  out_for_delivery: {
    columns: [
      {
        id: 'awbOrderId',
        header: 'AWB AND ORDER ID',
        accessor: renderAwbOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'initiatedOn',
        header: 'INITIATED ON',
        accessor: renderInitiatedOnCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'noOfItems',
        header: 'NO OF ITEMS',
        accessor: renderNoOfItemsCell,
        sortable: true,
        minWidth: 100,
        hideOn: ['sm']
      },
      {
        id: 'addresses',
        header: 'PICKUP AND RETURN ADDRESS',
        accessor: renderPickupReturnAddressCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'deliveryAttempts',
        header: 'DELIVERY ATTEMPTS',
        accessor: renderDeliveryAttemptsCell,
        sortable: true,
        minWidth: 150,
        hideOn: ['sm']
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderReversePaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search up to 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Initiated Date', kind: 'range', param: 'initiated_date' },
      { id: 'select', label: 'Return Location', param: 'return_location', optionsSource: 'returnLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' }
    ],
    rowActions: ['trackShipment', 'contactCustomer'],
    defaultSort: { columnId: 'deliveryAttempts', direction: 'desc' }
  },

  delivered: {
    columns: [
      {
        id: 'awbOrderId',
        header: 'AWB AND ORDER ID',
        accessor: renderAwbOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'deliveredDate',
        header: 'DELIVERED DATE',
        accessor: renderDeliveredDateCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'customerDetails',
        header: 'CUSTOMER DETAILS',
        accessor: renderCustomerDetailsCell,
        sortable: false,
        minWidth: 180,
        hideOn: ['sm']
      },
      {
        id: 'deliveryConfirmation',
        header: 'DELIVERY CONFIRMATION',
        accessor: renderDeliveryConfirmationCell,
        sortable: false,
        minWidth: 180,
        hideOn: ['sm']
      },
      {
        id: 'paymentStatus',
        header: 'PAYMENT STATUS',
        accessor: renderPaymentStatusCell,
        sortable: true,
        minWidth: 130
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search up to 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Delivery Date', kind: 'range', param: 'delivery_date' },
      { id: 'select', label: 'Customer Location', param: 'customer_location', optionsSource: 'customerLocations' },
      { id: 'select', label: 'Payment Status', param: 'payment_status', optionsSource: 'paymentStatuses' }
    ],
    rowActions: ['printPOD', 'cloneOrder'],
    defaultSort: { columnId: 'deliveredDate', direction: 'desc' }
  },

  cancelled: {
    columns: [
      {
        id: 'awbOrderId',
        header: 'AWB AND ORDER ID',
        accessor: renderAwbOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'lastUpdate',
        header: 'LAST UPDATE',
        accessor: renderLastUpdateCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'addresses',
        header: 'PICKUP AND RETURN ADDRESS',
        accessor: renderPickupReturnAddressCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'cancelledDate',
        header: 'CANCELLED DATE',
        accessor: renderCancelledDateCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderReversePaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search up to 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Cancelled Date', kind: 'range', param: 'cancelled_date' },
      { id: 'select', label: 'Return Location', param: 'return_location', optionsSource: 'returnLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' }
    ],
    rowActions: ['cloneOrder'],
    defaultSort: { columnId: 'cancelledDate', direction: 'desc' }
  },

  all_shipments: {
    columns: [
      {
        id: 'awbOrderId',
        header: 'AWB AND ORDER ID',
        accessor: renderAwbOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'initiatedOn',
        header: 'INITIATED ON',
        accessor: renderInitiatedOnCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'noOfItems',
        header: 'NO OF ITEMS',
        accessor: renderNoOfItemsCell,
        sortable: true,
        minWidth: 100,
        hideOn: ['sm']
      },
      {
        id: 'addresses',
        header: 'PICKUP AND RETURN ADDRESS',
        accessor: renderPickupReturnAddressCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'transportMode',
        header: 'TRANSPORT MODE AND ZONE',
        accessor: (order) => renderTransportModeCell(order),
        sortable: false,
        minWidth: 180,
        hideOn: ['sm']
      },
      {
        id: 'lastUpdate',
        header: 'LAST UPDATE',
        accessor: renderLastUpdateCell,
        sortable: true,
        minWidth: 200,
        hideOn: ['md']
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderReversePaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search up to 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Initiated Date', kind: 'range', param: 'initiated_date' },
      { id: 'select', label: 'Shipment Status', param: 'shipment_status', optionsSource: 'shipmentStatuses' },
      { id: 'select', label: 'Return Location', param: 'return_location', optionsSource: 'returnLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' }
    ],
    rowActions: ['trackShipment', 'cloneOrder'],
    defaultSort: { columnId: 'initiatedOn', direction: 'desc' }
  }
};
