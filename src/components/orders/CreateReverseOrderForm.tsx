"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RotateCcw, 
  Package, 
  Search, 
  MapPin, 
  User,
  Info,
  ArrowLeft,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import ItemDetailsModal, { ItemData } from '@/components/modals/ItemDetailsModal';

const CreateReverseOrderForm: React.FC = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [packageType, setPackageType] = useState('');
  const [packageWeight, setPackageWeight] = useState('');
  const [dimensions, setDimensions] = useState({
    length: '',
    breadth: '',
    height: ''
  });
  const [returnReason, setReturnReason] = useState('Damaged product');
  const [qualityNotes, setQualityNotes] = useState('');
  const [fragilePackage, setFragilePackage] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<ItemData[]>([]);

  const handleSubmit = async () => {
    setCreating(true);
    // Handle form submission
    setTimeout(() => {
      setCreating(false);
      router.push('/orders/reverse');
    }, 2000);
  };

  const calculateChargeableWeight = () => {
    const { length, breadth, height } = dimensions;
    const weight = packageWeight;
    if (!length || !breadth || !height || !weight) return '-- gm';
    
    const volumetric = (Number(length) * Number(breadth) * Number(height)) / 5000;
    const actual = Number(weight);
    return `${Math.round(Math.max(volumetric, actual))} gm`;
  };

  const handleAddItem = (itemData: ItemData) => {
    setAddedItems(prev => [...prev, itemData]);
  };

  const handleEditItem = (index: number, itemData: ItemData) => {
    setAddedItems(prev => prev.map((item, i) => i === index ? itemData : item));
  };

  const handleDeleteItem = (index: number) => {
    setAddedItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Create Reverse Order
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Order Details */}
            <section className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID <Info className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter Order ID / Reference Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    It is a unique identification number for an order.
                  </p>
                </div>
              </div>
            </section>

            {/* Item Details */}
            <section className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Item Details</h2>
                  <Info className="w-4 h-4 text-gray-400" />
                  {addedItems.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {addedItems.length} item{addedItems.length !== 1 ? 's' : ''} added
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsItemModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
              
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Enter atleast 3 letters to search by product name / SKU code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Added Items List */}
              {addedItems.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {addedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                            <p className="text-sm text-gray-500">SKU: {item.skuCode}</p>
                            <p className="text-sm text-gray-500">Category: {item.category}</p>
                            <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                // You can implement edit functionality here
                                console.log('Edit item', index);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit item"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(index)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* No Products Added State */
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-lg mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">No Products Added</p>
                  <p className="text-sm text-gray-400">Click &quot;Add Item&quot; to add products to this order</p>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fragile"
                  checked={fragilePackage}
                  onChange={(e) => setFragilePackage(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="fragile" className="ml-2 text-sm text-gray-700">
                  My package contains fragile items
                </label>
              </div>
            </section>

            {/* Other Details */}
            <section className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <RotateCcw className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Other Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for return
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="Damaged product">Damaged product</option>
                    <option value="Wrong item">Wrong item</option>
                    <option value="Size issue">Size issue</option>
                    <option value="Quality issue">Quality issue</option>
                    <option value="Not as described">Not as described</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes for quality analysis
                    <span className="text-gray-400 font-normal ml-2">Optional</span>
                  </label>
                  <textarea
                    value={qualityNotes}
                    onChange={(e) => setQualityNotes(e.target.value)}
                    placeholder="Add notes for quality analysis"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will help our field executive to check your item(s) based on your notes
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Return Details & Box Details */}
          <div className="space-y-6">
            {/* Return Details */}
            <section className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Return Details</h2>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="space-y-3 mb-4">
                <button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 ml-2 text-gray-700">Add Customer Details</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Return Location
                </label>
                <select
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select Return Location</option>
                  <option value="warehouse-1">Warehouse 1</option>
                  <option value="warehouse-2">Warehouse 2</option>
                  <option value="store-1">Store 1</option>
                </select>
              </div>
            </section>

            {/* Box Details */}
            <section className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Box Details</h2>
                </div>
                <button className="text-blue-600 text-sm hover:text-blue-700 flex items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Box
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">BOX 1</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Type
                  </label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select Package Type</option>
                    <option value="box">Box</option>
                    <option value="envelope">Envelope</option>
                    <option value="bag">Bag</option>
                    <option value="pouch">Pouch</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Select package which will be used to ship
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <input
                      type="number"
                      placeholder="1"
                      value={dimensions.length}
                      onChange={(e) => setDimensions(prev => ({ ...prev, length: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="1"
                      value={dimensions.breadth}
                      onChange={(e) => setDimensions(prev => ({ ...prev, breadth: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="1"
                      value={dimensions.height}
                      onChange={(e) => setDimensions(prev => ({ ...prev, height: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Length</span>
                    <span>Breadth</span>
                    <span>Height</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Length + Breadth + Height should be at-least 15 cm
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter package weight"
                      value={packageWeight}
                      onChange={(e) => setPackageWeight(e.target.value)}
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500 text-sm">gm</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Packaged weight should be at least 50 grams
                  </p>
                </div>

                {/* Estimated Cost Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">The estimated cost may vary from the final shipping cost based on the packaged dimensions & weight measured before delivery.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total Chargeable Weight</span>
                    <Info className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{calculateChargeableWeight()}</span>
                  </div>
                </div>

                {/* Shipping Cost Breakdown */}
                <div>
                  <button className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900">
                    <span>Shipping Cost Breakdown</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </button>
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
              onClick={handleSubmit}
              disabled={creating}
              className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base"
            >
              {creating ? 'Creating...' : 'Create & Manifest Reverse Order'}
            </button>
          </div>
        </div>

        {/* Item Details Modal */}
        <ItemDetailsModal
          isOpen={isItemModalOpen}
          onClose={() => setIsItemModalOpen(false)}
          onSave={handleAddItem}
        />
      </div>
    </div>
  );
};

export default CreateReverseOrderForm;
