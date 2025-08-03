"use client"
import React, { useState, useEffect } from 'react';
import { Package, MapPin, CreditCard, AlertCircle, Calculator } from 'lucide-react';

interface PincodeData {
  [key: string]: {
    city: string;
    state: string;
  };
}

const ShippingCalculator: React.FC = () => {
  const [shipmentType, setShipmentType] = useState<'forward' | 'return'>('forward');
  const [pickupPincode, setPickupPincode] = useState('302012');
  const [deliveryPincode, setDeliveryPincode] = useState('713207');
  const [actualWeight, setActualWeight] = useState('2');
  const [dimensions, setDimensions] = useState({ length: '20', width: '20', height: '19' });
  const [paymentType, setPaymentType] = useState<'cod' | 'prepaid'>('cod');
  const [shipmentValue, setShipmentValue] = useState('9000');
  const [isDangerous, setIsDangerous] = useState<'yes' | 'no'>('no');
  const [isSecure, setIsSecure] = useState<'yes' | 'no'>('no');
  const [showDimensions, setShowDimensions] = useState(true);
  const [volumetricWeight, setVolumetricWeight] = useState('1.52');
  const [applicableWeight, setApplicableWeight] = useState('2.00');

  // Pincode database
  const pincodeData: PincodeData = {
    '302012': { city: 'Jaipur', state: 'Rajasthan' },
    '302013': { city: 'Jaipur', state: 'Rajasthan' },
    '713207': { city: 'Durgapur', state: 'West Bengal' },
    '700001': { city: 'Kolkata', state: 'West Bengal' },
  };

  const [pickupLocation, setPickupLocation] = useState({ city: '', state: '' });
  const [deliveryLocation, setDeliveryLocation] = useState({ city: '', state: '' });

  // Update locations when pincodes change
  useEffect(() => {
    if (pincodeData[pickupPincode]) {
      setPickupLocation(pincodeData[pickupPincode]);
    } else {
      setPickupLocation({ city: '', state: '' });
    }
  }, [pickupPincode]);

  useEffect(() => {
    if (pincodeData[deliveryPincode]) {
      setDeliveryLocation(pincodeData[deliveryPincode]);
    } else {
      setDeliveryLocation({ city: '', state: '' });
    }
  }, [deliveryPincode]);

  // Calculate volumetric weight when dimensions change
  useEffect(() => {
    const { length, width, height } = dimensions;
    if (length && width && height) {
      // Using standard volumetric factor of 5000 for now
      const volumetricFactor = 5000;
      const vol = (parseFloat(length) * parseFloat(width) * parseFloat(height)) / volumetricFactor;
      setVolumetricWeight(vol.toFixed(2));
      
      // Applicable weight is the greater of actual weight and volumetric weight
      const actualWt = parseFloat(actualWeight) || 0;
      const applicableWt = Math.max(actualWt, vol);
      setApplicableWeight(applicableWt.toFixed(2));
    }
  }, [dimensions, actualWeight]);

  const handleCalculate = () => {
    // Calculate shipping logic here
    console.log('Calculating shipping...');
  };

  const handleReset = () => {
    setShipmentType('forward');
    setPickupPincode('302012');
    setDeliveryPincode('713207');
    setActualWeight('2');
    setDimensions({ length: '20', width: '20', height: '19' });
    setPaymentType('cod');
    setShipmentValue('9000');
    setIsDangerous('no');
    setIsSecure('no');
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="space-y-8">
        {/* Shipment Type */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Shipment Type
          </h3>
          <div className="flex gap-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="shipmentType"
                value="forward"
                checked={shipmentType === 'forward'}
                onChange={(e) => setShipmentType(e.target.value as 'forward')}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Forward</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="shipmentType"
                value="return"
                checked={shipmentType === 'return'}
                onChange={(e) => setShipmentType(e.target.value as 'return')}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Return</span>
            </label>
          </div>
        </div>

        {/* Pincodes */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Pickup Pincode
            </label>
            <input
              type="text"
              value={pickupPincode}
              onChange={(e) => setPickupPincode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter pickup pincode"
            />
            {pickupLocation.city && (
              <p className="mt-2 text-sm text-gray-600">
                {pickupLocation.city}, {pickupLocation.state}
              </p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Delivery Pincode
            </label>
            <input
              type="text"
              value={deliveryPincode}
              onChange={(e) => setDeliveryPincode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter delivery pincode"
            />
            {deliveryLocation.city && (
              <p className="mt-2 text-sm text-gray-600">
                {deliveryLocation.city}, {deliveryLocation.state}
              </p>
            )}
          </div>
        </div>

        {/* Weight and Dimensions */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actual Weight
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={actualWeight}
                onChange={(e) => {
                  setActualWeight(e.target.value);
                  setShowDimensions(!!e.target.value);
                }}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0"
                step="0.1"
              />
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                KG
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Note: Minimum chargeable weight is 0.5kg</p>
          </div>

          {showDimensions && (
            <div className="space-y-4 animate-in slide-in-from-top duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="L"
                    />
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                      CM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="W"
                    />
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                      CM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="H"
                    />
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                      CM
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Note: Dimensional value should be greater than 0.5cm</p>
              </div>

              <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Volumetric Weight:</span>
                  <span className="text-sm font-semibold text-purple-600">{volumetricWeight} KG</span>
                  <div className="group relative">
                    <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                      Calculated as (L×W×H)/5000
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Applicable Weight:</span>
                  <span className="text-sm font-semibold text-purple-600">{applicableWeight} KG</span>
                  <div className="group relative">
                    <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                      Greater of actual and volumetric weight
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment and Shipment Value */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600" />
              Payment Type
            </h3>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentType"
                  value="cod"
                  checked={paymentType === 'cod'}
                  onChange={(e) => setPaymentType(e.target.value as 'cod')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">Cash on Delivery</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentType"
                  value="prepaid"
                  checked={paymentType === 'prepaid'}
                  onChange={(e) => setPaymentType(e.target.value as 'prepaid')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">Prepaid</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipment Value (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={shipmentValue}
                onChange={(e) => setShipmentValue(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-purple-600" />
              Shipping Dangerous Goods?
            </h3>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="dangerous"
                  value="yes"
                  checked={isDangerous === 'yes'}
                  onChange={(e) => setIsDangerous(e.target.value as 'yes')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="dangerous"
                  value="no"
                  checked={isDangerous === 'no'}
                  onChange={(e) => setIsDangerous(e.target.value as 'no')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-purple-600" />
              Secure Shipment
            </h3>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="secure"
                  value="yes"
                  checked={isSecure === 'yes'}
                  onChange={(e) => setIsSecure(e.target.value as 'yes')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="secure"
                  value="no"
                  checked={isSecure === 'no'}
                  onChange={(e) => setIsSecure(e.target.value as 'no')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleCalculate}
            className="flex-1 md:flex-none px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calculate
          </button>
          <button
            onClick={handleReset}
            className="flex-1 md:flex-none px-8 py-3 bg-white text-purple-600 font-medium rounded-lg border-2 border-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingCalculator;