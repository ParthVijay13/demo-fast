import { apiClient } from './client';
import type { BackendApiResponse } from '@/types/backend';

export interface PickupRequest {
  id: string;
  pickup_date: string;
  pickup_time: string;
  pickup_address_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  pickup_address?: {
    id: string;
    warehouse_name: string;
    pickup_address: string;
    pickup_city: string;
    pickup_state: string;
    pickup_pincode: string;
  };
}

export interface CreatePickupRequestData {
  pickup_time: string;
  pickup_date: string;
  pickup_address_id: string;
  expected_package_count: number;
}

export interface PickupListResponse {
  pickups: PickupRequest[];
  metadata: {
    total_items: number;
    current_page: number;
    items_per_page: number;
    total_pages: number;
  };
}

export const PickupApi = {
  // Create pickup request
  createPickupRequest: async (data: CreatePickupRequestData): Promise<PickupRequest> => {
    const response = await apiClient.post<BackendApiResponse<PickupRequest>>(
      '/pickup',
      data
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create pickup request');
    }
    
    return response.data;
  },

  // Get all pickup requests with pagination
  getPickupRequests: async (params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PickupListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('offset', params.pageSize.toString());

    const response = await apiClient.get<BackendApiResponse<PickupRequest[]> & { metadata: any }>(
      `/pickup?${queryParams.toString()}`
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch pickup requests');
    }
    
    return {
      pickups: response.data,
      metadata: response.metadata || {
        total_items: 0,
        current_page: 1,
        items_per_page: 50,
        total_pages: 0
      }
    };
  }
};

export type PickupApiType = typeof PickupApi;
