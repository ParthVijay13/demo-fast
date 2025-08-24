"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/app/redux/store';
import { setStatus, fetchOrders } from '@/app/redux/slices/ordersSlice';
import type { OrderStatus } from '@/types/orders';

type StatusOption = OrderStatus | 'all-shipments';

interface OrderStatesSidebarProps {
  counts: Record<string, number>;
  onStatusChange?: (status: StatusOption) => void;
}

const items: { key: StatusOption; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'ready-to-ship', label: 'Ready To Ship' },
  { key: 'ready-for-pickup', label: 'Ready For Pickup' },
  { key: 'in-transit', label: 'In Transit' },
  { key: 'rto-in-transit', label: 'RTO In-Transit' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'all-shipments', label: 'All Shipments' },
];

const OrderStatesSidebar: React.FC<OrderStatesSidebarProps> = ({ counts, onStatusChange }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const handleStatusClick = (status: StatusOption) => {
    dispatch(setStatus(status));
    // Immediately refetch with updated filters -> calls backend getOrders with query params
    dispatch(fetchOrders());
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 text-xs font-semibold text-gray-500">ORDER STATES</div>
      <ul className="py-2">
        {items.map((it) => {
          const active = (it.key === 'all-shipments' && pathname === '/orders') ||
                         pathname === `/orders/${it.key}`;
          return (
            <li key={it.key}>
              <Link
                href={it.key === 'all-shipments' ? '/orders' : `/orders/${it.key}`}
                onClick={() => handleStatusClick(it.key)}
                className={`px-4 py-2 flex items-center justify-between text-sm hover:bg-gray-50 ${
                  active ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
                }`}
              >
                <span>{it.label}</span>
                <span className={`text-xs ${active ? 'text-blue-600' : 'text-gray-500'}`}>
                  {counts?.[it.key] ?? 0}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderStatesSidebar;


