import { apiClient } from './client';
import type { OrdersListRequest, OrdersListResponse, Order, StatusCounts } from '@/types/orders';
import type {
  BackendApiResponse,
  BackendOrder,
  CreateForwardOrderRequest,
  CreateReverseOrderRequest,
  GetOrdersRequest,
  GetOrdersResponse,
  ManifestOrdersRequest,
  ManifestOrdersResponse,
  CreateReverseOrderOnExistingRequest,
  CreateReverseOrderOnExistingResponse,
  BulkOrderUploadResponse
} from '@/types/backend';

// Helper function to transform backend order to frontend order
const transformBackendOrderToFrontend = (backendOrder: BackendOrder): Order => {
  const createdDate = new Date(backendOrder.created_at);
  
  return {
    id: backendOrder.id,
    date: createdDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    time: createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    pickupAddress: `${backendOrder.pickup_address.pickup_address}, ${backendOrder.pickup_address.pickup_city}, ${backendOrder.pickup_address.pickup_state}`,
    deliveryAddress: `${backendOrder.consignee_address_line_1}${backendOrder.consignee_address_line_2 ? ', ' + backendOrder.consignee_address_line_2 : ''}, ${backendOrder.consignee_city}, ${backendOrder.consignee_state}`,
    pickupContact: backendOrder.pickup_address.phone,
    deliveryContact: backendOrder.consignee_phone,
    productDetails: backendOrder.order_items.map(item => item.item_name).join(', '),
    productPrice: backendOrder.order_items.reduce((sum, item) => sum + (item.price || 0), 0),
    paymentMode: backendOrder.payment_mode.toUpperCase() as 'COD' | 'Prepaid',
    weight: backendOrder.package_weight ? `${backendOrder.package_weight} kg` : '0 kg',
    dimensions: {
      length: backendOrder.package_length || 0,
      breadth: backendOrder.package_breadth || 0,
      height: backendOrder.package_height || 0,
    },
    status: transformBackendStatusToFrontend(backendOrder.status),
    zone: 'A', // Default zone, could be calculated based on pincode
    transportMode: backendOrder.shipment_mode.toUpperCase() as 'Surface' | 'Air',
    awbNumber: backendOrder.awb_number,
    eta: undefined, // Not available from backend
  };
};

// Helper function to transform backend status to frontend status
const transformBackendStatusToFrontend = (backendStatus: string): Order['status'] => {
  const statusMap: Record<string, Order['status']> = {
    'PENDING': 'pending',
    'MANIFESTED': 'ready-to-ship',
    'READY_FOR_PICKUP': 'ready-for-pickup',
    'IN_TRANSIT': 'in-transit',
    'DELIVERED': 'delivered',
    'OUT_FOR_DELIVERY': 'out-for-delivery',
    'NDR': 'ndr',
    'RTO_IN_TRANSIT': 'rto-in-transit',
    'RTO_DELIVERED': 'rto-delivered',
  };
  
  return statusMap[backendStatus] || 'pending';
};

// Helper function to calculate status counts
const calculateStatusCounts = (orders: Order[]): StatusCounts => {
  const counts: StatusCounts = {
    'all-shipments': orders.length,
    'pending': 0,
    'ready-to-ship': 0,
    'ready-for-pickup': 0,
    'in-transit': 0,
    'delivered': 0,
    'out-for-delivery': 0,
    'ndr': 0,
    'rto-in-transit': 0,
    'rto-delivered': 0,
  };

  orders.forEach(order => {
    counts[order.status]++;
  });

  return counts;
};

export const OrdersApi = {
  // List orders with pagination and filtering
  listOrders: async (params: OrdersListRequest): Promise<OrdersListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('offset', params.pageSize.toString());
    if (params.search) queryParams.append('query', params.search);
    if (params.status && params.status !== 'all-shipments') queryParams.append('status', params.status);
    // Ensure we fetch only forward orders
    queryParams.append('order_type', 'FORWARD');

    const response = await apiClient.get<BackendApiResponse<GetOrdersResponse>>(
      `/order?${queryParams.toString()}`
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch orders');
    }

    const transformedOrders = response.data.orders.map(transformBackendOrderToFrontend);
    
    return {
      orders: transformedOrders,
      pagination: {
        page: response.data.metadata.current_page,
        pageSize: response.data.metadata.items_per_page,
        total: response.data.metadata.total_items,
      },
      statusCounts: calculateStatusCounts(transformedOrders),
    };
  },

  // Get single order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<BackendApiResponse<BackendOrder>>(`/order/${orderId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch order');
    }

    return transformBackendOrderToFrontend(response.data);
  },

  // Create forward order
  createForwardOrder: async (orderData: CreateForwardOrderRequest, manifest: boolean = false): Promise<BackendOrder> => {
    const manifestParam = manifest ? '/yes' : '/no';
    const response = await apiClient.post<BackendApiResponse<BackendOrder>>(
      `/order/forward?manifest=${manifestParam}`,
      orderData
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to create order');
    }

    return response.data;
  },

  // Create reverse order
  createReverseOrder: async (orderData: CreateReverseOrderRequest): Promise<BackendOrder> => {
    const response = await apiClient.post<BackendApiResponse<BackendOrder>>(
      '/order/reverse',
      orderData
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to create reverse order');
    }

    return response.data;
  },

  // Create reverse order on existing order
  createReverseOrderOnExisting: async (orderIds: string[]): Promise<CreateReverseOrderOnExistingResponse> => {
    const response = await apiClient.post<BackendApiResponse<CreateReverseOrderOnExistingResponse>>(
      '/order/reverse/existing',
      { order_ids: orderIds }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to create reverse orders');
    }

    return response.data;
  },

  // Manifest orders
  manifestOrders: async (orderIds: string[]): Promise<ManifestOrdersResponse> => {
    const response = await apiClient.post<BackendApiResponse<ManifestOrdersResponse>>(
      '/order/manifest',
      { order_ids: orderIds }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to manifest orders');
    }

    return response.data;
  },

  // Bulk upload orders via CSV
  bulkUploadOrders: async (csvFile: File): Promise<BulkOrderUploadResponse> => {
    const formData = new FormData();
    formData.append('file', csvFile);

    const response = await apiClient.post<BackendApiResponse<BulkOrderUploadResponse>>(
      '/order/forward/bulk',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to process bulk orders');
    }

    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<void> => {
    const response = await apiClient.delete<BackendApiResponse<any>>(`/order/${orderId}/cancel`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to cancel order');
    }
  },

  // Legacy methods for backward compatibility
  generateAwb: async (orderId: string): Promise<{ awbNumber: string }> => {
    // This would be replaced with actual AWB generation if needed
    const response = await apiClient.post<BackendApiResponse<{ awb_number: string }>>(
      `/order/${orderId}/awb`
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to generate AWB');
    }

    return { awbNumber: response.data.awb_number };
  },

  // Update order (if needed)
  updateOrder: async (orderId: string, updates: Partial<CreateForwardOrderRequest>): Promise<void> => {
    const response = await apiClient.put<BackendApiResponse<any>>(`/order/${orderId}`, updates);

    if (!response.success) {
      throw new Error(response.message || 'Failed to update order');
    }
  },

  // Delete order (if needed)
  deleteOrder: async (orderId: string): Promise<void> => {
    const response = await apiClient.delete<BackendApiResponse<any>>(`/order/${orderId}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete order');
    }
  },
};

export type OrdersApiType = typeof OrdersApi;


