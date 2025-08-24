"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  Filter,
  RotateCcw,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import {
  selectReverseOrdersState,
  setStatus as setStatusAction,
  fetchReverseOrders
} from '@/app/redux/slices/reverseOrdersSlice';
import type { ReverseOrderStatus } from '@/types/orders';

interface ReverseOrdersSidebarProps {
  onStatusChange?: (status: ReverseOrderStatus | 'all-shipments') => void;
}

const ReverseOrdersSidebar: React.FC<ReverseOrdersSidebarProps> = ({ onStatusChange }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { statusCounts, filters } = useAppSelector(selectReverseOrdersState);

  const handleStatusClick = (status: ReverseOrderStatus | 'all-shipments') => {
    dispatch(setStatusAction(status));
    // Immediately refetch with updated filters -> calls backend getOrders with query params
    dispatch(fetchReverseOrders());
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  const menuItems = [
    {
      name: "Pending",
      icon: <Clock className="w-5 h-5" />,
      status: "pending" as const,
      path: "/orders/reverse/pending",
      count: statusCounts.pending,
      color: "text-yellow-600"
    },
    {
      name: "Ready for Pickup", 
      icon: <Package className="w-5 h-5" />,
      status: "ready-for-pickup" as const,
      path: "/orders/reverse/ready-for-pickup",
      count: statusCounts['ready-for-pickup'],
      color: "text-blue-600"
    },
    {
      name: "In-Transit",
      icon: <TrendingUp className="w-5 h-5" />,
      status: "in-transit" as const,
      path: "/orders/reverse/in-transit",
      count: statusCounts['in-transit'],
      color: "text-purple-600"
    },
    {
      name: "Delivered",
      icon: <CheckCircle className="w-5 h-5" />,
      status: "delivered" as const,
      path: "/orders/reverse/delivered",
      count: statusCounts.delivered,
      color: "text-green-600"
    },
    {
      name: "Cancelled",
      icon: <AlertCircle className="w-5 h-5" />,
      status: "cancelled" as const,
      path: "/orders/reverse/cancelled",
      count: statusCounts.cancelled,
      color: "text-red-600"
    },
    {
      name: "All Shipments",
      icon: <Filter className="w-5 h-5" />, 
      status: "all-shipments" as const,
      path: "/orders/reverse",
      count: statusCounts['all-shipments'],
      color: "text-gray-600"
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <RotateCcw className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Reverse Orders</h2>
        </div>
        
        {/* Create Reverse Order Button */}
        <Link
          href="/orders/reverse/create"
          className="w-full mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Create Reverse Order</span>
        </Link>

        {/* Order States */}
        <nav className="space-y-1">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            ORDER STATES
          </h3>
          
          {menuItems.map((item) => {
            const isActive = filters.status === item.status || pathname === item.path;
            return (
              <div key={item.status}>
                <Link
                  href={item.path}
                  onClick={() => handleStatusClick(item.status)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-blue-600' : item.color}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isActive 
                      ? 'text-blue-700 bg-blue-100' 
                      : 'text-gray-400 bg-gray-100'
                  }`}>
                    {item.count}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>
        
        {/* Learn More Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-semibold">?</span>
            </div>
            <span className="text-sm font-medium text-blue-900">Learn More</span>
          </div>
          <p className="text-xs text-blue-700 mb-3">
            Understand how reverse orders work and how to manage them effectively.
          </p>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Read Documentation →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReverseOrdersSidebar;
