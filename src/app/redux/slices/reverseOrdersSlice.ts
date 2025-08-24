import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { ReverseOrdersApi } from '@/lib/api/reverseOrders';
import type { 
  ReverseOrder, 
  ReverseOrderStatus, 
  ReverseOrdersListResponse, 
  ReverseOrderStatusCounts 
} from '@/types/orders';

type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
};

type FiltersState = { 
  search: string; 
  status: ReverseOrderStatus | 'all-shipments';
  dateRange?: string;
  transportMode?: string;
};

export interface ReverseOrdersState {
  items: ReverseOrder[];
  pagination: PaginationState;
  statusCounts: ReverseOrderStatusCounts;
  filters: FiltersState;

  loading: boolean;
  error: string | null;

  creating: boolean;
  updatingById: string | null;
  deletingById: string | null;

  // UI state
  selectedOrderId: string | null;
  showMoreFilters: boolean;
}

const initialCounts: ReverseOrderStatusCounts = {
  'all-shipments': 0,
  'pending': 0,
  'ready-for-pickup': 0,
  'in-transit': 0,
  'delivered': 0,
  'cancelled': 0
};

const initialState: ReverseOrdersState = {
  items: [],
  pagination: { page: 1, pageSize: 25, total: 0 },
  statusCounts: initialCounts,
  filters: { search: '', status: 'all-shipments', dateRange: '', transportMode: '' },

  loading: false,
  error: null,

  creating: false,
  updatingById: null,
  deletingById: null,

  selectedOrderId: null,
  showMoreFilters: false
};

// Thunks
export const fetchReverseOrders = createAsyncThunk<
  ReverseOrdersListResponse, 
  void, 
  { state: RootState }
>(
  'reverseOrders/fetchReverseOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination } = getState().reverseOrders;
      const res = await ReverseOrdersApi.listReverseOrders({
        search: filters.search,
        status: filters.status,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch reverse orders');
    }
  }
);

export const createReverseOrder = createAsyncThunk<
  ReverseOrder,
  Omit<ReverseOrder, 'id'>,
  { state: RootState }
>(
  'reverseOrders/createReverseOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await ReverseOrdersApi.createReverseOrder(orderData);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create reverse order');
    }
  }
);

export const updateReverseOrder = createAsyncThunk<
  void,
  { orderId: string; updates: Partial<ReverseOrder> },
  { state: RootState }
>(
  'reverseOrders/updateReverseOrder',
  async ({ orderId, updates }, { rejectWithValue }) => {
    try {
      await ReverseOrdersApi.updateReverseOrder(orderId, updates);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update reverse order');
    }
  }
);

export const deleteReverseOrder = createAsyncThunk<
  string,
  string,
  { state: RootState }
>(
  'reverseOrders/deleteReverseOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await ReverseOrdersApi.deleteReverseOrder(orderId);
      return orderId;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete reverse order');
    }
  }
);

const reverseOrdersSlice = createSlice({
  name: 'reverseOrders',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.pagination.page = 1; // Reset to first page when searching
    },
    setStatus(state, action: PayloadAction<ReverseOrderStatus | 'all-shipments'>) {
      state.filters.status = action.payload;
      state.pagination.page = 1; // Reset to first page when filtering
    },
    setDateRange(state, action: PayloadAction<string>) {
      state.filters.dateRange = action.payload;
      state.pagination.page = 1;
    },
    setTransportMode(state, action: PayloadAction<string>) {
      state.filters.transportMode = action.payload;
      state.pagination.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1; // Reset to first page when changing page size
    },
    setSelectedOrderId(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    toggleMoreFilters(state) {
      state.showMoreFilters = !state.showMoreFilters;
    },
    clearError(state) {
      state.error = null;
    },
    clearFilters(state) {
      state.filters = {
        search: '',
        status: 'all-shipments',
        dateRange: '',
        transportMode: ''
      };
      state.pagination.page = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchReverseOrders
      .addCase(fetchReverseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReverseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders;
        state.pagination.total = action.payload.pagination.total;
        state.statusCounts = action.payload.statusCounts;
      })
      .addCase(fetchReverseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch reverse orders';
      })

      // createReverseOrder
      .addCase(createReverseOrder.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createReverseOrder.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
        state.pagination.total += 1;
        // Update status counts
        const status = action.payload.status;
        state.statusCounts[status] += 1;
        state.statusCounts['all-shipments'] += 1;
      })
      .addCase(createReverseOrder.rejected, (state, action) => {
        state.creating = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to create reverse order';
      })

      // updateReverseOrder
      .addCase(updateReverseOrder.pending, (state, action) => {
        state.updatingById = action.meta.arg.orderId;
        state.error = null;
      })
      .addCase(updateReverseOrder.fulfilled, (state, action) => {
        state.updatingById = null;
        const { orderId, updates } = action.meta.arg;
        const index = state.items.findIndex(o => o.id === orderId);
        if (index >= 0) {
          state.items[index] = { ...state.items[index], ...updates };
        }
      })
      .addCase(updateReverseOrder.rejected, (state, action) => {
        state.updatingById = null;
        state.error = (action.payload as string) || action.error.message || 'Failed to update reverse order';
      })

      // deleteReverseOrder
      .addCase(deleteReverseOrder.pending, (state, action) => {
        state.deletingById = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteReverseOrder.fulfilled, (state, action) => {
        state.deletingById = null;
        const orderId = action.payload;
        const index = state.items.findIndex(o => o.id === orderId);
        if (index >= 0) {
          const order = state.items[index];
          state.items.splice(index, 1);
          state.pagination.total -= 1;
          // Update status counts
          state.statusCounts[order.status] -= 1;
          state.statusCounts['all-shipments'] -= 1;
        }
      })
      .addCase(deleteReverseOrder.rejected, (state, action) => {
        state.deletingById = null;
        state.error = (action.payload as string) || action.error.message || 'Failed to delete reverse order';
      });
  }
});

export const {
  setSearch,
  setStatus,
  setDateRange,
  setTransportMode,
  setPage,
  setPageSize,
  setSelectedOrderId,
  toggleMoreFilters,
  clearError,
  clearFilters
} = reverseOrdersSlice.actions;

export const selectReverseOrdersState = (state: RootState) => state.reverseOrders;
export const selectReverseOrders = (state: RootState) => state.reverseOrders.items;
export const selectReverseOrdersLoading = (state: RootState) => state.reverseOrders.loading;
export const selectReverseOrdersError = (state: RootState) => state.reverseOrders.error;
export const selectReverseOrdersFilters = (state: RootState) => state.reverseOrders.filters;
export const selectReverseOrdersPagination = (state: RootState) => state.reverseOrders.pagination;
export const selectReverseOrdersStatusCounts = (state: RootState) => state.reverseOrders.statusCounts;

export default reverseOrdersSlice.reducer;
