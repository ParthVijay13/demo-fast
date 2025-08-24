"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, Truck, Zap, MapPin, User, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { createForwardOrder, fetchOrders } from '@/app/redux/slices/ordersSlice';
import type { CreateForwardOrderRequest, CreateOrderItemRequest } from '@/types/backend';
import UnifiedAddressInput, { AddressData, AddressErrors } from '@/components/form/UnifiedAddressInput';

interface PickupAddress {
  id: string;
  warehouse_name: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_pincode: string;
}

const CreateOrderFormNew: React.FC = () => {
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
  
  // Dynamic delivery addresses
  const [deliveryAddresses, setDeliveryAddresses] = useState<AddressData[]>([
    {
      id: '1',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India',
      warehouse_name: ''
    }
  ]);

  // Billing details
  const [sameBillingShipping, setSameBillingShipping] = useState(true);
  const [billingAddress1, setBillingAddress1] = useState('');
  const [billingAddress2, setBillingAddress2] = useState('');
  const [billingPincode, setBillingPincode] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingCountry, setBillingCountry] = useState('India');

  // Package details
  const [packageWeight, setPackageWeight] = useState<number>(0);
  const [packageLength, setPackageLength] = useState<number>(0);
  const [packageBreadth, setPackageBreadth] = useState<number>(0);
  const [packageHeight, setPackageHeight] = useState<number>(0);

  // Payment and shipping
  const [paymentMode, setPaymentMode] = useState<'PREPAID' | 'COD'>('PREPAID');
  const [codAmount, setCodAmount] = useState<number>(0);
  const [shipmentMode, setShipmentMode] = useState<'SURFACE' | 'EXPRESS'>('SURFACE');

  // Order items
  const [orderItems, setOrderItems] = useState<CreateOrderItemRequest[]>([
    {
      item_name: '',
      sku_code: '',
      category: '',
      product_image: '',
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
    setDeliveryAddresses(prev => 
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
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India',
      warehouse_name: ''
    };
    setDeliveryAddresses(prev => [...prev, newAddress]);
  };

  const handleRemoveAddress = (id: string) => {
    setDeliveryAddresses(prev => prev.filter(addr => addr.id !== id));
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
    if (!selectedPickupAddress) newErrors.pickupAddress = 'Pickup address is required';
    if (!consigneeName.trim()) newErrors.consigneeName = 'Consignee name is required';
    if (!consigneePhone.trim()) newErrors.consigneePhone = 'Consignee phone is required';
    if (!/^\d{10}$/.test(consigneePhone)) newErrors.consigneePhone = 'Phone must be 10 digits';

    // Validate delivery addresses
    let hasValidAddress = false;
    deliveryAddresses.forEach(address => {
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
      newErrors.deliveryAddresses = 'At least one valid delivery address is required';
    }

    if (paymentMode === 'COD' && codAmount <= 0) {
      newErrors.codAmount = 'COD amount is required for COD orders';
    }

    if (packageWeight <= 0) newErrors.packageWeight = 'Package weight is required';

    const hasValidItem = orderItems.some(item => 
      item.item_name.trim() && item.sku_code.trim() && item.category.trim() && (item.price||0) > 0
    );
    if (!hasValidItem) newErrors.orderItems = 'At least one valid item is required';

    setErrors(newErrors);
    setAddressErrors(newAddressErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newAddressErrors).length === 0;
  };

  const handleSubmit = async (manifest: boolean = false) => {
    if (!validateForm()) return;

    const validItems = orderItems.filter(item => 
      item.item_name.trim() && item.sku_code.trim() && item.category.trim()
    );

    // Use the first valid delivery address for now (in future, could create multiple orders or extend API)
    const primaryAddress = deliveryAddresses.find(addr => 
      addr.addressLine1.trim() && addr.pincode.trim()
    ) || deliveryAddresses[0];

    const orderData: CreateForwardOrderRequest = {
      order_id: orderId.trim(),
      consignee_name: consigneeName,
      consignee_phone: consigneePhone,
      consingee_email: consigneeEmail || undefined,
      consignee_address_line_1: primaryAddress.addressLine1,
      consignee_address_line_2: primaryAddress.addressLine2 || undefined,
      consignee_state: primaryAddress.state,
      consignee_city: primaryAddress.city,
      consignee_country: primaryAddress.country,
      consignee_pincode: primaryAddress.pincode,
      same_billing_shipping: sameBillingShipping,
      billing_address_line_1: sameBillingShipping ? primaryAddress.addressLine1 : billingAddress1,
      billing_address_line_2: sameBillingShipping ? primaryAddress.addressLine2 : billingAddress2,
      billing_state: sameBillingShipping ? primaryAddress.state : billingState,
      billing_city: sameBillingShipping ? primaryAddress.city : billingCity,
      billing_country: sameBillingShipping ? primaryAddress.country : billingCountry,
      billing_pincode: sameBillingShipping ? primaryAddress.pincode : billingPincode,
      package_weight: packageWeight,
      package_length: packageLength || undefined,
      package_breadth: packageBreadth || undefined,
      package_height: packageHeight || undefined,
      payment_mode: paymentMode,
      cod_amount: paymentMode === 'COD' ? codAmount : undefined,
      shipment_mode: shipmentMode,
      order_items: validItems,
      pickup_address_id: selectedPickupAddress
    };

    try {
      await dispatch(createForwardOrder({ orderData, manifest })).unwrap();
      // Refresh orders list
      await dispatch(fetchOrders());
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, {
      item_name: '',
      sku_code: '',
      category: '',
      product_image: '',
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

  const calculateChargeableWeight = () => {
    if (!packageLength || !packageBreadth || !packageHeight || !packageWeight) return '-- kg';
    
    const volumetric = shipmentMode === 'SURFACE' 
      ? (packageLength * packageBreadth * packageHeight) / 5000
      : (packageLength * packageBreadth * packageHeight) / 4000;
    
    return `${Math.round(Math.max(volumetric, packageWeight) * 1000) / 1000} kg`;
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
        <button
      onClick={() => router.back()}
      className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2 text-gray-700 
                 shadow-sm hover:bg-gray-200 hover:shadow-md active:scale-95 
                 transition-all duration-200"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">Back</span>
    </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Forward Order</h1>
          <p className="text-gray-600">Create a new shipment order</p>
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
                    Order ID *
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.orderId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter unique order ID"
                  />
                  {errors.orderId && <p className="text-red-500 text-sm mt-1">{errors.orderId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Address *
                  </label>
                  <select
                    value={selectedPickupAddress}
                    onChange={(e) => setSelectedPickupAddress(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.pickupAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select pickup address</option>
                    {pickupAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.warehouse_name} - {address.pickup_city}
                      </option>
                    ))}
                  </select>
                  {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
                </div>
              </div>
            </section>

            {/* Customer Details */}
            <section className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Details
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.consigneeName ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.consigneePhone ? 'border-red-500' : 'border-gray-300'
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

            {/* Dynamic Delivery Addresses */}
            <UnifiedAddressInput
              title="Delivery Addresses"
              addresses={deliveryAddresses}
              errors={addressErrors}
              onAddressChange={handleAddressChange}
              onAddAddress={handleAddAddress}
              onRemoveAddress={handleRemoveAddress}
              maxAddresses={5}
              showCountry={true}
              showSaveButton={true}
            />
            {errors.deliveryAddresses && (
              <p className="text-red-500 text-sm mt-2">{errors.deliveryAddresses}</p>
            )}

            {/* Order Items */}
            <section className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
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
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                    <div className="md:col-span-2">
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
                        Price *
                      </label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product image *
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
                    onChange={(e) => setPackageWeight(parseFloat(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.packageWeight ? 'border-red-500' : 'border-gray-300'
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
                      onChange={(e) => setPackageLength(parseFloat(e.target.value))}
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
                      onChange={(e) => setPackageBreadth(parseFloat(e.target.value))}
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
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Chargeable Weight:</span>
                    <span className="text-sm text-gray-900 font-semibold">{calculateChargeableWeight()}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Details */}
            <section className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('PREPAID')}
                      className={`p-3 border-2 rounded-lg text-center ${
                        paymentMode === 'PREPAID'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Prepaid
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('COD')}
                      className={`p-3 border-2 rounded-lg text-center ${
                        paymentMode === 'COD'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      COD
                    </button>
                  </div>
                </div>
                {paymentMode === 'COD' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      COD Amount *
                    </label>
                    <input
                      type="number"
                      value={codAmount}
                      onChange={(e) => setCodAmount(parseFloat(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.codAmount ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter COD amount"
                      min="0"
                      step="0.01"
                    />
                    {errors.codAmount && <p className="text-red-500 text-sm mt-1">{errors.codAmount}</p>}
                  </div>
                )}
              </div>
            </section>

            {/* Shipping Mode */}
            <section className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Mode</h2>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setShipmentMode('SURFACE')}
                  className={`p-4 border-2 rounded-lg text-left ${
                    shipmentMode === 'SURFACE'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Surface</span>
                  </div>
                  <div className="text-sm text-gray-600">Standard delivery</div>
                </button>
                <button
                  type="button"
                  onClick={() => setShipmentMode('EXPRESS')}
                  className={`p-4 border-2 rounded-lg text-left ${
                    shipmentMode === 'EXPRESS'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Express</span>
                  </div>
                  <div className="text-sm text-gray-600">Fast delivery</div>
                </button>
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
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={creating}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Order Only'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={creating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create & Manifest'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderFormNew;
