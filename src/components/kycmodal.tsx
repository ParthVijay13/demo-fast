"use client"
import React, { useState, useEffect } from 'react';
import DomesticKYC from '@/components/settings/companySetup/domesticKYC';
import { X, Shield, CheckCircle, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const KYCModal: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isKYCDone = localStorage.getItem('kyc');
    const crossed = localStorage.getItem('crossed-kyc');

    // console.log("this is the value of kyc",isKYCDone)
    // console.log("this is the value of type kyc",typeof(isKYCDone))
    // console.log("this is the value of crosed",crossed)
    // console.log("this is the value of type crosed",typeof(crossed))
    

    if (isKYCDone == 'false' && crossed =='false') {
      setVisible(true);
      setTimeout(() => setIsAnimating(true), 50);
    }
    
  }, []);

  // Hide forever for this login
  const close = (): void => {
    setIsAnimating(false);
    setTimeout(() => {
      localStorage.setItem('crossed-kyc', 'true');
      setVisible(false);
    }, 300);
  };

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-center items-center transition-all duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Enhanced backdrop with blur */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
      />
      
      {/* Modal Container */}
      <div 
        className={`relative w-[95vw] max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isAnimating 
            ? 'scale-100 translate-y-0 opacity-100' 
            : 'scale-95 translate-y-8 opacity-0'
        }`}
      >
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-6">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }} />
          </div>
          
          {/* Header Content */}
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Complete Your KYC</h2>
                  <p className="text-blue-100 text-lg">Unlock full access to all platform features</p>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={close}
                className="text-white/70 hover:text-white hover:bg-white/20 p-2.5 rounded-xl transition-all duration-200 transform hover:scale-110"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Benefits bar */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: CheckCircle, text: "Higher Limits", desc: "Up to $100k" },
                { icon: Lock, text: "Enhanced Security", desc: "2FA enabled" },
                { icon: ArrowRight, text: "Instant Transfers", desc: "24/7 available" },
                { icon: Shield, text: "Premium Support", desc: "Priority access" }
              ].map((benefit, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <benefit.icon className="w-5 h-5 text-white mb-1" />
                  <p className="text-white text-sm font-semibold">{benefit.text}</p>
                  <p className="text-blue-100 text-xs">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-8 py-4">
          <div className="flex items-center justify-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-sm font-medium">
              Complete KYC now to avoid service interruptions. This process takes only 5 minutes.
            </p>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="h-[calc(100%-320px)] overflow-y-auto bg-gray-50">
          <div className="p-8">
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">KYC Progress</span>
                <span className="text-sm text-gray-500">Step 1 of 3</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-1/3 transition-all duration-500" />
              </div>
            </div>

            {/* KYC Form Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <DomesticKYC />
            </div>
          </div>
        </div>

        {/* Modern Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Your information is encrypted and secure
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={close}
                  className="px-5 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
                >
                  I&apos;ll do this later
                </button>
                {/* <button
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Continue KYC →
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCModal;