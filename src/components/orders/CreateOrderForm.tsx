"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, CreditCard, Truck, Zap, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import {
  selectOrdersState,
  setProductSearch,
  setPaymentMode,
  setPackageType,
  setPackageDimensions,
  setPackageWeight,
  setShippingMode,
  createOrder
} from '@/app/redux/slices/ordersSlice';
import AddProductModal from './AddProductModal';

const CreateOrderForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { createOrderModal, creating } = useAppSelector(selectOrdersState);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSubmit = async (manifestLater: boolean) => {
    const orderData = {
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      pickupAddress: 'Sample pickup address',
      deliveryAddress: 'Sample delivery address',
      productDetails:
        createOrderModal.selectedProducts[0]?.name || 'Sample Product',
      productPrice: 649,
      paymentMode:
        createOrderModal.paymentMode === 'Pre-Paid' ? ('Prepaid' as const) : ('COD' as const),
      weight: createOrderModal.packageDetails.weight || '500',
      packageType: createOrderModal.packageDetails.type,
      dimensions: {
        length: Number(createOrderModal.packageDetails.dimensions.length) || 10,
        breadth: Number(createOrderModal.packageDetails.dimensions.breadth) || 10,
        height: Number(createOrderModal.packageDetails.dimensions.height) || 5,
      },
      status: 'pending' as const,
      zone: 'Zone B',
      transportMode:
        createOrderModal.shippingMode === 'SURFACE' ? ('Surface' as const) : ('Air' as const),
    };

    await dispatch(createOrder(orderData));
    router.push('/orders');
  };

  const chargeable = () => {
    const { length, breadth, height } = createOrderModal.packageDetails.dimensions;
    const weight = createOrderModal.packageDetails.weight;
    if (!length || !breadth || !height || !weight) return '-- gm';
    const volumetric =
      createOrderModal.shippingMode === 'SURFACE'
        ? (Number(length) * Number(breadth) * Number(height)) / 5000
        : (Number(length) * Number(breadth) * Number(height)) / 4000;
    const actual = Number(weight);
    return `${Math.round(Math.max(volumetric, actual))} gm`;
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left main form */}
        <div className="xl:col-span-2 space-y-6">
          {/* Order Details */}
          <section className="bg-white border rounded-lg p-4">
            
            <h2 className="text-base font-semibold mb-4">Order Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Channel</label>
                <input className="w-full px-3 py-2 border rounded-lg" placeholder="Select Channel" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input className="w-full px-3 py-2 border rounded-lg" placeholder="Enter Order ID / Reference Number" />
              </div>
            </div>
          </section>

          {/* Add products */}
          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Package className="w-5 h-5 text-gray-400" />
              <h3 className="text-base font-medium">Add products to be shipped</h3>
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
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add Item
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Add the products you want to ship. This cannot be modified once the order is created.
            </p>
            {createOrderModal.selectedProducts.length > 0 && (
              <div className="mt-4">
                <h4>Added Products:</h4>
                <ul>
                  {createOrderModal.selectedProducts.map((product, index) => (
                    <li key={index}>{product.name} - Qty: {product.quantity} - Price: {product.price}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-16 h-12 bg-gray-200 rounded" />
              </div>
              <p className="text-gray-500">No Products Added</p>
            </div>
          </section>
          {/* Payment Details */}
          <section className=' bg-white border rounded-lg p-4'>
            <div className=' flex flex-col justify-between'>
            <span className='text-base font-bold text-left px-4 py-2'>Payment Details</span>            
            
            <span className='text-sm font-medium text-gray-700 mb-2 px-4'>Payment Mode</span>
            <select className='w-[200px] px-3 py-2 border rounded-lg'>
              <option value="prepaid">Prepaid</option>
              <option value="cod">COD</option>
            </select>
            </div>

          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Delivery Details */}
          <section className="bg-white border rounded-lg p-4">
            <h2 className="text-base font-semibold mb-4">Delivery Details</h2>
            <div className="space-y-3">
              <button className="w-full px-3 py-2 border rounded-lg text-left">Select Facility</button>
              <button className="w-full px-3 py-2 border rounded-lg text-left">Add Seller Details</button>
              <button className="w-full px-3 py-2 border rounded-lg text-left">Add Customer Details</button>
            </div>
          </section>

          {/* Box Details */}
          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Box Details</h2>
              <button className="text-blue-600 text-sm">+ Add Box</button>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">BOX 1</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Type</label>
                <select
                  value={createOrderModal.packageDetails.type}
                  onChange={(e) => dispatch(setPackageType(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Package Type</option>
                  <option value="box">Box</option>
                  <option value="envelope">Envelope</option>
                  <option value="bag">Bag</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <input
                    type="number"
                    placeholder="1"
                    value={createOrderModal.packageDetails.dimensions.length}
                    onChange={(e) =>
                      dispatch(
                        setPackageDimensions({
                          ...createOrderModal.packageDetails.dimensions,
                          length: e.target.value,
                        })
                      )
                    }
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="1"
                    value={createOrderModal.packageDetails.dimensions.breadth}
                    onChange={(e) =>
                      dispatch(
                        setPackageDimensions({
                          ...createOrderModal.packageDetails.dimensions,
                          breadth: e.target.value,
                        })
                      )
                    }
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="1"
                    value={createOrderModal.packageDetails.dimensions.height}
                    onChange={(e) =>
                      dispatch(
                        setPackageDimensions({
                          ...createOrderModal.packageDetails.dimensions,
                          height: e.target.value,
                        })
                      )
                    }
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Length + Breadth + Height should be at-least 15 cm
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Package weight</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter package weight"
                    value={createOrderModal.packageDetails.weight}
                    onChange={(e) => dispatch(setPackageWeight(e.target.value))}
                    className="w-full px-3 py-2 pr-12 border rounded-lg"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500 text-sm">gm</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Chargeable Weight</span>
                  <span className="text-sm text-gray-500">{chargeable()}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose shipping mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </section>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t px-4 sm:px-6 py-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={creating}
        >
          Cancel
        </button>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleSubmit(true)}
            disabled={creating}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
          >
            {creating ? 'Creating...' : 'Create Order and Manifest Later'}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={creating}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base"
          >
            {creating ? 'Creating...' : 'Create Order and Get AWB'}
          </button>
        </div>
        </div>
      </div>
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default CreateOrderForm;


