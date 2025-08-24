"use client";
import React, { useState, useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import {
  selectOrdersState,
  fetchOrders,
  setSearch as setSearchAction,
  setStatus as setStatusAction,
  setPage as setPageAction,
  setPageSize as setPageSizeAction,
  generateAwb as generateAwbThunk
} from '@/app/redux/slices/ordersSlice';
import StateAwareTable from '@/components/tables/StateAwareTable';
import Pagination from '@/components/ui/pagination/Pagination';
import OrderStatesSidebar from '@/components/orders/OrderStatesSidebar';
import { useRouter } from 'next/navigation';
import OrderPageHeader from '@/components/orders/OrderPageHeader';
import type { Order } from '@/types/orders';

const InTransitOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const ordersState = useAppSelector(selectOrdersState);
  const { items: orders, pagination, loading, error, filters } = ordersState;

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sortState, setSortState] = useState<{ columnId: string; direction: 'asc'|'desc' }>({
    columnId: 'estimatedDeliveryDate',
    direction: 'asc'
  });

  // Set the status to in-transit when component mounts
  useEffect(() => {
    if (filters.status !== 'in-transit') {
      dispatch(setStatusAction('in-transit'));
    }
  }, [dispatch, filters.status]);

  // Fetch orders when filters change
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch, filters.search, filters.status, pagination.page, pagination.pageSize]);

  // Handle query changes from StateAwareTable filters
  const handleQueryChange = useCallback((params: Record<string, any>) => {
    // Update search if provided
    if (params.search !== undefined) {
      dispatch(setSearchAction(params.search));
    }
    
    // Reset to first page when filters change
    if (pagination.page !== 1) {
      dispatch(setPageAction(1));
    }

    // Here you could also dispatch additional filter actions
    // based on other params like estimated_delivery_date, shipment_status, etc.
    console.log('Filter params changed:', params);
  }, [dispatch, pagination.page]);

  // Handle row selection
  const handleRowSelect = useCallback((rowId: string) => {
    setSelectedOrders(prev =>
      prev.includes(rowId) ? prev.filter(id => id !== rowId) : [...prev, rowId]
    );
  }, []);

  // Handle select all
  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  }, [orders]);

  // Handle row actions
  const handleRowAction = useCallback((action: string, rowId: string) => {
    console.log(`Action ${action} on row ${rowId}`);
    
    switch (action) {
      case 'cloneOrder':
        // Implement clone order logic
        console.log('Cloning order:', rowId);
        break;
      case 'cancelShipment':
        // Implement cancel shipment logic
        console.log('Cancelling shipment:', rowId);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, []);

  // Handle sorting
  const handleSortChange = useCallback((columnId: string, direction: 'asc'|'desc') => {
    setSortState({ columnId, direction });
    // Here you could dispatch a sort action to your Redux store
    // console.log('Sort changed:', columnId, direction);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-auto">
      {/* Header */}
      <OrderPageHeader
        title="In Transit Orders"
        searchValue={filters.search}
        onSearchChange={(value) => dispatch(setSearchAction(value))}
        onBulkCreateClick={() => router.push('/orders/bulk-upload')}
        onCreateOrderClick={() => router.push('/orders/create')}
      />

      {/* Body with States Sidebar + Content */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 min-h-0">
        {/* Left states sidebar */}
        <div className="w-full lg:w-56 flex-shrink-0">
          <OrderStatesSidebar
            counts={ordersState.statusCounts}
          />
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* State-aware table with built-in filters */}
          <StateAwareTable
            state="in_transit"
            data={orders}
            loading={loading}
            selectedRows={selectedOrders}
            onQueryChange={handleQueryChange}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            onRowAction={handleRowAction}
            sortState={sortState}
            onSortChange={handleSortChange}
          />
          
          {/* Pagination */}
          <div className="mt-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.pageSize)}
              pageSize={pagination.pageSize}
              totalItems={pagination.total}
              itemsShown={orders.length}
              onPageChange={(page) => dispatch(setPageAction(page))}
              onPageSizeChange={(pageSize) => dispatch(setPageSizeAction(pageSize))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InTransitOrdersPage;
