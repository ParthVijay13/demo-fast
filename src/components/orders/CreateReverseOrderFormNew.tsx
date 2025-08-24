"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, RotateCcw, MapPin, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { createReverseOrder, fetchOrders } from '@/app/redux/slices/ordersSlice';
import type { CreateReverseOrderRequest, CreateOrderItemRequest } from '@/types/backend';
import UnifiedAddressInput, { AddressData, AddressErrors } from '@/components/form/UnifiedAddressInput';

interface PickupAddress {
  id: string;
  warehouse_name: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_pincode: string;
}

const CreateReverseOrderFormNew: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { creating } = useAppSelector((state) => state.orders);

  // Form state
  const [orderId, setOrderId] = useState('');
  const [pickupAddresses, setPickupAddresses] = useState<PickupAddress[]>([]);
  const [selectedPickupAddress, setSelectedPickupAddress] = useState<string>('');

  // Customer details
  const [consigneeName, setConsigneeName] = useState('');
  const [consigneePhone, setConsigneePhone] = useState('');
  const [consigneeEmail, setConsigneeEmail] = useState('');
  
  // Dynamic pickup addresses
  const [pickupAddressesData, setPickupAddressesData] = useState<AddressData[]>([
    {
      id: '1',
      warehouse_name:'',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India'
    }
  ]);

  // Package details
  const [packageWeight, setPackageWeight] = useState<number>(0);
  const [packageLength, setPackageLength] = useState<number>(0);
  const [packageBreadth, setPackageBreadth] = useState<number>(0);
  const [packageHeight, setPackageHeight] = useState<number>(0);

  // Reverse order specific
  const [reasonForReturn, setReasonForReturn] = useState('');

  // Order items
  const [orderItems, setOrderItems] = useState<CreateOrderItemRequest[]>([
    {
      item_name: '',
      sku_code: '',
      category: '',
      price: 0,
      discount: 0,
      is_fragile: false
    }
  ]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addressErrors, setAddressErrors] = useState<Record<string, AddressErrors>>({});

  // Load pickup addresses on component mount
  useEffect(() => {
    // TODO: Fetch pickup addresses from backend
    // For now, using mock data
    setPickupAddresses([
      {
        id: '1',
        warehouse_name: 'Main Warehouse',
        pickup_address: '123 Main St',
        pickup_city: 'Mumbai',
        pickup_state: 'Maharashtra',
        pickup_pincode: '400001'
      }
    ]);
  }, []);

  // Address management functions
  const generateAddressId = () => `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddressChange = (id: string, field: keyof AddressData | string, value: string) => {
    setPickupAddressesData(prev => 
      prev.map(addr => 
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    );
    
    // Clear errors for the specific field
    if (addressErrors[id]?.[field as keyof AddressErrors]) {
      setAddressErrors(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: undefined
        }
      }));
    }
  };

  const handleAddAddress = () => {
    const newAddress: AddressData = {
      id: generateAddressId(),
      warehouse_name: '',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India'
    };
    setPickupAddressesData(prev => [...prev, newAddress]);
  };

  const handleRemoveAddress = (id: string) => {
    setPickupAddressesData(prev => prev.filter(addr => addr.id !== id));
    setAddressErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newAddressErrors: Record<string, AddressErrors> = {};

    if (!orderId.trim()) newErrors.orderId = 'Order ID is required';
    if (!selectedPickupAddress) newErrors.pickupAddress = 'Return pickup address is required';
    if (!consigneeName.trim()) newErrors.consigneeName = 'Customer name is required';
    if (!consigneePhone.trim()) newErrors.consigneePhone = 'Customer phone is required';
    if (!/^\d{10}$/.test(consigneePhone)) newErrors.consigneePhone = 'Phone must be 10 digits';

    // Validate pickup addresses
    let hasValidAddress = false;
    pickupAddressesData.forEach(address => {
      const addressError: AddressErrors = {};
      
      if (!address.addressLine1.trim()) {
        addressError.addressLine1 = 'Address line 1 is required';
      }
      if (!address.pincode.trim()) {
        addressError.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(address.pincode)) {
        addressError.pincode = 'Pincode must be 6 digits';
      }

      if (Object.keys(addressError).length > 0) {
        newAddressErrors[address.id] = addressError;
      } else {
        hasValidAddress = true;
      }
    });

    if (!hasValidAddress) {
      newErrors.pickupAddressesData = 'At least one valid pickup address is required';
    }

    if (packageWeight <= 0) newErrors.packageWeight = 'Package weight is required';

    const hasValidItem = orderItems.some(item =>
      item.item_name.trim() && item.sku_code.trim() && item.category.trim()
    );
    if (!hasValidItem) newErrors.orderItems = 'At least one valid item is required';

    setErrors(newErrors);
    setAddressErrors(newAddressErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newAddressErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const validItems = orderItems.filter(item =>
      item.item_name.trim() && item.sku_code.trim() && item.category.trim()
    );

    // Use the first valid pickup address
    const primaryAddress = pickupAddressesData.find(addr => 
      addr.addressLine1.trim() && addr.pincode.trim()
    ) || pickupAddressesData[0];

    const orderData: CreateReverseOrderRequest = {
      order_id: orderId.trim(),
      consignee_name: consigneeName,
      consignee_phone: consigneePhone,
      consingee_email: consigneeEmail || undefined,
      consignee_address_line_1: primaryAddress.addressLine1,
      consignee_address_line_2: primaryAddress.addressLine2 || undefined,
      consignee_pincode: primaryAddress.pincode,
      consignee_city: primaryAddress.city,
      consignee_state: primaryAddress.state,
      consignee_country: primaryAddress.country,
      reason_for_return: reasonForReturn || undefined,
      package_breadth: packageBreadth || undefined,
      package_height: packageHeight || undefined,
      package_length: packageLength || undefined,
      package_weight: packageWeight,
      order_items: validItems,
      pickup_address_id: selectedPickupAddress
    };

    try {
      await dispatch(createReverseOrder(orderData)).unwrap();
      // Refresh orders list
      await dispatch(fetchOrders());
      router.push('/orders/reverse');
    } catch (error) {
      console.error('Error creating reverse order:', error);
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, {
      item_name: '',
      sku_code: '',
      category: '',
      price: 0,
      discount: 0,
      is_fragile: false
    }]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (index: number, field: keyof CreateOrderItemRequest, value: any) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setOrderItems(updatedItems);
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <RotateCcw className="w-6 h-6" />
            Create Reverse Order
          </h1>
          <p className="text-gray-600">Create a return shipment order</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Order Details */}
            <section className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Order ID *
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.orderId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter unique return order ID"
                  />
                  {errors.orderId && <p className="text-red-500 text-sm mt-1">{errors.orderId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Location *
                  </label>
                  <select
                    value={selectedPickupAddress}
                    onChange={(e) => setSelectedPickupAddress(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.pickupAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Select return location</option>
                    {pickupAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.warehouse_name} - {address.pickup_city}
                      </option>
                    ))}
                  </select>
                  {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Return
                </label>
                <textarea
                  value={reasonForReturn}
                  onChange={(e) => setReasonForReturn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for return (optional)"
                  rows={3}
                />
              </div>
            </section>

            {/* Customer Details */}
            <section className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Details (Pickup From)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={consigneeName}
                    onChange={(e) => setConsigneeName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.consigneeName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter customer name"
                  />
                  {errors.consigneeName && <p className="text-red-500 text-sm mt-1">{errors.consigneeName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={consigneePhone}
                    onChange={(e) => setConsigneePhone(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.consigneePhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.consigneePhone && <p className="text-red-500 text-sm mt-1">{errors.consigneePhone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={consigneeEmail}
                    onChange={(e) => setConsigneeEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address (optional)"
                  />
                </div>
              </div>
            </section>

            {/* Dynamic Pickup Addresses */}
            <UnifiedAddressInput
              title="Pickup Addresses"
              addresses={pickupAddressesData}
              errors={addressErrors}
              onAddressChange={handleAddressChange}
              onAddAddress={handleAddAddress}
              onRemoveAddress={handleRemoveAddress}
              maxAddresses={5}
              showCountry={true}
              showSaveButton={true}
            />
            {errors.pickupAddressesData && (
              <p className="text-red-500 text-sm mt-2">{errors.pickupAddressesData}</p>
            )}

            {/* Return Items */}
            <section className="bg-white border rounded-lg p-6">

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Return Items
                </h2>
                <button
                  type="button"
                  onClick={addOrderItem}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Item
                </button>
              </div>
              {errors.orderItems && <p className="text-red-500 text-sm mb-4">{errors.orderItems}</p>}
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) => updateOrderItem(index, 'item_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter item name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU Code *
                      </label>
                      <input
                        type="text"
                        value={item.sku_code}
                        onChange={(e) => updateOrderItem(index, 'sku_code', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="SKU"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => updateOrderItem(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Category"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                      </label>
                      <input
                        type="text"
                        value={item.product_image}
                        onChange={(e) => updateOrderItem(index, 'product_image', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Image URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateOrderItem(index, 'price', parseInt(e.target.value) )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Price"
                        min=""
                        step=""
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount
                      </label>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateOrderItem(index, 'discount', parseFloat(e.target.value) )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Discount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Actions
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={item.is_fragile}
                          onChange={(e) => updateOrderItem(index, 'is_fragile', e.target.checked)}
                          className="rounded"
                        />
                        <label className="text-sm text-gray-700">Fragile</label>
                        {orderItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOrderItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Package Details */}
            <section className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Package Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    value={packageWeight}
                    onChange={(e) => setPackageWeight(parseFloat(e.target.value) )}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.packageWeight ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter weight"
                    min="0"
                    step="0.01"
                  />
                  {errors.packageWeight && <p className="text-red-500 text-sm mt-1">{errors.packageWeight}</p>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      value={packageLength}
                      onChange={(e) => setPackageLength(parseFloat(e.target.value) )}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="L"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Breadth (cm)
                    </label>
                    <input
                      type="number"
                      value={packageBreadth}
                      onChange={(e) => setPackageBreadth(parseFloat(e.target.value) )}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="B"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={packageHeight}
                      onChange={(e) => setPackageHeight(parseFloat(e.target.value) )}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="H"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Return Information */}
            <section className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Return Information</h2>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="font-medium text-orange-800 mb-2">Important Notes:</h3>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Return orders are automatically manifested</li>
                    <li>• Payment mode is set to PREPAID</li>
                    <li>• AWB will be generated automatically</li>
                    <li>• Customer will be notified about pickup</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t px-4 sm:px-6 py-4 mt-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={creating}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={creating}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Reverse Order & Manifest'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReverseOrderFormNew;
