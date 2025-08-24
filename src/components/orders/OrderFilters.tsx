"use client";
import React from 'react';
import { Search, Filter, Calendar, MapPin, Truck, ChevronDown, AlertCircle, Clock } from 'lucide-react';

interface OrderFiltersProps {
  searchTerm: string;
  dateRange: string;
  pickupLocation: string;
  transportMode: string;
  paymentMode: string;
  zone: string;
  showMoreFilters: boolean;
  currentStatus: string;
  pickupLocations: string[];
  transportModes: string[];
  onSearchChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onPickupLocationChange: (value: string) => void;
  onTransportModeChange: (value: string) => void;
  onPaymentModeChange: (value: string) => void;
  onZoneChange: (value: string) => void;
  onToggleMoreFilters: () => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchTerm,
  dateRange,
  pickupLocation,
  transportMode,
  paymentMode,
  zone,
  showMoreFilters,
  currentStatus,
  pickupLocations,
  transportModes,
  onSearchChange,
  onDateRangeChange,
  onPickupLocationChange,
  onTransportModeChange,
  onPaymentModeChange,
  onZoneChange,
  onToggleMoreFilters
}) => {
  const getFilterPlaceholder = () => {
    switch (currentStatus) {
      case 'pending':
        return "Search upto 250 Orders";
      case 'ready-to-ship':
        return "Search upto 100 AWBs";
      case 'ready-for-pickup':
        return "Search upto 100 AWBs";
      case 'in-transit':
        return "Search upto 100 AWBs";
      case 'delivered':
        return "Search upto 100 AWBs";
      case 'rto-in-transit':
        return "Search upto 100 AWBs";
      default:
        return "Search upto 100 AWBs";
    }
  };

  const getDateFieldLabel = () => {
    switch (currentStatus) {
      case 'pending':
        return "Date Range";
      case 'ready-to-ship':
        return "Manifested Date";
      case 'ready-for-pickup':
        return "Manifested Date";
      case 'in-transit':
        return "Shipment Status";
      case 'delivered':
        return "Delivered Date";
      case 'rto-in-transit':
        return "Returned Date";
      default:
        return "Manifested Date";
    }
  };

  const getAdditionalFilters = () => {
    const commonFilters = [
      {
        key: 'pickupLocation',
        label: 'Pickup Location',
        value: pickupLocation,
        onChange: onPickupLocationChange,
        icon: MapPin,
        options: pickupLocations.map(loc => ({ value: loc, label: loc }))
      },
      {
        key: 'transportMode',
        label: 'Transport Mode',
        value: transportMode,
        onChange: onTransportModeChange,
        icon: Truck,
        options: transportModes.map(mode => ({ value: mode, label: mode }))
      }
    ];

    // Add Payment Mode for most statuses except pending
    if (currentStatus !== 'pending') {
      commonFilters.push({
        key: 'paymentMode',
        label: 'Payment Mode',
        value: paymentMode,
        onChange: onPaymentModeChange,
        icon: null,
        options: [
          { value: 'cod', label: 'Cash on Delivery' },
          { value: 'prepaid', label: 'Prepaid' }
        ]
      });
    }

    // Add status-specific filters
    if (currentStatus === 'in-transit') {
      commonFilters.splice(1, 0, {
        key: 'estimatedDelivery',
        label: 'Estimated Delivery Date',
        value: '',
        onChange: () => {},
        icon: Calendar,
        options: []
      });
    }

    if (currentStatus === 'pending') {
      commonFilters.push({
        key: 'zone',
        label: 'Zone',
        value: zone,
        onChange: onZoneChange,
        icon: null,
        options: [
          { value: 'zone-a', label: 'Zone A' },
          { value: 'zone-b', label: 'Zone B' },
          { value: 'zone-c', label: 'Zone C' },
          { value: 'zone-d', label: 'Zone D' }
        ]
      });
    }

    return commonFilters;
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Special notices for certain statuses */}
      {currentStatus === 'pending' && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-red-700">
                Please fill missing/ invalid order details to generate AWB Number
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                <a href="#" className="whitespace-nowrap font-medium text-red-700 hover:text-red-600">
                  View Incomplete orders →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStatus === 'ready-to-ship' && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                Schedule pickup within 21:47 Hrs to ensure a pickup happens tomorrow.
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                <button className="whitespace-nowrap font-medium text-white bg-gray-800 px-3 py-1 rounded text-xs hover:bg-gray-900">
                  Add All Orders to Pickup
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 flex-1 min-w-0">
            {/* Search AWB */}
            <div className="relative flex-1 min-w-0 sm:min-w-64">
              <input
                type="text"
                placeholder={getFilterPlaceholder()}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Date/Status field */}
            <div className="relative w-full sm:w-auto sm:min-w-40">
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">{getDateFieldLabel()}</option>
                {currentStatus === 'in-transit' ? (
                  <>
                    <option value="in-transit">In-transit</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                  </>
                ) : (
                  <>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 days</option>
                    <option value="last30days">Last 30 days</option>
                  </>
                )}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Additional filters based on status */}
            {getAdditionalFilters().slice(0, 3).map((filter) => (
              <div key={filter.key} className="relative w-full sm:w-auto sm:min-w-40">
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">{filter.label}</option>
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {filter.icon && <filter.icon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />}
                {!filter.icon && <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />}
              </div>
            ))}
          </div>

          {/* More Filters */}
          <button
            onClick={onToggleMoreFilters}
            className="flex items-center justify-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 whitespace-nowrap flex-shrink-0"
          >
            <Filter className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">More Filters</span>
            <span className="sm:hidden">Filters</span>
            <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showMoreFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {getAdditionalFilters().slice(3).map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderFilters;
