"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, MapPin, Clock, Package, ChevronDown, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { createPickupRequest, selectPickupCreating, selectPickupCreatingError } from '@/app/redux/slices/pickupSlice';
import { WarehouseApi } from '@/lib/api/warehouse';

interface PickupLocation {
  id: string;
  name: string;
  address: string;
}

interface TimeSlot {
  id: string;
  name: string;
  time: string;
  icon: string;
}

interface Order {
  id: string;
  awb: string;
  manifestedDate: string;
  paymentMode: string;
}

const PickupRequestInterface: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectPickupCreating);
  const creatingError = useAppSelector(selectPickupCreatingError);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<PickupLocation | null>(null);
  const [selectedDate, setSelectedDate] = useState('19');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>({
    id: 'evening',
    name: 'Evening',
    time: '14:00:00 - 18:00:00',
    icon: '🌆'
  });
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  const pickupLocations: PickupLocation[] = [
    {
      id: 'class24',
      name: 'CLASS24 SSC',
      address: 'CLASS24 SSC, 201, Basant Vihar Colony, Tonk Road, Gopalpura Mode, Jaipur (Raj.) PIN - 302018, Jaipur - 302018'
    },
    {
      id: 'anil',
      name: 'Anil Rambhau Nawale',
      address: 'C-151, Mahal Yojana, Mahal Scheme, Pratap Nagar, Jaipur, Shri Kishanpura, Rajasthan, Jaipur - 302022'
    },
    {
      id: 'kartik',
      name: 'Kartik',
      address: 'WZ-44A, Ram Garh Colony, Basai Dara pur, Bali Nagar, Delhi -'
    },
    {
      id: 'candle-carve',
      name: 'Candle Carve',
      address: 'Candle Carve Workshop, Industrial Area, Jaipur, Rajasthan - 302013'
    }
  ];

  const timeSlots: TimeSlot[] = [
    {
      id: 'midday',
      name: 'Mid Day',
      time: '10:00:00 - 14:00:00',
      icon: '☀️'
    },
    {
      id: 'evening',
      name: 'Evening',
      time: '14:00:00 - 18:00:00',
      icon: '🌆'
    },
    {
      id: 'late-evening',
      name: 'Late Evening',
      time: '18:00:00 - 21:00:00',
      icon: '🌙'
    }
  ];

  const dates = [
    { day: 'Tue', date: '19', month: 'Aug' },
    { day: 'Wed', date: '20', month: 'Aug' },
    { day: 'Thu', date: '21', month: 'Aug' }
  ];

  const filteredLocations = pickupLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: PickupLocation) => {
    setSelectedLocation(location);
    setSearchQuery('');
  };

  // Load warehouses on component mount
  useEffect(() => {
    const loadWarehouses = async () => {
      setLoadingWarehouses(true);
      try {
        const response = await WarehouseApi.getUserWarehouses();
        setWarehouses(response.warehouses);
      } catch (error) {
        console.error('Failed to load warehouses:', error);
      } finally {
        setLoadingWarehouses(false);
      }
    };
    loadWarehouses();
  }, []);

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowTimeSlots(false);
  };

  const handleCreatePickupRequest = async () => {
    if (!selectedLocation) return;

    try {
      await dispatch(createPickupRequest({
        pickup_time: selectedTimeSlot.time.split(' - ')[0], // Use start time
        pickup_date: `2025-08-${selectedDate.padStart(2, '0')}`, // Format as YYYY-MM-DD
        pickup_address_id: selectedLocation.id,
        expected_package_count: 1 // Default value
      })).unwrap();

      // Redirect to pickup requests list on success
      router.push('/orders/pickup-requests');
    } catch (error) {
      console.error('Failed to create pickup request:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <ChevronLeft 
          className="w-6 h-6 mr-3 text-gray-600 cursor-pointer" 
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-semibold text-gray-800">Create Pickup Request</h1>
      </div>

      {/* Error Display */}
      {creatingError && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">{creatingError}</span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Pickup Details Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Package className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Pickup Details</h2>
          </div>

          {/* Pickup Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location
              <span className="ml-1 text-gray-400">ℹ️</span>
            </label>

            {!selectedLocation ? (
              <>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Select Pickup Location"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {searchQuery && (
                  <div className="relative mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search Pickup Locations"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {loadingWarehouses ? (
                  <div className="text-center py-4 text-gray-600">
                    <div className="inline-flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Loading warehouses...
                    </div>
                  </div>
                ) : warehouses.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {warehouses.map((warehouse) => (
                      <div
                        key={warehouse.id}
                        className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleLocationSelect({
                          id: warehouse.id,
                          name: warehouse.warehouse_name,
                          address: `${warehouse.pickup_address}, ${warehouse.pickup_city}, ${warehouse.pickup_state} - ${warehouse.pickup_pincode}`
                        })}
                      >
                        <div className="font-medium text-gray-800 mb-1">{warehouse.warehouse_name}</div>
                        <div className="text-sm text-gray-600">
                          {warehouse.pickup_address}, {warehouse.pickup_city}, {warehouse.pickup_state} - {warehouse.pickup_pincode}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No warehouses found. Please add a warehouse first.
                  </div>
                )}

                <button className="text-blue-600 text-sm font-medium flex items-center">
                  <span className="mr-2">+</span>
                  Add Pickup Location
                </button>
              </>
            ) : (
              <div className="p-3 bg-white border border-gray-300 rounded-lg mb-4">
                <div className="font-medium text-gray-800">{selectedLocation.name}</div>
                <div className="text-sm text-gray-600 mt-1">{selectedLocation.address}</div>
              </div>
            )}
          </div>

          {/* Pickup Date */}
          {selectedLocation && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Pickup will be attempted during the selected Pickup Slot
              </p>

              <div className="flex space-x-4 mb-4">
                {dates.map((date) => (
                  <div
                    key={date.date}
                    className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                      selectedDate === date.date
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDate(date.date)}
                  >
                    <div className="text-sm text-gray-600">{date.day}</div>
                    <div className={`text-2xl font-bold ${
                      selectedDate === date.date ? 'text-purple-600' : 'text-gray-800'
                    }`}>
                      {date.date}
                    </div>
                    <div className="text-sm text-gray-600">{date.month}</div>
                  </div>
                ))}
              </div>

              {/* Default Pickup Slot */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Pickup Slot
                </label>

                <div className="relative">
                  <div
                    className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => setShowTimeSlots(!showTimeSlots)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{selectedTimeSlot.icon}</span>
                      <span className="font-medium">{selectedTimeSlot.name}</span>
                      <span className="ml-2 text-gray-600">{selectedTimeSlot.time}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                      showTimeSlots ? 'rotate-180' : ''
                    }`} />
                  </div>

                  {showTimeSlots && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      {timeSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => handleTimeSlotSelect(slot)}
                        >
                          <span className="mr-3">{slot.icon}</span>
                          <div>
                            <div className="font-medium">{slot.name}</div>
                            <div className="text-sm text-gray-600">{slot.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    id="saveDefault"
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="saveDefault" className="ml-2 text-sm text-gray-700">
                    Save this as the default pickup slot for this location
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders Section */}
        {selectedLocation && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Package className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Orders ready to be shipped from {selectedLocation.name}
              </h2>
              <span className="ml-1 text-gray-400">ℹ️</span>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 border-b text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  ORDER ID AND AWB
                </div>
                <div>MANIFESTED DATE</div>
                <div>PAYMENT MODE</div>
              </div>

              <div className="p-8 text-center text-gray-500">
                No Records Found
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            className={`px-6 py-2 rounded-lg text-white transition-colors ${
              selectedLocation && !creating
                ? 'bg-gray-800 hover:bg-gray-900' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedLocation || creating}
            onClick={handleCreatePickupRequest}
          >
            {creating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              'Create Pickup Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupRequestInterface;