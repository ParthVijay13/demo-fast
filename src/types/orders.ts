// Centralized type definitions for Orders domain

// Legacy OrderStatus (keeping for backward compatibility)
export type OrderStatus =
  | 'pending'
  | 'ready-to-ship'
  | 'ready-for-pickup'
  | 'in-transit'
  | 'delivered'
  | 'out-for-delivery'
  | 'ndr'
  | 'rto-in-transit'
  | 'rto-delivered';

// New OrderState type for state-aware table (uses underscores for config keys)
export type OrderState =
  | 'pending'
  | 'ready_to_ship'
  | 'ready_for_pickup'
  | 'in_transit'
  | 'rto_in_transit'
  | 'delivered'
  | 'all_shipments';

// Reverse Order specific statuses
export type ReverseOrderStatus =
  | 'pending'
  | 'ready-for-pickup'
  | 'in-transit'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  date: string; // e.g., '25 Jun'
  time: string; // e.g., '10:09 PM'
  returnedOn?: string; // e.g., '13 Aug, Today'
  pickupAddress: string;
  deliveryAddress?: string;
  pickupContact?: string;
  deliveryContact?: string;
  productDetails: string;
  productPrice?: number;
  paymentMode?: 'COD' | 'Prepaid';
  weight: string; // keep string to match current UI formatting like '4.29 kg'
  packageType?: string;
  dimensions?: {
    length: number;
    breadth: number;
    height: number;
  };
  status: OrderStatus;
  zone: string;
  transportMode?: 'Surface' | 'Air';
  awbNumber?: string;
  eta?: string;
}

export type StatusCounts = Record<OrderStatus | 'all-shipments', number>;

// Reverse Order specific interfaces
export interface ReverseOrder extends Omit<Order, 'status'> {
  status: ReverseOrderStatus;
  returnReason?: string;
  qualityNotes?: string;
  originalOrderId?: string;
  returnLocation?: string;
  fragilePackage?: boolean;
}

export type ReverseOrderStatusCounts = Record<ReverseOrderStatus | 'all-shipments', number>;

export interface OrdersListRequest {
  search?: string;
  status?: OrderStatus | 'all-shipments';
  page?: number;
  pageSize?: number;
}

export interface ReverseOrdersListRequest {
  search?: string;
  status?: ReverseOrderStatus | 'all-shipments';
  page?: number;
  pageSize?: number;
}

export interface OrdersListResponse {
  orders: Order[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  statusCounts: StatusCounts;
}

export interface ReverseOrdersListResponse {
  orders: ReverseOrder[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  statusCounts: ReverseOrderStatusCounts;
}


