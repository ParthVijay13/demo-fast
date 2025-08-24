import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { PickupApi } from '@/lib/api/pickup';
import type { PickupRequest, CreatePickupRequestData, PickupListResponse } from '@/lib/api/pickup';

type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
};

type FiltersState = {
  search: string;
  status: string;
  dateRange: string;
  pickupLocation: string;
};

export interface PickupState {
  items: PickupRequest[];
  pagination: PaginationState;
  filters: FiltersState;

  loading: boolean;
  error: string | null;

  creating: boolean;
  creatingError: string | null;
}

const initialState: PickupState = {
  items: [],
  pagination: { page: 1, pageSize: 50, total: 0 },
  filters: { search: '', status: '', dateRange: '', pickupLocation: '' },

  loading: false,
  error: null,

  creating: false,
  creatingError: null,
};

// Thunks
export const fetchPickupRequests = createAsyncThunk<
  PickupListResponse,
  void,
  { state: RootState }
>(
  'pickup/fetchPickupRequests',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { pagination } = getState().pickup;
      const res = await PickupApi.getPickupRequests({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch pickup requests');
    }
  }
);

export const createPickupRequest = createAsyncThunk<
  PickupRequest,
  CreatePickupRequestData,
  { state: RootState }
>(
  'pickup/createPickupRequest',
  async (data, { rejectWithValue }) => {
    try {
      const res = await PickupApi.createPickupRequest(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create pickup request');
    }
  }
);

const pickupSlice = createSlice({
  name: 'pickup',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    setStatus(state, action: PayloadAction<string>) {
      state.filters.status = action.payload;
      state.pagination.page = 1;
    },
    setDateRange(state, action: PayloadAction<string>) {
      state.filters.dateRange = action.payload;
      state.pagination.page = 1;
    },
    setPickupLocation(state, action: PayloadAction<string>) {
      state.filters.pickupLocation = action.payload;
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
      state.creatingError = null;
    },
    clearFilters(state) {
      state.filters = {
        search: '',
        status: '',
        dateRange: '',
        pickupLocation: ''
      };
      state.pagination.page = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPickupRequests
      .addCase(fetchPickupRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.pickups;
        state.pagination.total = action.payload.metadata.total_items;
      })
      .addCase(fetchPickupRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch pickup requests';
      })

      // createPickupRequest
      .addCase(createPickupRequest.pending, (state) => {
        state.creating = true;
        state.creatingError = null;
      })
      .addCase(createPickupRequest.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createPickupRequest.rejected, (state, action) => {
        state.creating = false;
        state.creatingError = (action.payload as string) || action.error.message || 'Failed to create pickup request';
      });
  },
});

export const {
  setSearch,
  setStatus,
  setDateRange,
  setPickupLocation,
  setPage,
  setPageSize,
  clearError,
  clearFilters
} = pickupSlice.actions;

export const selectPickupState = (state: RootState) => state.pickup;
export const selectPickupRequests = (state: RootState) => state.pickup.items;
export const selectPickupLoading = (state: RootState) => state.pickup.loading;
export const selectPickupError = (state: RootState) => state.pickup.error;
export const selectPickupCreating = (state: RootState) => state.pickup.creating;
export const selectPickupCreatingError = (state: RootState) => state.pickup.creatingError;
export const selectPickupFilters = (state: RootState) => state.pickup.filters;
export const selectPickupPagination = (state: RootState) => state.pickup.pagination;

export default pickupSlice.reducer;
