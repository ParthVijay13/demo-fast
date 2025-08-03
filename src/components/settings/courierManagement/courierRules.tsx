"use client"
import React, { useState } from 'react';
import { Plus, X, ChevronDown, Package, MapPin, DollarSign, Truck, Info, Check } from 'lucide-react';

// Type definitions
interface ConditionOption {
  value: string;
  label: string;
}

interface ConditionTypeConfig {
  label: string;
  icon: any;
  options: ConditionOption[];
  hasNumericInput?: boolean;
}

interface Condition {
  id: number;
  type: string;
  value: string;
  numericValue?: string;
}

interface SavedRule {
  ruleName: string;
  conditions: Condition[];
}

type ViewType = 'list' | 'create';
type TabType = 'active' | 'inactive' | 'archived' | 'all';

// Condition configurations
const CONDITION_TYPES: Record<string, ConditionTypeConfig> = {
  weight: {
    label: 'Weight Category',
    icon: Package,
    hasNumericInput: true,
    options: [
      { value: 'greater-than-equal', label: 'Greater than Equals to (>=)' },
      { value: 'less-than-equal', label: 'Less than Equals to (<=)' },
      { value: 'equals-to', label: 'Equals to (=)' }
    ]
  },
  state: {
    label: 'State',
    icon: MapPin,
    options: [
      { value: 'local', label: 'Local' },
      { value: 'national', label: 'National' },
      { value: 'international', label: 'International' }
    ]
  },
  city: {
    label: 'city',
    icon: MapPin,
    options: [
      { value: 'local', label: 'Local' },
      { value: 'national', label: 'National' },
      { value: 'international', label: 'International' }
    ]
  },
  orderValue: {
    label: 'Order Value',
    icon: DollarSign,
    options: [
      { value: 'below-50', label: 'Below $50' },
      { value: '50-100', label: '$50 - $100' },
      { value: 'above-100', label: 'Above $100' }
    ]
  },
  shippingMethod: {
    label: 'Payment Mode',
    icon: Truck,
    options: [
      { value: 'COD', label: ' COD' },
      { value: 'Prepaid', label: 'Prepaid' },
      // { value: 'overnight', label: 'Overnight Delivery' }
    ]
  }
  
};

