"use client"
import React, { useState } from 'react';
import { MapPin, Download, CheckCircle, XCircle } from 'lucide-react';

interface PincodeData {
  [key: string]: {
    city: string;
    state: string;
    serviceable: boolean;
  };
}

const PincodeServiceability: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState<{ city: string; state: string; serviceable: boolean } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Mock pincode database with serviceability status
  const pincodeData: PincodeData = {
    '302012': { city: 'Jaipur', state: 'Rajasthan', serviceable: true },
    '302013': { city: 'Jaipur', state: 'Rajasthan', serviceable: true },
    '713207': { city: 'Durgapur', state: 'West Bengal', serviceable: true },
    '700001': { city: 'Kolkata', state: 'West Bengal', serviceable: true },
    '400001': { city: 'Mumbai', state: 'Maharashtra', serviceable: true },
    '110001': { city: 'New Delhi', state: 'Delhi', serviceable: true },
    '500001': { city: 'Hyderabad', state: 'Telangana', serviceable: false },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', serviceable: false },
  };

  const checkServiceability = () => {
    if (!pincode) {
      alert('Please enter a pincode');
      return;
    }

    setIsChecking(true);
    setHasChecked(false);

    // Simulate API call
    setTimeout(() => {
      if (pincodeData[pincode]) {
        setLocation(pincodeData[pincode]);
      } else {
        setLocation(null);
      }
      setIsChecking(false);
      setHasChecked(true);
    }, 500);
  };

  const exportServiceability = () => {
    // Mock export functionality
    const data = Object.entries(pincodeData).map(([pin, info]) => ({
      pincode: pin,
      city: info.city,
      state: info.state,
      serviceable: info.serviceable ? 'Yes' : 'No'
    }));

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Pincode,City,State,Serviceable\n"
      + data.map(e => `${e.pincode},${e.city},${e.state},${e.serviceable}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pincode_serviceability.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pickup-Zone Serviceability</h2>
        <p className="text-gray-600">
          Check serviceable pin codes by entering the pickup pincode and exporting the serviceability sheet.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Pincode
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter Pickup Pincode"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              maxLength={6}
            />
          </div>
        </div>

        {/* Location Display */}
        {hasChecked && (
          <div className="animate-in slide-in-from-top duration-300">
            {location ? (
              <div className={`p-4 rounded-lg ${location.serviceable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <MapPin className={`w-5 h-5 mt-0.5 ${location.serviceable ? 'text-green-600' : 'text-red-600'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {location.city}, {location.state}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {location.serviceable ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">Serviceable</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-700 font-medium">Not Serviceable</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-yellow-800">Pincode not found in our database</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={checkServiceability}
            disabled={isChecking}
            className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Checking...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Check Availability
              </>
            )}
          </button>
          <button
            onClick={exportServiceability}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default PincodeServiceability;