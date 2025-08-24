"use client";
import React from 'react';
import {
  Search, Package, CreditCard, Truck, Zap, X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import {
  selectOrdersState,
  closeCreateOrderModal,
  setProductSearch,
  setPaymentMode,
  setPackageType,
  setPackageDimensions,
  setPackageWeight,
  setShippingMode,
  createOrder
} from '@/app/redux/slices/ordersSlice';

interface CreateOrderModalProps {
  isOpen: boolean;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen }) => {
  const dispatch = useAppDispatch();
  const { createOrderModal, creating } = useAppSelector(selectOrdersState);

  if (!isOpen) return null;

  const handleSubmit = async (manifestLater: boolean = false) => {
    // Create the order object from the form state
    const orderData = {
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      pickupAddress: 'Sample pickup address', // This would come from address form
      deliveryAddress: 'Sample delivery address', // This would come from address form
      productDetails: createOrderModal.selectedProducts.length > 0 
        ? createOrderModal.selectedProducts[0]?.name || 'Product' 
        : 'Sample Product',
      productPrice: 649.00,
      paymentMode: createOrderModal.paymentMode === 'Pre-Paid' ? 'Prepaid' as const : 'COD' as const,
      weight: createOrderModal.packageDetails.weight || '0.5 kg',
      packageType: createOrderModal.packageDetails.type,
      dimensions: {
        length: Number(createOrderModal.packageDetails.dimensions.length) || 10,
        breadth: Number(createOrderModal.packageDetails.dimensions.breadth) || 10,
        height: Number(createOrderModal.packageDetails.dimensions.height) || 5
      },
      status: 'pending' as const,
      zone: 'Zone B',
      transportMode: createOrderModal.shippingMode === 'SURFACE' ? 'Surface' as const : 'Air' as const
    };

    await dispatch(createOrder(orderData));
    
    if (!manifestLater) {
      // Also generate AWB if not manifesting later
    }
    
    dispatch(closeCreateOrderModal());
  };

  const calculateChargeableWeight = () => {
    const { length, breadth, height } = createOrderModal.packageDetails.dimensions;
    const weight = createOrderModal.packageDetails.weight;
    
    if (!length || !breadth || !height || !weight) return '-- gm';
    
    // Volumetric weight calculation (L*B*H/5000 for surface, L*B*H/4000 for air)
    const volumetricWeight = createOrderModal.shippingMode === 'SURFACE' 
      ? (Number(length) * Number(breadth) * Number(height)) / 5000
      : (Number(length) * Number(breadth) * Number(height)) / 4000;
    
    const actualWeight = Number(weight);
    const chargeableWeight = Math.max(volumetricWeight, actualWeight);
    
    return `${Math.round(chargeableWeight)} gm`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create Order</h2>
            <button
              onClick={() => dispatch(closeCreateOrderModal())}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Add products to be shipped */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Add products to be shipped</h3>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter atleast 3 letters to search by product name / SKU code"
                value={createOrderModal.productSearch}
                onChange={(e) => dispatch(setProductSearch(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Add the products you want to ship. This cannot be modified once the order is created.
            </p>
            
            {/* No Products Added */}
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-16 h-12 bg-gray-200 rounded"></div>
              </div>
              <p className="text-gray-500">No Products Added</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Details */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode
                </label>
                <select
                  value={createOrderModal.paymentMode}
                  onChange={(e) => dispatch(setPaymentMode(e.target.value as 'Pre-Paid' | 'COD'))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="Pre-Paid">Pre-Paid</option>
                  <option value="COD">Cash on Delivery (COD)</option>
                </select>
              </div>
            </div>

            {/* Package Details */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">BOX 1</h3>
              
              {/* Package Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Type
                </label>
                <select
                  value={createOrderModal.packageDetails.type}
                  onChange={(e) => dispatch(setPackageType(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select Package Type</option>
                  <option value="box">Box</option>
                  <option value="envelope">Envelope</option>
                  <option value="bag">Bag</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Select package which will be used to ship
                </p>
              </div>

              {/* Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="1"
                    value={createOrderModal.packageDetails.dimensions.length}
                    onChange={(e) => dispatch(setPackageDimensions({
                      ...createOrderModal.packageDetails.dimensions,
                      length: e.target.value
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="1"
                    value={createOrderModal.packageDetails.dimensions.breadth}
                    onChange={(e) => dispatch(setPackageDimensions({
                      ...createOrderModal.packageDetails.dimensions,
                      breadth: e.target.value
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="1"
                    value={createOrderModal.packageDetails.dimensions.height}
                    onChange={(e) => dispatch(setPackageDimensions({
                      ...createOrderModal.packageDetails.dimensions,
                      height: e.target.value
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Length + Breadth + Height should be at-least 15 cm
                </p>
              </div>

              {/* Package Weight */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package weight
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter package weight"
                    value={createOrderModal.packageDetails.weight}
                    onChange={(e) => dispatch(setPackageWeight(e.target.value))}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500 text-sm">gm</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Packaged weight should be at least 50 grams
                </p>
              </div>

              {/* Total Chargeable Weight */}
              <div className="mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Chargeable Weight</span>
                  <span className="text-sm text-gray-500">{calculateChargeableWeight()}</span>
                </div>
              </div>

              {/* Choose shipping mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose shipping mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => dispatch(setShippingMode('SURFACE'))}
                    className={`p-4 border-2 rounded-lg text-left ${
                      createOrderModal.shippingMode === 'SURFACE'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">SURFACE</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">₹ ---</div>
                  </button>
                  <button
                    onClick={() => dispatch(setShippingMode('EXPRESS'))}
                    className={`p-4 border-2 rounded-lg text-left ${
                      createOrderModal.shippingMode === 'EXPRESS'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">EXPRESS</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">₹ ---</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => dispatch(closeCreateOrderModal())}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={creating}
          >
            Cancel
          </button>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleSubmit(true)}
              disabled={creating}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create Order and Manifest Later'}
            </button>
            <button 
              onClick={() => handleSubmit(false)}
              disabled={creating}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create Order and Get AWB'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;