const CourierRules: React.FC = () => {
  const [view, setView] = useState<ViewType>('list');
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [ruleName, setRuleName] = useState<string>('');
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [animating, setAnimating] = useState<boolean>(false);

  const tabs: string[] = ['Active', 'Inactive', 'Archived', 'All'];

  const handleAddNewRule = (): void => {
    setAnimating(true);
    setTimeout(() => {
      setView('create');
      setAnimating(false);
    }, 150);
  };

  const handleCancel = (): void => {
    setAnimating(true);
    setTimeout(() => {
      setView('list');
      setRuleName('');
      setConditions([]);
      setAnimating(false);
    }, 150);
  };

  const handleAddCondition = (): void => {
    const newCondition: Condition = {
      id: Date.now(),
      type: '',
      value: '',
      numericValue: ''
    };
    setConditions([...conditions, newCondition]);
  };

  const handleConditionTypeChange = (conditionId: number, type: string): void => {
    setConditions(conditions.map(c => 
      c.id === conditionId ? { ...c, type, value: '', numericValue: '' } : c
    ));
  };

  const handleConditionValueChange = (conditionId: number, value: string): void => {
    setConditions(conditions.map(c => 
      c.id === conditionId ? { ...c, value } : c
    ));
  };

  const handleNumericValueChange = (conditionId: number, numericValue: string): void => {
    setConditions(conditions.map(c => 
      c.id === conditionId ? { ...c, numericValue } : c
    ));
  };

  const handleRemoveCondition = (conditionId: number): void => {
    setConditions(conditions.filter(c => c.id !== conditionId));
  };

  const getAvailableConditionTypes = (excludeId: number): [string, ConditionTypeConfig][] => {
    const usedTypes = conditions
      .filter(c => c.id !== excludeId && c.type)
      .map(c => c.type);
    
    return Object.entries(CONDITION_TYPES)
      .filter(([key]) => !usedTypes.includes(key));
  };

  const handleSaveRule = (): void => {
    // Validate
    if (!ruleName.trim()) {
      alert('Please enter a rule name');
      return;
    }
    
    if (conditions.length === 0) {
      alert('Please add at least one condition');
      return;
    }

    // Check if all conditions are complete
    const incompleteConditions = conditions.filter(c => {
      if (!c.type || !c.value) return true;
      
      // For weight category, also check numeric value
      const conditionType = CONDITION_TYPES[c.type];
      if (conditionType.hasNumericInput && (!c.numericValue || c.numericValue.trim() === '')) {
        return true;
      }
      
      return false;
    });

    if (incompleteConditions.length > 0) {
      alert('Please complete all conditions');
      return;
    }

    // Save logic here
    const savedRule: SavedRule = { ruleName, conditions };
    console.log('Saving rule:', savedRule);
    alert('Rule saved successfully!');
    handleCancel();
  };

  const handleTabClick = (tab: string): void => {
    setActiveTab(tab.toLowerCase() as TabType);
  };

  const handleDropdownToggle = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const dropdown = event.currentTarget.nextElementSibling as HTMLElement;
    console.log("==========",dropdown)
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }

  };

  const handleConditionTypeSelect = (
    event: React.MouseEvent<HTMLButtonElement>, 
    conditionId: number, 
    key: string
  ): void => {
    console.log("this is the value of key",key);
    handleConditionTypeChange(conditionId, key);
    const dropdown = event.currentTarget.parentElement as HTMLElement;
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  const handleConditionValueSelect = (
    event: React.MouseEvent<HTMLButtonElement>, 
    conditionId: number, 
    value: string
  ): void => {
    handleConditionValueChange(conditionId, value);
    const dropdown = event.currentTarget.parentElement as HTMLElement;
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  if (view === 'list') {
    return (
      <div className={`min-h-screen bg-gray-50 p-6 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Courier Rules</h1>
            <p className="text-gray-600">Manage your shipping rules and conditions</p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.toLowerCase()
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No rules created yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first courier rule to automate shipping decisions based on your conditions.
              </p>
              <button
                onClick={handleAddNewRule}
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Rule
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // console.log("these are the vlaue of cond.",conditions)

  return (
    <div className={`min-h-screen bg-gray-50 p-6 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="mb-4 text-gray-600 hover:text-gray-900 transition-colors flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Back to Rules
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Rule</h1>
          <p className="text-gray-600">Define conditions for automatic courier selection</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Rule Name */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Rule Name
            </label>
            <input
              type="text"
              value={ruleName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRuleName(e.target.value)}
              placeholder="e.g., Express Delivery for High Value Orders"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          {/* Conditions Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Shipment Conditions</h3>
              <div className="group relative">
                <Info className="w-5 h-5 text-gray-400 cursor-help" />
                <div className="absolute right-0 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  Add conditions to determine when this rule should apply
                </div>
              </div>
            </div>

            {/* Condition List */}
            <div className="space-y-4">
              {conditions.map((condition, index) => {
                console.log('====',conditions)
                const availableTypes = getAvailableConditionTypes(condition.id);
                console.log("available types",availableTypes);
                
                
                
                const selectedType = CONDITION_TYPES[condition.type];
                // console.log("this is selected types ",selectedType)
                
                return (
                  <div key={condition.id} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 blur-xl"></div>
                    <div className="relative bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 group-hover:border-purple-300 group-hover:shadow-md">
                      <div className="flex items-start space-x-4">
                        <span className="text-sm font-medium text-gray-500 mt-2">
                          {index + 1}.
                        </span>
                        
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Condition Type Dropdown */}
                            <div className="relative">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Condition Type
                              </label>
                              <button
                                type="button"
                                className="w-full px-4 py-2.5 text-left bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 flex items-center justify-between"
                                onClick={handleDropdownToggle}
                              >
                                {condition.type ? (
                                  <span className="flex items-center">
                                    {selectedType && React.createElement(selectedType.icon, { className: "w-4 h-4 mr-2" })}
                                    {selectedType?.label}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">Select Condition Type</span>
                                )}
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              </button>
                              <div className="hidden absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                               
                                {availableTypes.map(([key, type]) => (
                                  
                                  <button
                                    key={key}
                                    onClick={(e) => handleConditionTypeSelect(e, condition.id, key)}
                                    className="w-full px-4 py-2.5 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center"
                                  >
                                    {React.createElement(type.icon, { className: "w-4 h-4 mr-2" })}
                                    {type.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Condition Value Dropdown */}
                            {condition.type && (
                              <div className="relative">
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  {selectedType.hasNumericInput ? 'Comparison Operator' : 'Condition Value'}
                                </label>
                                <button
                                  type="button"
                                  className="w-full px-4 py-2.5 text-left bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 flex items-center justify-between"
                                  onClick={handleDropdownToggle}
                                >
                                  {condition.value ? (
                                    <span>{selectedType.options.find(o => o.value === condition.value)?.label}</span>
                                  ) : (
                                    <span className="text-gray-500">Select {selectedType.hasNumericInput ? 'Operator' : 'Value'}</span>
                                  )}
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>
                                <div className="hidden absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                  {selectedType.options.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={(e) => handleConditionValueSelect(e, condition.id, option.value)}
                                      className="w-full px-4 py-2.5 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center justify-between"
                                    >
                                      {option.label}
                                      {condition.value === option.value && (
                                        <Check className="w-4 h-4 text-purple-600" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Numeric Input for Weight Category */}
                          {condition.type && condition.value && selectedType.hasNumericInput && (
                            <div className="mb-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Weight Value (kg)
                              </label>
                              <input
                                type="number"
                                value={condition.numericValue || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  handleNumericValueChange(condition.id, e.target.value)
                                }
                                placeholder="Enter weight in kg"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                min="0"
                                step="0.1"
                              />
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveCondition(condition.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Condition Button */}
              {conditions.length < Object.keys(CONDITION_TYPES).length && (
                <button
                  onClick={handleAddCondition}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-purple-600"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Another Condition
                </button>
              )}

              {conditions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No conditions added yet</p>
                  <button
                    onClick={handleAddCondition}
                    className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Condition
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRule}
              className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              Save Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourierRules;