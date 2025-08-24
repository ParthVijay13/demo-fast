"use client";
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Search, Filter, Calendar, MapPin, Truck, ChevronDown, MoreHorizontal,
  AlertCircle, Clock, Copy, FileText, Printer, X, Plus
} from 'lucide-react';
import { OrderState, ORDER_STATE_CONFIG, FilterConfig } from '@/config/orderStateConfig';

interface StateAwareTableProps {
  state: OrderState;
  data: any[];
  loading?: boolean;
  selectedRows?: string[];
  onQueryChange: (params: Record<string, any>) => void;
  onRowSelect?: (rowId: string) => void;
  onSelectAll?: (selected: boolean) => void;
  onRowAction?: (action: string, rowId: string) => void;
  sortState?: { columnId: string; direction: 'asc'|'desc' };
  onSortChange?: (columnId: string, direction: 'asc'|'desc') => void;
}

// Mock data sources for filters
const FILTER_OPTIONS = {
  pickupLocations: [
    "Jaipur-MaheshNagar-302015", 
    "Bangalore-Koramangala-560034", 
    "Mumbai-Bandra-400050"
  ],
  transportModes: ["Surface", "Air"],
  paymentModes: [
    { value: 'cod', label: 'Cash on Delivery' },
    { value: 'prepaid', label: 'Prepaid' }
  ],
  zones: [
    { value: 'zone-a', label: 'Zone A' },
    { value: 'zone-b', label: 'Zone B' }, 
    { value: 'zone-c', label: 'Zone C' },
    { value: 'zone-d', label: 'Zone D' }
  ],
  shipmentStatuses: [
    { value: 'in-transit', label: 'In-transit' },
    { value: 'out-for-delivery', label: 'Out for Delivery' }
  ],
  more: [
    { value: 'urgent', label: 'Urgent' },
    { value: 'fragile', label: 'Fragile' }
  ]
};

const StateAwareTable: React.FC<StateAwareTableProps> = ({
  state,
  data,
  loading = false,
  selectedRows = [],
  onQueryChange,
  onRowSelect,
  onSelectAll,
  onRowAction,
  sortState,
  onSortChange
}) => {
  const config = ORDER_STATE_CONFIG[state];
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { columns, filters, rowActions = [], defaultSort } = config;
  console.log(columns,filters,rowActions,defaultSort);
  // Memoized columns for performance
  const memoizedColumns = useMemo(() => columns, [columns]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterId: string, value: string) => {
    const newFilters = { ...filterValues, [filterId]: value };
    setFilterValues(newFilters);
    
    // Convert filter values to query params based on FilterConfig
    const queryParams: Record<string, any> = {};
    filters.forEach(filter => {
      if (filter.id === 'search') {
        queryParams.search = newFilters.search || '';
      } else if (filter.id === 'date') {
        queryParams[filter.param] = newFilters[filter.param] || '';
      } else if (filter.id === 'select') {
        queryParams[filter.param] = newFilters[filter.param] || '';
      }
    });
    
    onQueryChange(queryParams);
  }, [filterValues, filters, onQueryChange]);

  // Handle sorting
  const handleSort = useCallback((columnId: string) => {
    const currentDirection = sortState?.columnId === columnId && sortState?.direction === 'asc' ? 'desc' : 'asc';
    onSortChange?.(columnId, currentDirection);
  }, [sortState, onSortChange]);

  // Get options for a filter
  const getFilterOptions = (optionsSource: string) => {
    switch (optionsSource) {
      case 'pickupLocations':
        return FILTER_OPTIONS.pickupLocations.map(loc => ({ value: loc, label: loc }));
      case 'transportModes':
        return FILTER_OPTIONS.transportModes.map(mode => ({ value: mode.toLowerCase(), label: mode }));
      case 'paymentModes':
        return FILTER_OPTIONS.paymentModes;
      case 'zones':
        return FILTER_OPTIONS.zones;
      case 'shipmentStatuses':
        return FILTER_OPTIONS.shipmentStatuses;
      case 'more':
        return FILTER_OPTIONS.more;
      default:
        return [];
    }
  };

  // Render filter component based on FilterConfig
  const renderFilter = (filter: FilterConfig, index: number) => {
    if (filter.id === 'search') {
      return (
        <div key={filter.id} className="relative flex-1 min-w-0 sm:min-w-64">
          <input
            type="text"
            placeholder={filter.placeholder}
            value={filterValues.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      );
    } else if (filter.id === 'date') {
      return (
        <div key={filter.param} className="relative w-full sm:w-auto sm:min-w-40">
          <select
            value={filterValues[filter.param] || ''}
            onChange={(e) => handleFilterChange(filter.param, e.target.value)}
            className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">{filter.label}</option>
            {filter.kind === 'single' ? (
              <>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
              </>
            ) : (
              <>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
                <option value="custom">Custom Range</option>
              </>
            )}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      );
    } else if (filter.id === 'select') {
      const options = getFilterOptions(filter.optionsSource);
      return (
        <div key={filter.param} className="relative w-full sm:w-auto sm:min-w-40">
          <select
            value={filterValues[filter.param] || ''}
            onChange={(e) => handleFilterChange(filter.param, e.target.value)}
            className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">{filter.label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      );
    }
    return null;
  };

  // Render action buttons for each row
  const renderRowActions = (row: any) => {
    if (!rowActions.length) return null;

    return (
      <div className="flex items-center space-x-1 justify-end">
        {rowActions.includes('getAwb') && (
          <button
            onClick={() => onRowAction?.('getAwb', row.id)}
            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 whitespace-nowrap"
            title="Get AWB"
          >
            <span className="hidden lg:inline">Get AWB</span>
            <span className="lg:hidden">AWB</span>
          </button>
        )}
        {rowActions.includes('printLabel') && (
          <button
            onClick={() => onRowAction?.('printLabel', row.id)}
            className="px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50 whitespace-nowrap"
            title="Print Label"
          >
            <Printer className="w-3 h-3" />
          </button>
        )}
        {rowActions.includes('addToPickup') && (
          <button
            onClick={() => onRowAction?.('addToPickup', row.id)}
            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 whitespace-nowrap"
            title="Add to Pickup"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
        {rowActions.includes('cloneOrder') && (
          <button
            onClick={() => onRowAction?.('cloneOrder', row.id)}
            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
            title="Clone Order"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
        {rowActions.includes('cancelShipment') && (
          <button
            onClick={() => onRowAction?.('cancelShipment', row.id)}
            className="px-2 py-1 text-xs text-red-600 hover:text-red-800 whitespace-nowrap"
            title="Cancel Shipment"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        {rowActions.includes('initiateReturn') && (
          <button
            onClick={() => onRowAction?.('initiateReturn', row.id)}
            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
            title="Initiate Return"
          >
            Return
          </button>
        )}
        {rowActions.includes('printPOD') && (
          <button
            onClick={() => onRowAction?.('printPOD', row.id)}
            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
            title="Print POD"
          >
            <FileText className="w-3 h-3" />
          </button>
        )}
        <button 
          className="p-1 hover:bg-gray-100 rounded"
          title="More actions"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    );
  };

  // Show special notices for certain states
  const renderStateNotice = () => {
    if (state === 'pending') {
      return (
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
      );
    }

    if (state === 'ready_to_ship') {
      return (
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
      );
    }

    return null;
  };

  // Get visible filters (first 3 for main row, rest for expanded)
  const mainFilters = filters.slice(0, 4);
  const expandedFilters = filters.slice(4);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* State-specific notices */}
      {renderStateNotice()}

      {/* Filters */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 flex-1 min-w-0">
            {mainFilters.map((filter, index) => renderFilter(filter, index))}
          </div>

          {/* More Filters Toggle */}
          {expandedFilters.length > 0 && (
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center justify-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 whitespace-nowrap flex-shrink-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">More Filters</span>
              <span className="sm:hidden">Filters</span>
              <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showMoreFilters && expandedFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {expandedFilters.map((filter, index) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.id === 'select' ? filter.label : filter.id === 'date' ? filter.label : 'Filter'}
                  </label>
                  {renderFilter(filter, index + mainFilters.length)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-w-full">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                {memoizedColumns.map((column) => (
                  <th
                    key={column.id}
                    onClick={column.sortable ? () => handleSort(column.id) : undefined}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    } ${column.hideOn?.includes('sm') ? 'hidden sm:table-cell' : ''} ${column.hideOn?.includes('md') ? 'hidden md:table-cell' : ''}`}
                    style={{ 
                      minWidth: column.minWidth,
                      maxWidth: column.minWidth ? `${column.minWidth + 50}px` : 'auto'
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="truncate">{column.header}</span>
                      {column.sortable && sortState?.columnId === column.id && (
                        <span className="text-blue-600 flex-shrink-0">
                          {sortState.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={memoizedColumns.length + 2} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={memoizedColumns.length + 2} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-12 w-12 text-gray-300 mb-2" />
                    <span>No orders found</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={`${row.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => onRowSelect?.(row.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  {memoizedColumns.map((column) => (
                    <td
                      key={`${column.id}-${index}`}
                      className={`px-4 py-4 ${column.hideOn?.includes('sm') ? 'hidden sm:table-cell' : ''} ${column.hideOn?.includes('md') ? 'hidden md:table-cell' : ''}`}
                      style={{ 
                        minWidth: column.minWidth,
                        maxWidth: column.minWidth ? `${column.minWidth + 50}px` : '300px'
                      }}
                    >
                      <div className="overflow-hidden">
                        {column.accessor(row)}
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {renderRowActions(row)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StateAwareTable);
