import React, { useState } from 'react';
import { 
  User, 
  Info, 
  Hash, 
  MapPin, 
  CreditCard, 
  Phone, 
  Package, 
  Truck, 
  IndianRupee,
  Clock,
  Calendar,
  MessageCircle,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

interface TrackingData {
  customerName: string;
  companyName: string;
  awbNumber: string;
  deliveryAddress: string;
  paymentMode: string;
  phoneNumber: string;
  orderId: string;
  courierPartner: string;
  codAmount: string;
  currentStatus: string;
  lastUpdateTime: string;
  lastLocation: string;
  lastRemarks: string;
  expectedDeliveryDate: string;
  journey: Array<{
    status: string;
    location: string;
    timestamp: string;
  }>;
}

interface ShipmentTrackingProps {
  trackingData: TrackingData;
}

const ShipmentTracking: React.FC<ShipmentTrackingProps> = ({ trackingData }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'out for delivery':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressStage = (status: string) => {
    const stages = ['shipped', 'in transit', 'out for delivery', 'delivered'];
    const currentIndex = stages.findIndex(stage => 
      status.toLowerCase().includes(stage)
    );
    return Math.max(0, currentIndex);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const InfoField = ({ icon: Icon, label, value, copyable = false, fieldKey = '' }: any) => (
    <div className="flex items-start space-x-3 py-3">
      <Icon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="font-medium text-gray-900 dark:text-white break-words">{value}</p>
          {copyable && (
            <button 
              onClick={() => copyToClipboard(value, fieldKey)}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
              title="Copy to clipboard"
            >
              {copiedField === fieldKey ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Shipment Tracking
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Track your package delivery status</p>
        </div>

        {/* Current Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Current Status</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(trackingData.currentStatus)}`}>
                  <Truck className="w-4 h-4 mr-2" />
                  {trackingData.currentStatus}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Last updated: {trackingData.lastUpdateTime}</p>
                <p className="mt-1">Expected delivery: {trackingData.expectedDeliveryDate}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                <span>SHIPPED</span>
                <span className="hidden sm:inline">IN TRANSIT</span>
                <span className="hidden sm:inline">OUT FOR DELIVERY</span>
                <span>DELIVERED</span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (getProgressStage(trackingData.currentStatus) + 1) * 25)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  {[0, 1, 2, 3].map((stage) => (
                    <div key={stage} className={`w-3 h-3 rounded-full ${
                      getProgressStage(trackingData.currentStatus) >= stage 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Customer Information
              </h2>
              <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-700">
                <InfoField 
                  icon={User} 
                  label="Customer Name" 
                  value={trackingData.customerName}
                />
                <InfoField 
                  icon={Info} 
                  label="Company Name" 
                  value={trackingData.companyName}
                />
                <InfoField 
                  icon={Hash} 
                  label="AWB Number" 
                  value={trackingData.awbNumber}
                  copyable={true}
                  fieldKey="awbNumber"
                />
                <InfoField 
                  icon={MapPin} 
                  label="Delivery Address" 
                  value={trackingData.deliveryAddress}
                />
                <InfoField 
                  icon={CreditCard} 
                  label="Payment Mode" 
                  value={trackingData.paymentMode}
                />
                <InfoField 
                  icon={Phone} 
                  label="Phone Number" 
                  value={trackingData.phoneNumber}
                  copyable={true}
                  fieldKey="phoneNumber"
                />
                <InfoField 
                  icon={Package} 
                  label="Order ID" 
                  value={trackingData.orderId}
                  copyable={true}
                  fieldKey="orderId"
                />
                <InfoField 
                  icon={Truck} 
                  label="Courier Partner" 
                  value={trackingData.courierPartner}
                />
                <InfoField 
                  icon={IndianRupee} 
                  label="COD Amount" 
                  value={`₹${trackingData.codAmount}`}
                />
              </div>
            </div>
          </div>

          {/* Tracking Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tracking Details
              </h2>
              <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-700">
                <InfoField 
                  icon={Clock} 
                  label="Last Update Time" 
                  value={trackingData.lastUpdateTime}
                />
                <InfoField 
                  icon={MapPin} 
                  label="Current Location" 
                  value={trackingData.lastLocation}
                />
                <InfoField 
                  icon={Info} 
                  label="Latest Update" 
                  value={trackingData.lastRemarks}
                />
                <InfoField 
                  icon={Calendar} 
                  label="Expected Delivery" 
                  value={trackingData.expectedDeliveryDate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Journey */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Shipment Journey
            </h2>
            <div className="space-y-4">
              {trackingData.journey.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                    {index !== trackingData.journey.length - 1 && (
                      <div className="absolute left-1.5 top-5 w-0.5 h-8 bg-gray-200 dark:bg-gray-600"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{event.status}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500 flex-shrink-0">
                        {event.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Support Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};



export default ShipmentTracking;