"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const [itemName, setItemName] = useState('');
  const [skuCode, setSkuCode] = useState('');
  const [category, setCategory] = useState('');
  const [productImage, setProductImage] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!itemName || !skuCode || !category) {
      alert('Please fill in all required fields');
      return;
    }
    
    const productData = {
      item_name: itemName,
      sku_code: skuCode,
      category: category,
      product_image: productImage || null,
      price: price ? parseFloat(price) : null
    };
    
    console.log('Product data:', productData);
    // dispatch(addProduct(productData)); // Your Redux dispatch
    
    onClose();
    // Reset form
    setItemName('');
    setSkuCode('');
    setCategory('');
    setProductImage('');
    setPrice('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-transparent backdrop-blur-sm bg-opacity-50">
      <div className="relative w-full max-w-2xl mx-4 my-6">
        <div className="relative bg-white rounded-lg shadow-xl flex flex-col w-full outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Item Details</h2>
              <p className="text-sm text-gray-500 mt-1">Add item category and other details</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* First Row - Item Name and SKU Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU Code
                </label>
                <input
                  type="text"
                  value={skuCode}
                  onChange={(e) => setSkuCode(e.target.value)}
                  placeholder="Enter SKU code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Second Row - Category and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="For example, Electronics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Third Row - Product Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image <span className="text-gray-400 text-xs">Optional</span>
              </label>
              <input
                type="url"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                placeholder="Enter image URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;