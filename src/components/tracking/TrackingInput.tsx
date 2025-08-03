import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface TrackingInputProps {
  onTrack: (awbNumber: string) => void;
  isLoading?: boolean;
}

const TrackingInput: React.FC<TrackingInputProps> = ({ onTrack, isLoading = false }) => {
  const [awbNumber, setAwbNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (awbNumber.trim()) {
      onTrack(awbNumber.trim());
    }
  };

  return (
    <div className="h-[85vh] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 pt-0">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Shipment Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your AWB number to track your shipment
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="awb" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AWB Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="awb"
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  placeholder="Enter your AWB number"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  disabled={isLoading}
                />
                                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!awbNumber.trim() || isLoading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Tracking...</span>
                </>
                             ) : (
                 <>
                   <Search className="w-5 h-5" />
                   <span>Track Shipment</span>
                 </>
               )}
            </button>
          </form>

          {/* Demo AWB Numbers */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Try these demo AWB numbers:</p>
            <div className="space-y-2">
              {['33081910259641', '123456789012', '987654321098'].map((demoAwb) => (
                <button
                  key={demoAwb}
                  onClick={() => {
                    setAwbNumber(demoAwb);
                    onTrack(demoAwb);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-md transition-colors duration-200"
                >
                  {demoAwb}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingInput; 