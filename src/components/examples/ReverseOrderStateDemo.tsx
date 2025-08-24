"use client";
import React, { useState } from 'react';
import ReverseStateAwareTable from '@/components/tables/ReverseStateAwareTable';
import { ReverseOrderState } from '@/config/reverseOrderStateConfig';

const ReverseOrderStateDemo: React.FC = () => {
  const [currentState, setCurrentState] = useState<ReverseOrderState>('pending');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Mock data for different states
  const mockData = [
    {
      id: '#12345',
      awbNumber: '33081910266980',
      orderDate: '13 Aug',
      orderTime: '11:39 PM',
      manifestedDate: '13 Aug',
      manifestedTime: '11:39 PM',
      initiatedDate: '13 Aug',
      initiatedTime: '11:35 PM',
      deliveredDate: '14 Aug',
      deliveredTime: '2:45 PM',
      cancelledDate: '11 Aug',
      pickupAddress: 'Umang (Ahmedabad - 382470)',
      returnAddress: 'Dholkee (Jaipur - 302029)',
      deliveryAddress: 'Dholkee (Jaipur - 302029)',
      pickupContact: '+91 9876543210',
      returnContact: '+91 9876543210',
      packageType: 'Electronics',
      weight: '1.2 kg',
      dimensions: '25x20x15 cm',
      declaredValue: '2500.00',
      transportMode: 'Surface',
      paymentMode: 'Pickup',
      paymentStatus: 'Pending',
      noOfItems: 1,
      itemCount: 1,
      deliveryAttempts: 0,
      lastUpdateDate: '16 Aug, 2025',
      lastUpdateStatus: 'Vehicle Departed at Bangalore_Hoskote_GW (Karnataka)',
      customerName: 'John Doe',
      customerPhone: '+91 9876543210',
      deliveryConfirmation: 'Confirmed',
      deliveredBy: 'Delivery Partner',
      cancellationReason: 'Customer request',
      orderPrice: '550.00',
      productPrice: '550.00'
    },
    {
      id: '#12346', 
      awbNumber: '33081910266965',
      orderDate: '13 Aug',
      orderTime: '11:29 PM',
      manifestedDate: '13 Aug',
      manifestedTime: '11:29 PM',
      initiatedDate: '13 Aug',
      initiatedTime: '11:29 PM',
      deliveredDate: '14 Aug',
      deliveredTime: '3:15 PM',
      cancelledDate: '11 Aug',
      pickupAddress: 'Khushali (Thane - 400602)',
      returnAddress: 'Upper & Bottom (UB) (Jaipur - 302015)',
      deliveryAddress: 'Upper & Bottom (UB) (Jaipur - 302015)',
      pickupContact: '+91 9876543211',
      returnContact: '+91 9876543211',
      packageType: 'Clothing',
      weight: '0.8 kg',
      dimensions: '30x25x10 cm',
      declaredValue: '1200.00',
      transportMode: 'Surface',
      paymentMode: 'Pickup',
      paymentStatus: 'Paid',
      noOfItems: 2,
      itemCount: 2,
      deliveryAttempts: 1,
      lastUpdateDate: '17 Aug, 2025',
      lastUpdateStatus: 'Vehicle Departed at Bhiwandi_Lonad_GW (Maharashtra)',
      customerName: 'Jane Smith',
      customerPhone: '+91 9876543211',
      deliveryConfirmation: 'Confirmed',
      deliveredBy: 'Delivery Partner',
      cancellationReason: 'Product defective',
      orderPrice: '1200.00',
      productPrice: '1200.00'
    }
  ];

  const handleQueryChange = (params: Record<string, any>) => {
    console.log('Query changed:', params);
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows(prev => 
      prev.includes(rowId) ? prev.filter(id => id !== rowId) : [...prev, rowId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedRows(selected ? mockData.map(item => item.id) : []);
  };

  const handleRowAction = (action: string, rowId: string) => {
    console.log(`Action ${action} on row ${rowId}`);
  };

  const handleSortChange = (columnId: string, direction: 'asc' | 'desc') => {
    console.log(`Sort ${columnId} ${direction}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reverse Order Dynamic Table Demo</h1>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">State Selector:</h3>
        <div className="flex flex-wrap gap-2">
          {(['pending', 'ready_for_pickup', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'all_shipments'] as ReverseOrderState[]).map((state) => (
            <button
              key={state}
              onClick={() => setCurrentState(state)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                currentState === state
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
              }`}
            >
              {state.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Current State: {currentState}</h3>
        <p className="text-sm text-gray-600">
          Each state displays different columns and filters. Try switching between states to see how the table adapts.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <ReverseStateAwareTable
          state={currentState}
          data={mockData}
          loading={false}
          selectedRows={selectedRows}
          onQueryChange={handleQueryChange}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          onRowAction={handleRowAction}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">Features Demonstrated:</h3>
        <ul className="list-disc list-inside text-green-800 text-sm space-y-1">
          <li>✅ Dynamic columns based on order state</li>
          <li>✅ State-specific filters (try searching and filtering)</li>
          <li>✅ Responsive design with mobile-friendly breakpoints</li>
          <li>✅ Row actions that vary by state</li>
          <li>✅ Sorting support on applicable columns</li>
          <li>✅ Row selection with bulk operations</li>
          <li>✅ Loading states and error handling</li>
          <li>✅ Auto-population and validation integration</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Selected Rows:</h3>
        <p className="text-sm text-gray-600">
          {selectedRows.length > 0 ? selectedRows.join(', ') : 'None selected'}
        </p>
      </div>
    </div>
  );
};

export default ReverseOrderStateDemo;
