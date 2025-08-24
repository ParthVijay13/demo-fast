"use client";
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Search, Filter, Calendar, MapPin, Truck, ChevronDown, MoreHorizontal,
  AlertCircle, Clock, Copy, FileText, Printer, X, Plus, Phone, Eye, Package
} from 'lucide-react';
import { ReverseOrderState, REVERSE_ORDER_STATE_CONFIG, ReverseFilterConfig } from '@/config/reverseOrderStateConfig';

interface ReverseStateAwareTableProps {
  state: ReverseOrderState;
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

// Filter options for reverse orders
const REVERSE_FILTER_OPTIONS = {
  returnLocations: [
    "Upper & Bottom (UB) (Jaipur - 302015)", 
    "Dholkee (Jaipur - 302029)", 
    "AakarTaro (Jaipur - 302020)"
  ],
  transportModes: ["Surface", "Air"],
  paymentModes: [
    { value: 'pickup', label: 'Pickup' },
    { value: 'cod', label: 'Cash on Delivery' },
    { value: 'prepaid', label: 'Prepaid' }
  ],
  zones: [
    { value: 'zone-s2', label: 'Zone S2' },
    { value: 'zone-s4', label: 'Zone S4' }, 
    { value: 'zone-s5', label: 'Zone S5' }
  ],
  shipmentStatuses: [
    { value: 'ready-for-pickup', label: 'Ready for Pickup' },
    { value: 'in-transit', label: 'In-transit' },
    { value: 'out-for-delivery', label: 'Out for Delivery' }
  ],
  customerLocations: [
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'pune', label: 'Pune' }
  ],
  paymentStatuses: [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ],
  more: [
    { value: 'fragile', label: 'Fragile' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'weekend-delivery', label: 'Weekend Delivery' }
  ]
};

const ReverseStateAwareTable: React.FC<ReverseStateAwareTableProps> = ({
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
  const config = REVERSE_ORDER_STATE_CONFIG[state];
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { columns, filters, rowActions = [], defaultSort } = config;

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
      case 'returnLocations':
        return REVERSE_FILTER_OPTIONS.returnLocations;
      case 'transportModes':
        return REVERSE_FILTER_OPTIONS.transportModes;
      case 'paymentModes':
        return REVERSE_FILTER_OPTIONS.paymentModes;
      case 'zones':
        return REVERSE_FILTER_OPTIONS.zones;
      case 'shipmentStatuses':
        return REVERSE_FILTER_OPTIONS.shipmentStatuses;
      case 'customerLocations':
        return REVERSE_FILTER_OPTIONS.customerLocations;
      case 'paymentStatuses':
        return REVERSE_FILTER_OPTIONS.paymentStatuses;
      case 'more':
        return REVERSE_FILTER_OPTIONS.more;
      default:
        return [];
    }
  };

  // Render filter component
  const renderFilter = (filter: ReverseFilterConfig, index: number) => {
    if (filter.id === 'search') {
      return (
        <div key={index} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={filter.placeholder}
            value={filterValues.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      );
    }

    if (filter.id === 'date') {
      const isRange = filter.kind === 'range';
      return (
        <div key={index} className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={filterValues[filter.param] || ''}
            onChange={(e) => handleFilterChange(filter.param, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">{filter.label}</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            {isRange && <option value="custom">Custom Range</option>}
          </select>
        </div>
      );
    }

    if (filter.id === 'select') {
      const options = getFilterOptions(filter.optionsSource);
      const Icon = filter.optionsSource === 'returnLocations' ? MapPin : 
                   filter.optionsSource === 'transportModes' ? Truck : 
                   Filter;

      return (
        <div key={index} className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <select
            value={filterValues[filter.param] || ''}
            onChange={(e) => handleFilterChange(filter.param, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">{filter.label}</option>
            {options.map((option, optIndex) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              return (
                <option key={optIndex} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
        </div>
      );
    }

    return null;
  };

  // Render row actions
  const renderRowActions = (row: any) => {
    if (!rowActions.length) return null;

    const getActionIcon = (action: string) => {
      switch (action) {
        case 'printLabel': return <Printer className="w-4 h-4" />;
        case 'printPOD': return <FileText className="w-4 h-4" />;
        case 'cloneOrder': return <Copy className="w-4 h-4" />;
        case 'addToPickup': return <Plus className="w-4 h-4" />;
        case 'cancelShipment': return <X className="w-4 h-4" />;
        case 'initiateReturn': return <AlertCircle className="w-4 h-4" />;
        case 'getAwb': return <Package className="w-4 h-4" />;
        case 'trackShipment': return <Eye className="w-4 h-4" />;
        case 'contactCustomer': return <Phone className="w-4 h-4" />;
        default: return <MoreHorizontal className="w-4 h-4" />;
      }
    };

    const getActionLabel = (action: string) => {
      switch (action) {
        case 'printLabel': return 'Print Label';
        case 'printPOD': return 'Print POD';
        case 'cloneOrder': return 'Clone Order';
        case 'addToPickup': return 'Add to Pickup';
        case 'cancelShipment': return 'Cancel Shipment';
        case 'initiateReturn': return 'Initiate Return';
        case 'getAwb': return 'Get AWB';
        case 'trackShipment': return 'Track Shipment';
        case 'contactCustomer': return 'Contact Customer';
        default: return action;
      }
    };

    return (
      <div className="flex items-center space-x-2">
        {rowActions.slice(0, 2).map((action, index) => (
          <button
            key={index}
            onClick={() => onRowAction?.(action, row.id)}
            className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 transition-colors"
            title={getActionLabel(action)}
          >
            {getActionIcon(action)}
            <span className="hidden sm:inline">{getActionLabel(action)}</span>
          </button>
        ))}
        
        {rowActions.length > 2 && (
          <div className="relative group">
            <button className="flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {rowActions.slice(2).map((action, index) => (
                <button
                  key={index}
                  onClick={() => onRowAction?.(action, row.id)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                >
                  {getActionIcon(action)}
                  <span>{getActionLabel(action)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Split filters into main and more filters
  const mainFilters = filters.slice(0, 4);
  const moreFilters = filters.slice(4);

  return (
    <div className="bg-white">
      {/* Filter Bar */}
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            {mainFilters.map((filter, index) => renderFilter(filter, index))}
            
            {moreFilters.length > 0 && (
              <button
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
        
        {/* More Filters Row */}
        {showMoreFilters && moreFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              {moreFilters.map((filter, index) => renderFilter(filter, index + mainFilters.length))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
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
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${column.hideOn?.includes('sm') ? 'hidden sm:table-cell' : ''} ${column.hideOn?.includes('md') ? 'hidden md:table-cell' : ''}`}
                    style={{ minWidth: column.minWidth }}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {column.sortable && sortState?.columnId === column.id && (
                        <span className="text-blue-500">
                          {sortState.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={memoizedColumns.length + 2} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={memoizedColumns.length + 2} className="px-4 py-8 text-center text-gray-500">
                  No records found
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

export default React.memo(ReverseStateAwareTable);
