import { apiClient } from './client';
import type {
  ReverseOrdersListRequest,
  ReverseOrdersListResponse,
  ReverseOrder,
  ReverseOrderStatus,
  ReverseOrderStatusCounts
} from '@/types/orders';

// When backend is unreachable, we keep a tiny fallback list to avoid UI crashes
const FALLBACK_REVERSE_ORDERS: ReverseOrder[] = [];

function computeReverseOrderStatusCounts(orders: ReverseOrder[]): ReverseOrderStatusCounts {
  const counts: ReverseOrderStatusCounts = {
    'all-shipments': orders.length,
    'pending': 0,
    'ready-for-pickup': 0,
    'in-transit': 0,
    'delivered': 0,
    'cancelled': 0
  };

  orders.forEach(order => {
    counts[order.status] += 1;
  });

  return counts;
}

// Map frontend reverse status to backend status
const toBackendStatus = (status: ReverseOrderStatus | 'all-shipments' | undefined): string | undefined => {
  if (!status || status === 'all-shipments') return undefined;
  const map: Record<ReverseOrderStatus, string> = {
    'pending': 'PENDING',
    'ready-for-pickup': 'READY_FOR_PICKUP',
    'in-transit': 'IN_TRANSIT',
    'delivered': 'DELIVERED',
    'cancelled': 'CANCELLED'
  };
  return map[status];
};

// Transform backend order into ReverseOrder used by UI
const transformBackendToReverse = (backendOrder: any): ReverseOrder => {
  const createdDate = new Date(backendOrder.created_at);
  const statusMap: Record<string, ReverseOrderStatus> = {
    'PENDING': 'pending',
    'READY_FOR_PICKUP': 'ready-for-pickup',
    'IN_TRANSIT': 'in-transit',
    'DELIVERED': 'delivered',
    'CANCELLED': 'cancelled'
  };
  return {
    id: backendOrder.id,
    date: createdDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    time: createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    pickupAddress: `${backendOrder.pickup_address?.pickup_address || ''}${backendOrder.pickup_address?.pickup_city ? ', ' + backendOrder.pickup_address.pickup_city : ''}${backendOrder.pickup_address?.pickup_state ? ', ' + backendOrder.pickup_address.pickup_state : ''}`,
    productDetails: Array.isArray(backendOrder.order_items) ? backendOrder.order_items.map((i: any) => i.item_name).join(', ') : '',
    weight: backendOrder.package_weight ? `${backendOrder.package_weight} kg` : '0 kg',
    status: statusMap[backendOrder.status] || 'pending',
    zone: 'Surface',
    returnReason: backendOrder.reason_for_return || '',
    originalOrderId: backendOrder.original_order_id || backendOrder.order_id || '',
    returnLocation: backendOrder.pickup_address?.warehouse_name || '',
    fragilePackage: false
  };
};

// Reverse Orders API surface (calls backend getOrders)
export const ReverseOrdersApi = {
  listReverseOrders: async (params: ReverseOrdersListRequest): Promise<ReverseOrdersListResponse> => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', String(params.page));
      if (params.pageSize) query.append('offset', String(params.pageSize));
      if (params.search) query.append('query', params.search);
      const backendStatus = toBackendStatus(params.status);
      if (backendStatus) query.append('status', backendStatus);
      // Ensure we fetch only reverse orders
      query.append('order_type', 'REVERSE');

      const response = await apiClient.get<any>(`/order?${query.toString()}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch reverse orders');
      }

      const orders = Array.isArray(response.data?.orders)
        ? response.data.orders.map(transformBackendToReverse)
        : [];

      return {
        orders,
        pagination: {
          page: response.data?.metadata?.current_page || params.page || 1,
          pageSize: response.data?.metadata?.items_per_page || params.pageSize || 25,
          total: response.data?.metadata?.total_items || orders.length
        },
        statusCounts: computeReverseOrderStatusCounts(orders)
      };
    } catch (err) {
      // Fallback to empty list to avoid UI breakage
      return {
        orders: FALLBACK_REVERSE_ORDERS,
        pagination: { page: params.page || 1, pageSize: params.pageSize || 25, total: FALLBACK_REVERSE_ORDERS.length },
        statusCounts: computeReverseOrderStatusCounts(FALLBACK_REVERSE_ORDERS)
      };
    }
  },

  getReverseOrderById: async (_orderId: string): Promise<ReverseOrder> => {
    throw new Error('Not implemented');
  },

  createReverseOrder: async (_order: Omit<ReverseOrder, 'id'>): Promise<ReverseOrder> => {
    throw new Error('Not implemented');
  },

  updateReverseOrder: async (_orderId: string, _updates: Partial<ReverseOrder>): Promise<void> => {
    // No-op for now
  },

  deleteReverseOrder: async (_orderId: string): Promise<void> => {
    // No-op for now
  }
};

export type ReverseOrdersApiType = typeof ReverseOrdersApi;
