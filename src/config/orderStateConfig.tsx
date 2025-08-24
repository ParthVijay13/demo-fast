import React from 'react';
import { 
  Clock, Package, Truck, CheckCircle, AlertCircle, MapPin, 
  MoreHorizontal, Copy, FileText, Printer, X, Plus
} from 'lucide-react';

export type OrderState =
  | 'pending'
  | 'ready_to_ship'
  | 'ready_for_pickup'
  | 'in_transit'
  | 'rto_in_transit'
  | 'delivered'
  | 'all_shipments';

export type ColumnConfig = {
  id: string;                // stable key
  header: string;            // column title
  accessor: (row: any) => React.ReactNode; // how to render cell
  sortable?: boolean;
  minWidth?: number;
  hideOn?: Array<'sm'|'md'>; // responsive rules
};

export type FilterConfig =
  | { id: 'search'; placeholder: string; scope: 'awbs'|'orders'; max?: number }
  | { id: 'date' ; label: string; kind: 'single'|'range'; param: string }
  | { id: 'select'; label: string; param: string; optionsSource: 'pickupLocations'|'transportModes'|'paymentModes'|'zones'|'shipmentStatuses'|'more'; multi?: boolean };

export type StateConfig = {
  columns: ColumnConfig[];
  filters: FilterConfig[];
  rowActions?: Array<'printLabel'|'printPOD'|'cloneOrder'|'addToPickup'|'cancelShipment'|'initiateReturn'|'getAwb'>;
  defaultSort?: { columnId: string; direction: 'asc'|'desc' };
};

// Helper functions for rendering common cells
export const renderOrderIdCell = (order: any): React.ReactNode => {
  return React.createElement('div', { className: "flex items-center space-x-3" },
    React.createElement('div', { className: "w-8 h-8 bg-blue-100 rounded flex items-center justify-center" },
      React.createElement('span', { className: "text-xs font-medium text-blue-600" },
        order.id.includes('/') ? order.id.split('/')[0].slice(0, 2) : order.id.slice(0, 2)
      )
    ),
    React.createElement('div', null,
      React.createElement('div', { className: "text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer" },
        order.id
      ),
      order.awbNumber && React.createElement('div', { className: "text-xs text-gray-500" }, order.awbNumber)
    )
  );
};

export const renderOrderIdWithRiskCell = (order: any): React.ReactNode => {
  return React.createElement('div', { className: "space-y-2" },
    React.createElement('div', { className: "flex items-center space-x-3" },
      React.createElement('div', { className: "w-8 h-8 bg-blue-100 rounded flex items-center justify-center" },
        React.createElement('span', { className: "text-xs font-medium text-blue-600" },
          order.id.includes('/') ? order.id.split('/')[0].slice(0, 2) : order.id.slice(0, 2)
        )
      ),
      React.createElement('div', null,
        React.createElement('div', { className: "text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer" },
          order.id
        ),
        order.awbNumber && React.createElement('div', { className: "text-xs text-gray-500" }, order.awbNumber)
      )
    ),
    // Risk of Return chip
    order.riskOfReturn && React.createElement('div', { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800" },
      React.createElement(AlertCircle, { className: "w-3 h-3 mr-1" }),
      "Risk of Return"
    )
  );
};

export const renderAddressesCell = (order: any): React.ReactNode => (
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

export const renderProductDetailsCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">{order.productDetails}</div>
    <div className="text-xs text-gray-500">₹ {order.productPrice || '550.00'} | {order.paymentMode || 'Prepaid'}</div>
  </div>
);

export const renderPackagingDetailsCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">Pkg Wt. {order.weight}</div>
    <div className="text-xs text-gray-500">
      Vol Wt. {order.dimensions ? `${order.dimensions.length} x ${order.dimensions.breadth} x ${order.dimensions.height} cm` : '20 x 10 x 4 cm'}
    </div>
  </div>
);

export const renderDeliveryDetailsCell = (order: any): React.ReactNode => (
  <div className="flex items-center space-x-2">
    <Truck className="w-4 h-4 text-blue-500" />
    <div>
      <div className="text-sm text-gray-900">{order.transportMode || 'Surface'}</div>
      <div className="text-xs text-gray-500">{order.zone}</div>
    </div>
  </div>
);

