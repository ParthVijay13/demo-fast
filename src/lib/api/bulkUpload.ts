import { apiClient } from './client';
import type { BackendApiResponse } from '@/types/backend';

export interface BulkUploadResponse {
  successful: Array<{
    row: number;
    order_id: string;
    id: string;
    status: string;
  }>;
  failed: Array<{
    row: number;
    order_id: string;
    error: string;
  }>;
  summary: {
    total_rows: number;
    successful_count: number;
    failed_count: number;
  };
}

export interface BulkUploadRequest {
  file: File;
  channel?: string;
}

export const BulkUploadApi = {
  // Upload CSV file for bulk order creation
  uploadBulkOrders: async (file: File): Promise<BulkUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<BackendApiResponse<BulkUploadResponse>>(
      '/order/forward/bulk',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to upload bulk orders');
    }
    
    return response.data;
  },

  // Download CSV template
  // downloadTemplate: async (): Promise<Blob> => {
  //   const response = await apiClient.get('/order/template', {
  //     responseType: 'blob',
  //   });
    
  //   return response;
  // }
};

export type BulkUploadApiType = typeof BulkUploadApi;
