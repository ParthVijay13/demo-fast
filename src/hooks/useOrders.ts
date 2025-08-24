"use client";
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { OrdersApi } from '@/lib/api/orders';
import type { OrdersListRequest, OrdersListResponse, Order, OrderStatus } from '@/types/orders';

interface UseOrdersOptions {
  initialStatus?: OrderStatus | 'all-shipments';
  initialSearch?: string;
  pageSize?: number;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { initialStatus = 'all-shipments', initialSearch = '', pageSize = 25 } = options;
  const [status, setStatus] = useState<OrderStatus | 'all-shipments'>(initialStatus);
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(1);

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [statusCounts, setStatusCounts] = useState<OrdersListResponse['statusCounts']>({
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
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchOrders = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const payload: OrdersListRequest = { search, status, page, pageSize };
      const res = await OrdersApi.listOrders(payload);
      setOrders(res.orders);
      setTotal(res.pagination.total);
      setStatusCounts(res.statusCounts);
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [search, status, page, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [search, status, page, pageSize]);

  const setSelectedStatus = useCallback((next: OrderStatus | 'all-shipments') => {
    setPage(1);
    setStatus(next);
  }, []);

  const filteredCount = useMemo(() => orders.length, [orders]);

  const generateAwb = useCallback(async (orderId: string) => {
    try {
      const { awbNumber } = await OrdersApi.generateAwb(orderId);
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, awbNumber } : o)));
      return awbNumber;
    } catch (err: any) {
      setError(err?.message || 'Failed to generate AWB');
      throw err;
    }
  }, []);

  return {
    // state
    orders,
    total,
    filteredCount,
    statusCounts,
    loading,
    error,

    // filters & pagination
    search,
    setSearch,
    status,
    setSelectedStatus,
    page,
    setPage,

    // actions
    refetch: fetchOrders,
    generateAwb,
  };
}

export type UseOrdersReturn = ReturnType<typeof useOrders>;


