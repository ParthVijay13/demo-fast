"use client";
import React, { useState, useCallback, useEffect } from 'react';
import {
  ChevronDown, Bell, Zap, AlertCircle
} from 'lucide-react';
import type { Order, OrderStatus } from '@/types/orders';
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
import OrdersTable from '@/components/ui/table/OrdersTable';
import Pagination from '@/components/ui/pagination/Pagination';
import OrderFilters from '@/components/orders/OrderFilters';
import OrderStatesSidebar from '@/components/orders/OrderStatesSidebar';
import { useRouter } from 'next/navigation';
import OrderPageHeader from '@/components/orders/OrderPageHeader';

// Mock data for dropdowns
const pickupLocations = ["Jaipur-MaheshNagar-302015", "Bangalore-Koramangala-560034", "Mumbai-Bandra-400050"];
const transportModes = ["Surface", "Air"];

export default function ForwardOrdersContent({ initialStatus }: { initialStatus?: OrderStatus | 'all-shipments' }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const ordersState = useAppSelector(selectOrdersState);
  const { items: orders, pagination, loading, error, filters, generatingAwbId, createOrderModal } = ordersState;

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [transportMode, setTransportMode] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [zone, setZone] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  useEffect(() => {
    if (initialStatus && initialStatus !== filters.status) {
      dispatch(setStatusAction(initialStatus));
    }
  }, [dispatch, initialStatus, filters.status]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch, filters.search, filters.status, pagination.page, pagination.pageSize]);

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

  const handleGenerateAwb = useCallback(async (orderId: string) => {
    await dispatch(generateAwbThunk(orderId));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-auto">
      {/* Header */}
      <OrderPageHeader
        title="Forward Orders"
        searchValue={filters.search}
        onSearchChange={(value) => dispatch(setSearchAction(value))}
        bulkCreateText="Create Bulk Order"
        showBulkEdit={false}
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
          <OrderFilters
            searchTerm={filters.search}
            dateRange={dateRange}
            pickupLocation={pickupLocation}
            transportMode={transportMode}
            paymentMode={paymentMode}
            zone={zone}
            showMoreFilters={showMoreFilters}
            currentStatus={filters.status}
            pickupLocations={pickupLocations}
            transportModes={transportModes}
            onSearchChange={(value) => dispatch(setSearchAction(value))}
            onDateRangeChange={setDateRange}
            onPickupLocationChange={setPickupLocation}
            onTransportModeChange={setTransportMode}
            onPaymentModeChange={setPaymentMode}
            onZoneChange={setZone}
            onToggleMoreFilters={() => setShowMoreFilters(!showMoreFilters)}
          />

          {/* Orders Table */}
          <div className="mt-4 overflow-hidden">
            <OrdersTable
              orders={orders}
              loading={loading}
              selectedOrders={selectedOrders}
              generatingAwbId={generatingAwbId}
              currentStatus={filters.status}
              onSelectAll={handleSelectAll}
              onSelectOrder={handleSelectOrder}
              onGenerateAwb={handleGenerateAwb}
            />
            
            {/* Pagination */}
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

      {/* Removed modal in favor of dedicated page */}
    </div>
  );
}
