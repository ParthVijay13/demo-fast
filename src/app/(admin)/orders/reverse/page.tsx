"use client";
import React, { useState, useCallback } from 'react';
import {
  Search, Filter, Calendar, Truck, ChevronDown, Plus, AlertCircle, RefreshCw
} from 'lucide-react';
import { useAppDispatch } from '@/app/redux/store';
import {
  setDateRange as setDateRangeAction,
  setTransportMode as setTransportModeAction,
  toggleMoreFilters
} from '@/app/redux/slices/reverseOrdersSlice';
import type { ReverseOrderStatus } from '@/types/orders';
import ReverseOrdersSidebar from '@/components/orders/ReverseOrdersSidebar';
import ReverseStateAwareTable from '@/components/tables/ReverseStateAwareTable';
import type { ReverseOrderState } from '@/config/reverseOrderStateConfig';
import Pagination from '@/components/ui/pagination/Pagination';
import { useReverseOrders } from '@/hooks/useReverseOrders';
import { useRouter } from 'next/navigation';

const ReverseOrdersPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    orders,
    pagination,
    loading,
    filters,
    showMoreFilters,
    errorState,
    handleSearch,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    refetch,
    currentStatusCount
  } = useReverseOrders();

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [awbSearch, setAwbSearch] = useState('');

  const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  }, [orders]);

  const handleSelectOrder = useCallback((orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  }, []);

  const handleStatusChangeLocal = useCallback((status: ReverseOrderStatus | 'all-shipments') => {
    handleStatusChange(status);
    setSelectedOrders([]); // Clear selections when status changes
  }, [handleStatusChange]);

  const handleOrderAction = useCallback((action: string, orderId: string) => {
    console.log(`Action ${action} on order ${orderId}`);
    // Implement order actions here
  }, []);

  // Convert current status to ReverseOrderState
  const getCurrentState = (): ReverseOrderState => {
    const statusMap: Record<string, ReverseOrderState> = {
      'pending': 'pending',
      'ready-for-pickup': 'ready_for_pickup',
      'in-transit': 'in_transit',
      'out-for-delivery': 'out_for_delivery',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'all-shipments': 'all_shipments'
    };
    return statusMap[filters.status] || 'all_shipments';
  };

  // Handle query changes from table filters
  const handleQueryChange = useCallback((params: Record<string, any>) => {
    if (params.search !== undefined) {
      handleSearch(params.search);
    }
    if (params.date_range) {
      dispatch(setDateRangeAction(params.date_range));
    }
    if (params.transport_mode) {
      dispatch(setTransportModeAction(params.transport_mode));
    }
    // Handle other filter params as needed
  }, [handleSearch, dispatch]);

  // Handle sorting
  const handleSortChange = useCallback((columnId: string, direction: 'asc' | 'desc') => {
    console.log(`Sort ${columnId} ${direction}`);
    // Implement sorting logic here
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatically handled by the hook with debouncing
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ReverseOrdersSidebar onStatusChange={handleStatusChangeLocal} />
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">Reverse Orders</h1>
              {filters.status !== 'all-shipments' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {filters.status.replace('-', ' ')} ({currentStatusCount})
                </span>
              )}
              {loading && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {/* AWB Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search multiple AWBs"
                  value={awbSearch}
                  onChange={(e) => setAwbSearch(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              {/* Refresh button */}
              <button
                onClick={refetch}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 disabled:opacity-50"
                title="Refresh orders"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              {/* Upload orders button */}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              onClick={() => router.push('/orders/reverse/bulk-upload')}
              >
                <Plus className="w-4 h-4" />
                <span>Upload orders</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {errorState && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorState.message}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {errorState.canRetry && (
                  <button
                    onClick={errorState.retry}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={errorState.dismiss}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State-Aware Table */}
        <div className="mx-6 mt-4">
          <ReverseStateAwareTable
            state={getCurrentState()}
            data={orders}
            loading={loading}
            selectedRows={selectedOrders}
            onQueryChange={handleQueryChange}
            onRowSelect={handleSelectOrder}
            onSelectAll={(checked) => {
              if (checked) {
                setSelectedOrders(orders.map(o => o.id));
              } else {
                setSelectedOrders([]);
              }
            }}
            onRowAction={handleOrderAction}
            onSortChange={handleSortChange}
          />
          
          {/* Pagination */}
          {orders.length > 0 && (
            <div className="mt-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(pagination.total / pagination.pageSize)}
                pageSize={pagination.pageSize}
                totalItems={pagination.total}
                itemsShown={orders.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReverseOrdersPage;
