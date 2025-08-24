import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { OrdersApi } from '@/lib/api/orders';
import type { Order, OrderStatus, OrdersListResponse, StatusCounts } from '@/types/orders';

type PaginationState = { page: number; pageSize: number; total: number };
type FiltersState = { search: string; status: OrderStatus | 'all-shipments' };

export interface OrdersState {
  items: Order[];
  pagination: PaginationState;
  statusCounts: StatusCounts;
  filters: FiltersState;

  loading: boolean;
  error: string | null;

  generatingAwbId: string | null;
  creating: boolean;
  updatingById: string | null;
  deletingById: string | null;

  // Create order modal state
  createOrderModal: {
    isOpen: boolean;
    productSearch: string;
    selectedProducts: any[];
    paymentMode: 'Pre-Paid' | 'COD';
    packageDetails: {
      type: string;
      dimensions: { length: string; breadth: string; height: string };
      weight: string;
    };
    shippingMode: 'SURFACE' | 'EXPRESS';
    addresses: {
      pickup?: any;
      delivery?: any;
    };
  };
}

const initialCounts: StatusCounts = {
  'all-shipments': 0,
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

const initialState: OrdersState = {
  items: [],
  pagination: { page: 1, pageSize: 25, total: 0 },
  statusCounts: initialCounts,
  filters: { search: '', status: 'all-shipments' },

  loading: false,
  error: null,

  generatingAwbId: null,
  creating: false,
  updatingById: null,
  deletingById: null,

  createOrderModal: {
    isOpen: false,
    productSearch: '',
    selectedProducts: [],
    paymentMode: 'Pre-Paid',
    packageDetails: {
      type: '',
      dimensions: { length: '', breadth: '', height: '' },
      weight: ''
    },
    shippingMode: 'SURFACE',
    addresses: {}
  }
};

// Thunks
export const fetchOrders = createAsyncThunk<OrdersListResponse, void, { state: RootState }>(
  'orders/fetchOrders',
  async (_void, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination } = getState().orders;
      const res = await OrdersApi.listOrders({
        search: filters.search,
        status: filters.status,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch orders');
    }
  }
);

export const generateAwb = createAsyncThunk<{ orderId: string; awbNumber: string }, string>(
  'orders/generateAwb',
  async (orderId, { rejectWithValue }) => {
    try {
      const { awbNumber } = await OrdersApi.generateAwb(orderId);
      return { orderId, awbNumber };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to generate AWB');
    }
  }
);

export const createOrder = createAsyncThunk<Order, Omit<Order, 'id'>>(
  'orders/createOrder',
  async (order, { rejectWithValue }) => {
    try {
      // This is a legacy method - use createForwardOrder for new implementations
      // For backward compatibility, we'll simulate the old behavior
      const orderData = {
        order_id: `ORD_${Date.now()}`,
        consignee_name: order.deliveryAddress?.split(',')[0] || 'Customer',
        consignee_phone: order.deliveryContact || '0000000000',
        consignee_address_line_1: order.deliveryAddress || 'Address',
        consignee_pincode: '000000',
        consignee_city: 'City',
        consignee_state: 'State',
        consignee_country: 'India',
        payment_mode: order.paymentMode === 'COD' ? 'COD' : 'PREPAID',
        shipment_mode: order.transportMode === 'Air' ? 'EXPRESS' : 'SURFACE',
        order_items: [{
          item_name: order.productDetails || 'Product',
          sku_code: 'SKU001',
          category: 'General',
          price: order.productPrice || 0
        }],
        pickup_address_id: '1' // Default pickup address
      };
      
      const created = await OrdersApi.createForwardOrder(orderData, false);
      // Transform backend response to frontend Order type
      return {
        id: created.id,
        date: order.date,
        time: order.time,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        productDetails: order.productDetails,
        productPrice: order.productPrice,
        paymentMode: order.paymentMode,
        weight: order.weight,
        status: order.status,
        zone: order.zone,
        transportMode: order.transportMode
      } as Order;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create order');
    }
  }
);

// New thunk for creating forward orders with backend
export const createForwardOrder = createAsyncThunk<
  any, 
  { orderData: any; manifest: boolean }
>(
  'orders/createForwardOrder',
  async ({ orderData, manifest }, { rejectWithValue }) => {
    try {
      const created = await OrdersApi.createForwardOrder(orderData, manifest);
      return created;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create forward order');
    }
  }
);

// New thunk for creating reverse orders
export const createReverseOrder = createAsyncThunk<
  any,
  any
>(
  'orders/createReverseOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const created = await OrdersApi.createReverseOrder(orderData);
      return created;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create reverse order');
    }
  }
);

// New thunk for manifesting orders
export const manifestOrders = createAsyncThunk<
  any,
  string[]
>(
  'orders/manifestOrders',
  async (orderIds, { rejectWithValue }) => {
    try {
      const result = await OrdersApi.manifestOrders(orderIds);
      return result;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to manifest orders');
    }
  }
);

// New thunk for bulk upload
export const bulkUploadOrders = createAsyncThunk<
  any,
  File
>(
  'orders/bulkUploadOrders',
  async (csvFile, { rejectWithValue }) => {
    try {
      const result = await OrdersApi.bulkUploadOrders(csvFile);
      return result;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to upload bulk orders');
    }
  }
);

// New thunk for cancel order
export const cancelOrder = createAsyncThunk<
  string,
  string
