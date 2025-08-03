'use client';

import React, { useState } from 'react';
import TrackingInput from '@/components/tracking/TrackingInput';
import ShipmentTracking from '@/components/tracking/ShipmentTracking';

// Dummy tracking data
const getTrackingData = (awbNumber: string) => {
  const trackingDataMap: Record<string, any> = {
    '33081910259641': {
      customerName: 'Vinay Yadav',
      companyName: 'AQUA ACE',
      awbNumber: '33081910259641',
      deliveryAddress: 'Ekatma Bhavan, Room 49, Uttan Road 401106',
      paymentMode: 'COD',
      phoneNumber: 'XXXX-XX-7681',
      orderId: '#AA1637',
      courierPartner: 'Delhivery',
      codAmount: '550',
      currentStatus: 'In Transit',
      lastUpdateTime: 'Fri, Aug 1, 2025, 03:48 PM',
      lastLocation: 'Jaipur_JawarNgrCircle_C (Rajasthan)',
      lastRemarks: 'Shipment picked up',
      expectedDeliveryDate: 'Thu, Aug 7, 2025, 11:59 PM',
      journey: [
        {
          status: 'Manifested',
          location: 'Jaipur_JawarNgrCircle_C (Rajasthan)',
          timestamp: 'Thu, Jul 31, 2025, 10:20 AM'
        },
        {
          status: 'In Transit',
          location: 'Jaipur_JawarNgrCircle_C (Rajasthan)',
          timestamp: 'Fri, Aug 1, 2025, 03:48 PM'
        }
      ]
    },
    '123456789012': {
      customerName: 'Priya Sharma',
      companyName: 'TECH SOLUTIONS',
      awbNumber: '123456789012',
      deliveryAddress: 'Flat 15, Sunshine Apartments, Mumbai 400001',
      paymentMode: 'Prepaid',
      phoneNumber: 'XXXX-XX-1234',
      orderId: '#TS789',
      courierPartner: 'Blue Dart',
      codAmount: '0',
      currentStatus: 'Delivered',
      lastUpdateTime: 'Mon, Jul 29, 2025, 02:30 PM',
      lastLocation: 'Mumbai Central (Maharashtra)',
      lastRemarks: 'Package delivered successfully',
      expectedDeliveryDate: 'Mon, Jul 29, 2025, 06:00 PM',
      journey: [
        {
          status: 'Shipped',
          location: 'Delhi Sorting Hub (Delhi)',
          timestamp: 'Sat, Jul 26, 2025, 09:15 AM'
        },
        {
          status: 'In Transit',
          location: 'Mumbai Hub (Maharashtra)',
          timestamp: 'Sun, Jul 27, 2025, 11:45 AM'
        },
        {
          status: 'Out for Delivery',
          location: 'Mumbai Central (Maharashtra)',
          timestamp: 'Mon, Jul 29, 2025, 09:00 AM'
        },
        {
          status: 'Delivered',
          location: 'Mumbai Central (Maharashtra)',
          timestamp: 'Mon, Jul 29, 2025, 02:30 PM'
        }
      ]
    },
    '987654321098': {
      customerName: 'Rajesh Kumar',
      companyName: 'FASHION STORE',
      awbNumber: '987654321098',
      deliveryAddress: 'Shop 42, Mall Road, Bangalore 560001',
      paymentMode: 'COD',
      phoneNumber: 'XXXX-XX-5678',
      orderId: '#FS456',
      courierPartner: 'DTDC',
      codAmount: '1200',
      currentStatus: 'Shipped',
      lastUpdateTime: 'Wed, Jul 30, 2025, 04:20 PM',
      lastLocation: 'Chennai Hub (Tamil Nadu)',
      lastRemarks: 'Package picked up from seller',
      expectedDeliveryDate: 'Sat, Aug 2, 2025, 08:00 PM',
      journey: [
        {
          status: 'Shipped',
          location: 'Chennai Hub (Tamil Nadu)',
          timestamp: 'Wed, Jul 30, 2025, 04:20 PM'
        }
      ]
    }
  };

  return trackingDataMap[awbNumber] || null;
};

const TrackingPage: React.FC = () => {
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (awbNumber: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = getTrackingData(awbNumber);
    
    if (data) {
      setTrackingData(data);
    } else {
      setError('No tracking information found for this AWB number. Please check the number and try again.');
    }
    
    setIsLoading(false);
  };

  const handleBackToSearch = () => {
    setTrackingData(null);
    setError(null);
  };

  if (trackingData) {
    return (
      <div>
        <div className="p-4">
          <button
            onClick={handleBackToSearch}
            className="mb-4 px-4 py-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Search</span>
          </button>
        </div>
        <ShipmentTracking trackingData={trackingData} />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        </div>
      )}
      <TrackingInput onTrack={handleTrack} isLoading={isLoading} />
    </div>
  );
};

export default TrackingPage;
