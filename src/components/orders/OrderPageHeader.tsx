"use client";
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface OrderPageHeaderProps {
  title: string;
  searchPlaceholder?: string;
  showBulkEdit?: boolean;
  showBulkCreate?: boolean;
  showCreateOrder?: boolean;
  bulkEditText?: string;
  bulkCreateText?: string;
  createOrderText?: string;
  onBulkEditClick?: () => void;
  onBulkCreateClick?: () => void;
  onCreateOrderClick?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const OrderPageHeader: React.FC<OrderPageHeaderProps> = ({
  title,
  searchPlaceholder = "Search multiple AWBs",
  showBulkEdit = true,
  showBulkCreate = true,
  showCreateOrder = true,
  bulkEditText = "Edit orders in bulk",
  bulkCreateText = "Create orders in bulk",
  createOrderText = "Create order",
  onBulkEditClick,
  onBulkCreateClick,
  onCreateOrderClick,
  searchValue,
  onSearchChange,
}) => {
  const router = useRouter();

  const handleBulkEditClick = () => {
    if (onBulkEditClick) {
      onBulkEditClick();
    } else {
      // Default behavior - could be customized
      console.log('Bulk edit clicked');
    }
  };

  const handleBulkCreateClick = () => {
    if (onBulkCreateClick) {
      onBulkCreateClick();
    } else {
      // Default behavior
      router.push('/orders/bulk-upload');
    }
  };

  const handleCreateOrderClick = () => {
    if (onCreateOrderClick) {
      onCreateOrderClick();
    } else {
      // Default behavior
      router.push('/orders/create');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative">
            
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full sm:w-64 lg:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          {showBulkEdit && (
            <button
              onClick={handleBulkEditClick}
              className="w-full sm:w-auto bg-white text-black px-4 py-2 rounded-lg border flex items-center justify-center space-x-2 whitespace-nowrap hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{bulkEditText}</span>
              <span className="sm:hidden">Bulk Edit</span>
            </button>
          )}
          
          {showBulkCreate && (
            <button
              onClick={handleBulkCreateClick}
              className="w-full sm:w-auto bg-white text-black px-4 py-2 rounded-lg border flex items-center justify-center space-x-2 whitespace-nowrap hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{bulkCreateText}</span>
              <span className="sm:hidden">Bulk Create</span>
            </button>
          )}
          
          {showCreateOrder && (
            <button
              onClick={handleCreateOrderClick}
              className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{createOrderText}</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPageHeader;
