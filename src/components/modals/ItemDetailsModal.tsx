"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: ItemData) => void;
}

export interface ItemData {
  itemName: string;
  skuCode: string;
  category: string;
  price: string;
  productImage?: string;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ItemData>({
    itemName: '',
    skuCode: '',
    category: '',
    price: '',
    productImage: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.itemName.trim() || !formData.skuCode.trim() || !formData.category.trim() || !formData.price.trim()) {
      return; // Form validation will handle error display
    }
    
    onSave(formData);
    setFormData({
      itemName: '',
      skuCode: '',
      category: '',
      price: '',
      productImage: ''
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      itemName: '',
      skuCode: '',
      category: '',
      price: '',
      productImage: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 transition-opacity" 
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-6">Add item category and other details</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                placeholder="Enter item name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* SKU Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU Code
              </label>
              <input
                type="text"
                value={formData.skuCode}
                onChange={(e) => setFormData(prev => ({ ...prev, skuCode: e.target.value }))}
                placeholder="Enter SKU code"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="For example, Electronics"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Enter price"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <span className="text-sm text-gray-500">Optional</span>
            </div>
            <input
              type="url"
              value={formData.productImage}
              onChange={(e) => setFormData(prev => ({ ...prev, productImage: e.target.value }))}
              placeholder="Enter Image URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemDetailsModal;
