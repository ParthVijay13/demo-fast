"use client";
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import {
  selectReverseOrdersState,
  fetchReverseOrders,
  setSearch,
  setStatus,
  setPage,
  setPageSize,
  clearError
} from '@/app/redux/slices/reverseOrdersSlice';
import type { ReverseOrderStatus } from '@/types/orders';

interface UseReverseOrdersOptions {
  initialStatus?: ReverseOrderStatus | 'all-shipments';
  initialSearch?: string;
  autoFetch?: boolean;
}

export function useReverseOrders(options: UseReverseOrdersOptions = {}) {
  const { 
    initialStatus = 'all-shipments', 
    initialSearch = '', 
    autoFetch = true 
  } = options;

  const dispatch = useAppDispatch();
  const reverseOrdersState = useAppSelector(selectReverseOrdersState);
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize filters if provided
  useEffect(() => {
    if (!isInitialized) {
      if (initialStatus !== reverseOrdersState.filters.status) {
        dispatch(setStatus(initialStatus));
      }
      if (initialSearch !== reverseOrdersState.filters.search) {
        dispatch(setSearch(initialSearch));
      }
      setIsInitialized(true);
    }
  }, [dispatch, initialStatus, initialSearch, isInitialized, reverseOrdersState.filters]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (autoFetch && isInitialized) {
      const fetchTimer = setTimeout(() => {
        dispatch(fetchReverseOrders());
      }, 300); // Debounce API calls

      return () => clearTimeout(fetchTimer);
    }
  }, [
    dispatch,
    autoFetch,
    isInitialized,
    reverseOrdersState.filters.search,
    reverseOrdersState.filters.status,
    reverseOrdersState.filters.dateRange,
    reverseOrdersState.filters.transportMode,
    reverseOrdersState.pagination.page,
    reverseOrdersState.pagination.pageSize
  ]);

  // Memoized computed values
  const computedValues = useMemo(() => {
    const { items: orders, pagination, statusCounts } = reverseOrdersState;
    
    return {
      orders,
      pagination,
      statusCounts,
      hasOrders: orders.length > 0,
      totalPages: Math.ceil(pagination.total / pagination.pageSize),
      isFirstPage: pagination.page === 1,
      isLastPage: pagination.page >= Math.ceil(pagination.total / pagination.pageSize),
      currentStatusCount: statusCounts[reverseOrdersState.filters.status] || 0
    };
  }, [reverseOrdersState]);

  // Action handlers
  const handleSearch = useCallback((searchTerm: string) => {
    dispatch(setSearch(searchTerm));
  }, [dispatch]);

  const handleStatusChange = useCallback((status: ReverseOrderStatus | 'all-shipments') => {
    dispatch(setStatus(status));
  }, [dispatch]);

  const handlePageChange = useCallback((page: number) => {
    dispatch(setPage(page));
  }, [dispatch]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    dispatch(setPageSize(pageSize));
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(fetchReverseOrders());
  }, [dispatch]);

  // Error handling with retry capability
  const errorState = useMemo(() => {
    if (!reverseOrdersState.error) return null;

    return {
      message: reverseOrdersState.error,
      canRetry: true,
      retry: refetch,
      dismiss: handleClearError
    };
  }, [reverseOrdersState.error, refetch, handleClearError]);

  return {
    // State
    ...reverseOrdersState,
    ...computedValues,
    errorState,
    isInitialized,

    // Actions
    handleSearch,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleClearError,
    refetch
  };
}
