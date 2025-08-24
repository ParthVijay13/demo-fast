import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { BulkUploadApi } from '@/lib/api/bulkUpload';
import type { BulkUploadResponse } from '@/lib/api/bulkUpload';

export interface BulkUploadState {
  uploading: boolean;
  uploadError: string | null;
  uploadResult: BulkUploadResponse | null;
  
  downloadingTemplate: boolean;
  downloadError: string | null;
}

const initialState: BulkUploadState = {
  uploading: false,
  uploadError: null,
  uploadResult: null,
  
  downloadingTemplate: false,
  downloadError: null,
};

// Thunks
export const uploadBulkOrders = createAsyncThunk<
  BulkUploadResponse,
  File,
  { state: RootState }
>(
  'bulkUpload/uploadBulkOrders',
  async (file, { rejectWithValue }) => {
    try {
      const response = await BulkUploadApi.uploadBulkOrders(file);
      return response;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to upload bulk orders');
    }
  }
);

export const downloadTemplate = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'bulkUpload/downloadTemplate',
  async (_, { rejectWithValue }) => {
    try {
      const blob = await BulkUploadApi.downloadTemplate();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bulk_orders_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to download template');
    }
  }
);

const bulkUploadSlice = createSlice({
  name: 'bulkUpload',
  initialState,
  reducers: {
    clearUploadError(state) {
      state.uploadError = null;
    },
    clearDownloadError(state) {
      state.downloadError = null;
    },
    clearUploadResult(state) {
      state.uploadResult = null;
    },
    resetBulkUpload(state) {
      state.uploading = false;
      state.uploadError = null;
      state.uploadResult = null;
      state.downloadingTemplate = false;
      state.downloadError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // uploadBulkOrders
      .addCase(uploadBulkOrders.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
        state.uploadResult = null;
      })
      .addCase(uploadBulkOrders.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadResult = action.payload;
      })
      .addCase(uploadBulkOrders.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = (action.payload as string) || action.error.message || 'Failed to upload bulk orders';
      })

      // downloadTemplate
      .addCase(downloadTemplate.pending, (state) => {
        state.downloadingTemplate = true;
        state.downloadError = null;
      })
      .addCase(downloadTemplate.fulfilled, (state) => {
        state.downloadingTemplate = false;
      })
      .addCase(downloadTemplate.rejected, (state, action) => {
        state.downloadingTemplate = false;
        state.downloadError = (action.payload as string) || action.error.message || 'Failed to download template';
      });
  },
});

export const {
  clearUploadError,
  clearDownloadError,
  clearUploadResult,
  resetBulkUpload
} = bulkUploadSlice.actions;

export const selectBulkUploadState = (state: RootState) => state.bulkUpload;
export const selectBulkUploading = (state: RootState) => state.bulkUpload.uploading;
export const selectBulkUploadError = (state: RootState) => state.bulkUpload.uploadError;
export const selectBulkUploadResult = (state: RootState) => state.bulkUpload.uploadResult;
export const selectDownloadingTemplate = (state: RootState) => state.bulkUpload.downloadingTemplate;
export const selectDownloadError = (state: RootState) => state.bulkUpload.downloadError;

export default bulkUploadSlice.reducer;
