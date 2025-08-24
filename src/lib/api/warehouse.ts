import { apiClient } from './client';
import type { BackendApiResponse } from '@/types/backend';

export interface Warehouse {
    id: string;
    warehouse_name: string;
    phone: string;
    email: string;
    pickup_address: string;
    pickup_city: string;
    pickup_pincode: string;
    pickup_state: string;
    pickup_country: string;
    return_address: string;
    return_city: string;
    return_state: string;
    return_pincode: string;
    return_country: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface CreateWarehouseRequest {
    warehouse_name: string;
    phone: string;
    email: string;
    pickup_address: string;
    pickup_city: string;
    pickup_pincode: string;
    pickup_state: string;
    pickup_country: string;
    return_address: string;
    return_city: string;
    return_state: string;
    return_pincode: string;
    return_country: string;
}

export interface GetWarehousesResponse {
    warehouses: Warehouse[];
    metadata: {
        total_items: number;
        current_page: number;
        items_per_page: number;
        total_pages: number;
    };
}

export interface GetWarehousesParams {
    page?: number;
    offset?: number;
    query?: string;
}

export const WarehouseApi = {
    createWarehouse: async (warehouseData: CreateWarehouseRequest): Promise<{ warehouse: Warehouse; tps_response: any }> => {
        const response = await apiClient.post<BackendApiResponse<{ warehouse: Warehouse; tps_response: any }>>(
            `/warehouse`,
            warehouseData
        );

        if (!response.success) {
            throw new Error(response.message || 'Failed to create warehouse');
        }

        return response.data;
    },

    getUserWarehouses: async (params?: GetWarehousesParams): Promise<GetWarehousesResponse> => {
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.offset) queryParams.append('offset', params.offset.toString());
        if (params?.query) queryParams.append('query', params.query);

        const response = await apiClient.get<BackendApiResponse<Warehouse[]> & { metadata: any }>(
            `/warehouse?${queryParams.toString()}`
        );

        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch warehouses');
        }

        return {
            warehouses: response.data,
            metadata: response.metadata || {
                total_items: 0,
                current_page: 1,
                items_per_page: 50,
                total_pages: 0
            }
        };
    },

    getOneWarehouse: async (id: string): Promise<Warehouse> => {
        const response = await apiClient.get<BackendApiResponse<Warehouse>>(
            `/warehouse/${id}`
        );

        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch warehouse');
        }

        return response.data;
    }
};

export type WarehouseApiType = typeof WarehouseApi;