export const renderManifestDateCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">{order.date}, 2025</div>
    <div className="text-xs text-gray-500">{order.time || '11:52 AM'}</div>
  </div>
);

export const renderTransportZoneCell = (order: any): React.ReactNode => (
  <div className="flex items-center space-x-2">
    <div className="w-4 h-4 flex items-center justify-center">
      {order.zone?.includes('D') ? (
        <div className="w-3 h-2 bg-blue-500 rounded-sm"></div>
      ) : (
        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
      )}
    </div>
    <div>
      <div className="text-sm text-gray-900">Zone {order.zone}</div>
      <div className="text-xs text-gray-500">{order.transportMode || 'SURFACE'}</div>
    </div>
  </div>
);

export const renderPaymentModeCell = (order: any): React.ReactNode => (
  <div className="text-sm text-gray-900">{order.paymentMode || 'Cash on Delivery'}</div>
);

export const renderStatusCell = (order: any): React.ReactNode => {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'pending': return { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600 bg-yellow-50', label: 'Pending' };
      case 'ready-to-ship': return { icon: <Package className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50', label: 'Ready To Ship' };
      case 'ready-for-pickup': return { icon: <Package className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50', label: 'Ready For Pickup' };
      case 'in-transit': return { icon: <Truck className="w-4 h-4" />, color: 'text-orange-600 bg-orange-50', label: 'In-transit' };
      case 'delivered': return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-50', label: 'Delivered' };
      case 'rto-in-transit': return { icon: <Truck className="w-4 h-4" />, color: 'text-red-600 bg-red-50', label: 'RTO - In Transit' };
      default: return { icon: <Package className="w-4 h-4" />, color: 'text-gray-600 bg-gray-50', label: 'Unknown' };
    }
  };
  
  const statusDetails = getStatusDetails(order.status);
  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${statusDetails.color}`}>
      {statusDetails.icon}
      <span>{statusDetails.label}</span>
    </div>
  );
};

export const renderDateCell = (order: any, field: string): React.ReactNode => (
  <div className="text-sm text-gray-900">{order.date}, {new Date().getFullYear()}</div>
);

export const renderLastUpdateCell = (order: any): React.ReactNode => (
  <div>
    <div className="text-sm text-gray-900">16 Aug, Today</div>
    <div className="text-xs text-gray-500">Shipment picked up at {order.pickupAddress?.split(' ')[0]}_Mansrover_C (Rajasthan)</div>
  </div>
);

export const renderDeliveredWeightCell = (order: any): React.ReactNode => (
  <div className="text-sm text-gray-900">{order.weight}</div>
);

export const ORDER_STATE_CONFIG: Record<OrderState, StateConfig> = {
  pending: {
    columns: [
      {
        id: 'orderId',
        header: 'ORDER ID',
        accessor: renderOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'addresses',
        header: 'PICKUP AND DELIVERY ADDRESS',
        accessor: renderAddressesCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'productDetails',
        header: 'PRODUCT DETAILS',
        accessor: renderProductDetailsCell,
        sortable: false,
        minWidth: 200,
        hideOn: ['sm']
      },
      {
        id: 'packagingDetails',
        header: 'PACKAGING DETAILS',
        accessor: renderPackagingDetailsCell,
        sortable: false,
        minWidth: 150,
        hideOn: ['sm']
      },
      {
        id: 'deliveryDetails',
        header: 'DELIVERY DETAILS',
        accessor: renderDeliveryDetailsCell,
        sortable: false,
        minWidth: 150
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search up to 250 Orders', scope: 'orders', max: 250 },
      { id: 'date', label: 'Date Range', kind: 'range', param: 'date_range' },
      { id: 'select', label: 'Pickup Location', param: 'pickup_location', optionsSource: 'pickupLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Zone', param: 'zone', optionsSource: 'zones' },
      { id: 'select', label: 'More Filters', param: 'more', optionsSource: 'more' }
    ],
    rowActions: ['getAwb'],
    defaultSort: { columnId: 'orderId', direction: 'desc' }
  },

  ready_to_ship: {
    columns: [
      {
        id: 'orderAwb',
        header: 'ORDER ID AND AWB',
        accessor: renderOrderIdWithRiskCell, // This will render the risk chip
        sortable: true,
        minWidth: 200
      },
      {
        id: 'manifestedAt',
        header: 'MANIFESTED DATE',
        accessor: renderManifestDateCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'addresses',
        header: 'PICKUP AND DELIVERY ADDRESS',
        accessor: renderAddressesCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'transportZone',
        header: 'TRANSPORT MODE AND ZONE',
        accessor: renderTransportZoneCell,
        sortable: false,
        minWidth: 180,
        hideOn: ['sm']
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderPaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search upto 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Manifested Date', kind: 'range', param: 'manifested_date' },
      { id: 'select', label: 'Pickup Location', param: 'pickup_location', optionsSource: 'pickupLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' },
      { id: 'select', label: 'More Filters', param: 'more', optionsSource: 'more' }
    ],
    rowActions: ['printLabel', 'addToPickup'],
    defaultSort: { columnId: 'manifestedAt', direction: 'desc' }
  },

  ready_for_pickup: {
    columns: [
      {
        id: 'orderAwb',
        header: 'ORDER ID AND AWB',
        accessor: renderOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'manifestedAt',
        header: 'MANIFESTED DATE',
        accessor: renderManifestDateCell, // This accessor shows time
        sortable: true,
        minWidth: 150
      },
      {
        id: 'addresses',
        header: 'PICKUP AND DELIVERY ADDRESS',
        accessor: renderAddressesCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'transportZone',
        header: 'TRANSPORT MODE AND ZONE',
        accessor: renderTransportZoneCell,
        sortable: false,
        minWidth: 180,
        hideOn: ['sm']
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderPaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search upto 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Manifested Date', kind: 'single', param: 'manifested_date' },
      { id: 'select', label: 'Pickup Location', param: 'pickup_location', optionsSource: 'pickupLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' },
      { id: 'select', label: 'More Filters', param: 'more', optionsSource: 'more' }
    ],
    rowActions: ['printLabel'],
    defaultSort: { columnId: 'manifestedAt', direction: 'desc' }
  },

  in_transit: {
    columns: [
      {
        id: 'orderAwb',
        header: 'ORDER ID AND AWB',
        accessor: renderOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'addresses',
        header: 'PICKUP AND DELIVERY ADDRESS',
        accessor: renderAddressesCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'status',
        header: 'STATUS',
        accessor: renderStatusCell,
        sortable: true,
        minWidth: 120
      },
      {
        id: 'promisedDeliveryDate',
        header: 'PROMISED DELIVERY DATE',
        accessor: (order) => renderDateCell(order, 'promisedDeliveryDate'),
        sortable: true,
        minWidth: 150,
        hideOn: ['sm']
      },
      {
        id: 'estimatedDeliveryDate',
        header: 'ESTIMATED DELIVERY',
        accessor: (order) => renderDateCell(order, 'estimatedDeliveryDate'),
        sortable: true,
        minWidth: 150,
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
        id: 'transportZone',
        header: 'TRANSPORT MODE AND ZONE',
        accessor: renderTransportZoneCell,
        sortable: false,
        minWidth: 180,
        hideOn: ['sm']
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderPaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search upto 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'select', label: 'Shipment Status', param: 'shipment_status', optionsSource: 'shipmentStatuses' },
      { id: 'date', label: 'Estimated Delivery Date', kind: 'single', param: 'estimated_delivery_date' },
      { id: 'select', label: 'Pickup Location', param: 'pickup_location', optionsSource: 'pickupLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' }
    ],
    rowActions: ['cloneOrder', 'cancelShipment'],
    defaultSort: { columnId: 'estimatedDeliveryDate', direction: 'asc' }
  },

  rto_in_transit: {
    columns: [
      {
        id: 'orderAwb',
        header: 'ORDER ID AND AWB',
        accessor: renderOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'returnedOn',
        header: 'RETURNED ON',
        accessor: (order) => renderDateCell(order, 'returnedOn'),
        sortable: true,
        minWidth: 150
      },
      {
        id: 'state',
        header: 'STATE',
        accessor: renderStatusCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'addresses',
        header: 'PICKUP AND DELIVERY ADDRESS',
        accessor: renderAddressesCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'transportZone',
        header: 'TRANSPORT MODE AND ZONE',
        accessor: renderTransportZoneCell,
        sortable: false,
        minWidth: 180,
        hideOn: ['sm']
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderPaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search upto 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Returned Date', kind: 'single', param: 'returned_date' },
      { id: 'select', label: 'Pickup Location', param: 'pickup_location', optionsSource: 'pickupLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' }
    ],
    rowActions: ['cloneOrder'],
    defaultSort: { columnId: 'returnedOn', direction: 'desc' }
  },

  delivered: {
    columns: [
      {
        id: 'orderAwb',
        header: 'ORDER ID AND AWB',
        accessor: renderOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'deliveredOn',
        header: 'DELIVERED ON',
        accessor: (order) => renderDateCell(order, 'deliveredOn'),
        sortable: true,
        minWidth: 150
      },
      {
        id: 'addresses',
        header: 'PICKUP AND DELIVERY ADDRESS',
        accessor: renderAddressesCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'transportZone',
        header: 'TRANSPORT MODE AND ZONE',
        accessor: renderTransportZoneCell,
        sortable: false,
        minWidth: 180,
        hideOn: ['sm']
      },
      {
        id: 'paymentMode',
        header: 'PAYMENT MODE',
        accessor: renderPaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      },
      {
        id: 'deliveredWeight',
        header: 'DELIVERED WEIGHT',
        accessor: renderDeliveredWeightCell,
        sortable: false,
        minWidth: 130,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search upto 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Delivered Date', kind: 'single', param: 'delivered_date' },
      { id: 'select', label: 'Pickup Location', param: 'pickup_location', optionsSource: 'pickupLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' }
    ],
    rowActions: ['printPOD', 'cloneOrder', 'initiateReturn'],
    defaultSort: { columnId: 'deliveredOn', direction: 'desc' }
  },

  all_shipments: {
    columns: [
      {
        id: 'orderAwb',
        header: 'ORDER ID AND AWB',
        accessor: renderOrderIdCell,
        sortable: true,
        minWidth: 200
      },
      {
        id: 'manifestedAt',
        header: 'MANIFESTED DATE',
        accessor: renderManifestDateCell,
        sortable: true,
        minWidth: 150
      },
      {
        id: 'status',
        header: 'STATUS',
        accessor: renderStatusCell,
        sortable: true,
        minWidth: 120
      },
      {
        id: 'addresses',
        header: 'PICKUP AND DELIVERY ADDRESS',
        accessor: renderAddressesCell,
        sortable: false,
        minWidth: 300
      },
      {
        id: 'transportZone',
        header: 'TRANSPORT MODE AND ZONE',
        accessor: renderTransportZoneCell,
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
        accessor: renderPaymentModeCell,
        sortable: false,
        minWidth: 120,
        hideOn: ['sm']
      }
    ],
    filters: [
      { id: 'search', placeholder: 'Search upto 100 AWBs', scope: 'awbs', max: 100 },
      { id: 'date', label: 'Manifested Date', kind: 'single', param: 'manifested_date' },
      { id: 'select', label: 'Shipment Status', param: 'shipment_status', optionsSource: 'shipmentStatuses' },
      { id: 'select', label: 'Pickup Location', param: 'pickup_location', optionsSource: 'pickupLocations' },
      { id: 'select', label: 'Transport Mode', param: 'transport_mode', optionsSource: 'transportModes' },
      { id: 'select', label: 'Payment Mode', param: 'payment_mode', optionsSource: 'paymentModes' }
    ],
    rowActions: ['cloneOrder'],
    defaultSort: { columnId: 'manifestedAt', direction: 'desc' }
  }
};
