"use client";
import React, { useState, useCallback, useEffect } from 'react';
import {
  Search, ChevronDown, Plus, Bell, Zap, AlertCircle
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
import ForwardOrdersContent from '@/components/orders/ForwardOrdersContent';

export default function ForwardOrdersPage() {
  return <ForwardOrdersContent initialStatus="all-shipments" />;
}