>(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await OrdersApi.cancelOrder(orderId);
      return orderId;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to cancel order');
    }
  }
);

export const updateOrder = createAsyncThunk<{ orderId: string; updates: Partial<Order> }, { orderId: string; updates: Partial<Order> }>(
  'orders/updateOrder',
  async ({ orderId, updates }, { rejectWithValue }) => {
    try {
      // Transform frontend Order updates to backend format if needed
      const backendUpdates = {
        consignee_name: updates.deliveryAddress?.split(',')[0],
        // Add other field mappings as needed
      };
      await OrdersApi.updateOrder(orderId, backendUpdates);
      return { orderId, updates };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update order');
    }
  }
);

export const deleteOrder = createAsyncThunk<string, string>(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await OrdersApi.deleteOrder(orderId);
      return orderId;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete order');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    setStatus(state, action: PayloadAction<OrderStatus | 'all-shipments'>) {
      state.filters.status = action.payload;
      state.pagination.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1;
    },
    clearError(state) {
      state.error = null;
    },

    // Create Order Modal Actions
    openCreateOrderModal(state) {
      state.createOrderModal.isOpen = true;
    },
    closeCreateOrderModal(state) {
      state.createOrderModal.isOpen = false;
      // Reset form state
      state.createOrderModal.productSearch = '';
      state.createOrderModal.selectedProducts = [];
      state.createOrderModal.paymentMode = 'Pre-Paid';
      state.createOrderModal.packageDetails = {
        type: '',
        dimensions: { length: '', breadth: '', height: '' },
        weight: ''
      };
      state.createOrderModal.shippingMode = 'SURFACE';
      state.createOrderModal.addresses = {};
    },
    setProductSearch(state, action: PayloadAction<string>) {
      state.createOrderModal.productSearch = action.payload;
    },
    setPaymentMode(state, action: PayloadAction<'Pre-Paid' | 'COD'>) {
      state.createOrderModal.paymentMode = action.payload;
    },
    setPackageType(state, action: PayloadAction<string>) {
      state.createOrderModal.packageDetails.type = action.payload;
    },
    setPackageDimensions(state, action: PayloadAction<{ length: string; breadth: string; height: string }>) {
      state.createOrderModal.packageDetails.dimensions = action.payload;
    },
    setPackageWeight(state, action: PayloadAction<string>) {
      state.createOrderModal.packageDetails.weight = action.payload;
    },
    setShippingMode(state, action: PayloadAction<'SURFACE' | 'EXPRESS'>) {
      state.createOrderModal.shippingMode = action.payload;
    },
    addProduct(state, action: PayloadAction<any>) {
      state.createOrderModal.selectedProducts.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders;
        state.pagination.total = action.payload.pagination.total;
        state.statusCounts = action.payload.statusCounts;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch orders';
      })

      // generateAwb
      .addCase(generateAwb.pending, (state, action) => {
        state.generatingAwbId = action.meta.arg;
        state.error = null;
      })
      .addCase(generateAwb.fulfilled, (state, action) => {
        const { orderId, awbNumber } = action.payload;
        state.generatingAwbId = null;
        const idx = state.items.findIndex(o => o.id === orderId);
        if (idx >= 0) state.items[idx] = { ...state.items[idx], awbNumber };
      })
      .addCase(generateAwb.rejected, (state, action) => {
        state.generatingAwbId = null;
        state.error = (action.payload as string) || action.error.message || 'Failed to generate AWB';
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
        state.pagination.total += 1;
        // statusCounts will be recomputed upon next fetch; for mock, adjust best-effort
        const status = action.payload.status;
        state.statusCounts[status] += 1;
        state.statusCounts['all-shipments'] += 1;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to create order';
      })

      // updateOrder
      .addCase(updateOrder.pending, (state, action) => {
        state.updatingById = action.meta.arg.orderId;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const { orderId, updates } = action.payload;
        state.updatingById = null;
        const idx = state.items.findIndex(o => o.id === orderId);
        if (idx >= 0) state.items[idx] = { ...state.items[idx], ...updates };
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.updatingById = null;
        state.error = (action.payload as string) || action.error.message || 'Failed to update order';
      })

      // deleteOrder
      .addCase(deleteOrder.pending, (state, action) => {
        state.deletingById = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const orderId = action.payload;
        state.deletingById = null;
        const idx = state.items.findIndex(o => o.id === orderId);
        if (idx >= 0) {
          const removed = state.items[idx];
          state.items.splice(idx, 1);
          state.pagination.total = Math.max(0, state.pagination.total - 1);
          state.statusCounts[removed.status] = Math.max(0, state.statusCounts[removed.status] - 1);
          state.statusCounts['all-shipments'] = Math.max(0, state.statusCounts['all-shipments'] - 1);
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deletingById = null;
        state.error = (action.payload as string) || action.error.message || 'Failed to delete order';
      });
  },
});

export const { 
  setSearch, 
  setStatus, 
  setPage, 
  setPageSize, 
  clearError,
  openCreateOrderModal,
  closeCreateOrderModal,
  setProductSearch,
  setPaymentMode,
  setPackageType,
  setPackageDimensions,
  setPackageWeight,
  setShippingMode,
  addProduct
} = ordersSlice.actions;

export const selectOrdersState = (state: RootState) => state.orders;
export const selectOrders = (state: RootState) => state.orders.items;

export default ordersSlice.reducer;


