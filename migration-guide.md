# State-Aware Table Migration Guide

## Overview

This refactoring successfully creates a single, reusable State-aware Table that renders per-state columns and filters. The behavior is centralized in a configuration map, making adding/removing states completely data-driven with no conditionals scattered across components.

## Implementation Summary

### 1. `orderStateConfig.ts` - Complete Configuration System

**Location**: `/src/config/orderStateConfig.ts`

**Key Features**:
- ✅ Centralized config map keyed by `OrderState`
- ✅ Complete column configurations with responsive rules (`hideOn`)
- ✅ Dynamic filter configurations with proper param mapping
- ✅ Row action specifications per state
- ✅ Default sorting configurations
- ✅ All 7 states fully configured according to screenshots

**Example Configuration**:
```typescript
in_transit: {
  columns: [
    { id: 'orderAwb', header: 'ORDER ID AND AWB', accessor: renderOrderIdCell, sortable: true },
    { id: 'addresses', header: 'PICKUP AND DELIVERY ADDRESS', accessor: renderAddressesCell },
    { id: 'status', header: 'STATUS', accessor: renderStatusCell, sortable: true },
    // ... more columns with responsive hideOn rules
  ],
  filters: [
    { id: 'search', placeholder: 'Search upto 100 AWBs', scope: 'awbs', max: 100 },
    { id: 'select', label: 'Shipment Status', param: 'shipment_status', optionsSource: 'shipmentStatuses' },
    // ... more filters with proper param mapping
  ],
  rowActions: ['cloneOrder', 'cancelShipment'],
  defaultSort: { columnId: 'estimatedDeliveryDate', direction: 'asc' }
}
```

### 2. `StateAwareTable.tsx` - Dynamic Component

**Location**: `/src/components/tables/StateAwareTable.tsx`

**Key Features**:
- ✅ Single component that works for all states
- ✅ Reads `ORDER_STATE_CONFIG[state]` to render columns/filters/actions
- ✅ Emits query params based on `FilterConfig.param` fields
- ✅ Uses `useMemo` for derived columns and `React.memo` for performance
- ✅ Responsive column hiding based on `hideOn` rules
- ✅ State-specific notices (e.g., pending warning, ready-to-ship timer)

**Usage**:
```tsx
<StateAwareTable
  state="in_transit"
  data={orders}
  onQueryChange={handleQueryChange}
  // ... other props
/>
```

### 3. Migration Example - In Transit Page

**Location**: `/src/app/(admin)/orders/in-transit/page.tsx`

**Key Features**:
- ✅ Replaced hardcoded `OrdersTable` with `StateAwareTable`
- ✅ Removed manual filter management - now handled by config
- ✅ Clean, minimal page implementation
- ✅ Preserved all existing functionality (pagination, selection, actions)

## Per-State Specifications Compliance

### ✅ 1. Pending State
- **Columns**: ORDER ID, PICKUP AND DELIVERY ADDRESS, PRODUCT DETAILS, PACKAGING DETAILS, DELIVERY DETAILS
- **Filters**: Search (250 Orders), Date Range, Pickup Location, Transport Mode, Zone, More Filters
- **Actions**: Get AWB
- **Responsive**: Hides less critical columns on small screens

### ✅ 2. Ready To Ship State  
- **Columns**: ORDER ID AND AWB, MANIFESTED DATE, PICKUP AND DELIVERY ADDRESS, TRANSPORT MODE AND ZONE, PAYMENT MODE
- **Filters**: Search (100 AWBs), Manifested Date, Pickup Location, Transport Mode, Payment Mode, More Filters
- **Actions**: Print Label, Add to Pickup
- **Notice**: Schedule pickup timer banner

### ✅ 3. Ready For Pickup State
- **Columns**: Same as Ready To Ship
- **Filters**: Same as Ready To Ship  
- **Actions**: Print Label only
- **Features**: Overflow menu as shown in screenshots

### ✅ 4. In Transit State
- **Columns**: ORDER ID AND AWB, PICKUP AND DELIVERY ADDRESS, STATUS, PROMISED DELIVERY DATE, ESTIMATED DELIVERY, LAST UPDATE, TRANSPORT MODE AND ZONE, PAYMENT MODE
- **Filters**: Search (100 AWBs), Shipment Status, Estimated Delivery Date, Pickup Location, Transport Mode, Payment Mode
- **Actions**: Clone Order, Cancel Shipment

### ✅ 5. RTO In-Transit State
- **Columns**: ORDER ID AND AWB, RETURNED ON, STATE, PICKUP AND DELIVERY ADDRESS, TRANSPORT MODE AND ZONE, PAYMENT MODE
- **Filters**: Search (100 AWBs), Returned Date, Pickup Location, Transport Mode, Payment Mode
- **Actions**: Clone Order

### ✅ 6. Delivered State
- **Columns**: ORDER ID AND AWB, DELIVERED ON, PICKUP AND DELIVERY ADDRESS, TRANSPORT MODE AND ZONE, PAYMENT MODE, DELIVERED WEIGHT
- **Filters**: Search (100 AWBs), Delivered Date, Pickup Location, Transport Mode, Payment Mode  
- **Actions**: Print POD, Clone Order, Initiate Return

### ✅ 7. All Shipments State
- **Columns**: ORDER ID AND AWB, MANIFESTED DATE, STATUS, PICKUP AND DELIVERY ADDRESS, TRANSPORT MODE AND ZONE, LAST UPDATE, PAYMENT MODE
- **Filters**: Search (100 AWBs), Manifested Date, Shipment Status, Pickup Location, Transport Mode, Payment Mode
- **Actions**: Clone Order

## Technical Implementation Details

### State Management Integration
The new system integrates seamlessly with existing Redux store:
- Filter changes emit query params via `onQueryChange`
- Sorting changes are handled via `onSortChange` 
- Row actions are handled via `onRowAction`
- Selection state is managed via `onRowSelect`/`onSelectAll`

### Performance Optimizations
- `useMemo` for computed columns to avoid recalculation
- `React.memo` on StateAwareTable component
- `useCallback` for event handlers to prevent unnecessary re-renders
- Lazy loading of filter options

### Responsive Design
- Columns have `hideOn: ['sm', 'md']` rules for mobile/tablet
- Filters collapse into "More Filters" expansion on smaller screens
- Search placeholders change per state (250 Orders vs 100 AWBs)

### API Integration
Filter selections map to query parameters using the `param` field from `FilterConfig`:
- `estimated_delivery_date` for estimated delivery filter
- `shipment_status` for shipment status filter  
- `pickup_location` for pickup location filter
- etc.

## Migration Path for Other Pages

To migrate any other order state page:

1. **Replace** the existing table component:
   ```tsx
   // Old
   <OrdersTable currentStatus={status} ... />
   
   // New  
   <StateAwareTable state="ready_to_ship" ... />
   ```

2. **Remove** manual filter management:
   ```tsx
   // Remove these state variables:
   const [dateRange, setDateRange] = useState('');
   const [pickupLocation, setPickupLocation] = useState('');
   // etc.
   
   // Remove OrderFilters component
   ```

3. **Update** query parameter handling:
   ```tsx
   const handleQueryChange = useCallback((params: Record<string, any>) => {
     // Update your API call with the new params
     fetchOrdersWithFilters(params);
   }, []);
   ```

That's it! The configuration system handles everything else automatically.

## Benefits Achieved

✅ **Single source of truth** - All column/filter/action config in one place  
✅ **Zero conditionals** - No scattered if/switch statements  
✅ **Data-driven** - Adding new states requires only config changes  
✅ **Consistent UX** - Same interaction patterns across all states  
✅ **Performance** - Optimized rendering with memoization  
✅ **Responsive** - Built-in mobile/tablet support  
✅ **Maintainable** - Clear separation of concerns  
✅ **Type-safe** - Full TypeScript coverage  

The refactoring successfully centralizes all state-specific behavior while preserving the exact UI and functionality shown in the provided screenshots.
