"use client";

import { useState, useEffect, useCallback } from 'react';
import { WarehouseApi, type Warehouse, type CreateWarehouseRequest, type GetWarehousesParams, type GetWarehousesResponse } from '@/lib/api/warehouse';

interface UseWarehousesState {
  warehouses: Warehouse[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  fetching: boolean;
  metadata: {
    total_items: number;
    current_page: number;
    items_per_page: number;
    total_pages: number;
  };
}

interface UseWarehousesReturn extends UseWarehousesState {
  createWarehouse: (warehouseData: CreateWarehouseRequest) => Promise<{ warehouse: Warehouse; tps_response: any }>;
  fetchWarehouses: (params?: GetWarehousesParams) => Promise<void>;
  getWarehouse: (id: string) => Promise<Warehouse>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useWarehouses = (initialParams?: GetWarehousesParams): UseWarehousesReturn => {
  const [state, setState] = useState<UseWarehousesState>({
    warehouses: [],
    loading: true,
    error: null,
    creating: false,
    fetching: false,
    metadata: {
      total_items: 0,
      current_page: 1,
      items_per_page: 50,
      total_pages: 0,
    },
  });

  const [currentParams, setCurrentParams] = useState<GetWarehousesParams>(initialParams || {});

  const fetchWarehouses = useCallback(async (params?: GetWarehousesParams) => {
    const queryParams = params || currentParams;
    setCurrentParams(queryParams);
    
    setState(prev => ({ ...prev, fetching: true, error: null }));
    
    try {
      const response: GetWarehousesResponse = await WarehouseApi.getUserWarehouses(queryParams);
      setState(prev => ({
        ...prev,
        warehouses: response.warehouses,
        metadata: response.metadata,
        loading: false,
        fetching: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        fetching: false,
        error: error.message || 'Failed to fetch warehouses',
      }));
    }
  }, [currentParams]);

  const createWarehouse = useCallback(async (warehouseData: CreateWarehouseRequest) => {
    setState(prev => ({ ...prev, creating: true, error: null }));
    
    try {
      const result = await WarehouseApi.createWarehouse(warehouseData);
      
      // Refresh the warehouses list after successful creation
      await fetchWarehouses(currentParams);
      
      setState(prev => ({ ...prev, creating: false, error: null }));
      return result;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        creating: false,
        error: error.message || 'Failed to create warehouse',
      }));
      throw error;
    }
  }, [fetchWarehouses, currentParams]);

  const getWarehouse = useCallback(async (id: string): Promise<Warehouse> => {
    try {
      return await WarehouseApi.getOneWarehouse(id);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch warehouse',
      }));
      throw error;
    }
  }, []);

  const refetch = useCallback(() => {
    return fetchWarehouses(currentParams);
  }, [fetchWarehouses, currentParams]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchWarehouses(initialParams);
  }, []);

  return {
    ...state,
    createWarehouse,
    fetchWarehouses,
    getWarehouse,
    refetch,
    clearError,
  };
};

export default useWarehouses;
