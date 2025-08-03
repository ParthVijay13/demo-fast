"use client"
import React from 'react';
import { Calculator, MapPin, ArrowRight} from 'lucide-react';
import Link from 'next/link';

const ToolsPage: React.FC = () => {
  const tools = [
    {
      id: 'shippingcalculator',
      title: 'Shipping Calculator',
      description: 'Calculate shipping rates based on weight, dimensions, and delivery location',
      icon: Calculator,
      color: 'purple',
      features: ['Real-time rate calculation', 'Volumetric weight', 'Multiple payment options'],
      href: '/tools/shippingcalculator'
    },
    {
      id: 'pincodeserviceability',
      title: 'Pincode Serviceability',
      description: 'Check if we deliver to a specific pincode and export serviceability data',
      icon: MapPin,
      color: 'blue',
      features: ['Instant pincode check', 'City & state info', 'Export functionality'],
      href: '/tools/pincodeserviceability'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shipping Tools</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools to help you manage shipping, calculate rates, and check service availability
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const colorClasses = {
              purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
              blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
            };

            return (
              <Link href={tool.href} key={tool.id}>
                <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden h-full">
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-lg mb-4 transition-all duration-300 ${colorClasses[tool.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{tool.title}</h3>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                          <div className={`w-1.5 h-1.5 rounded-full ${tool.color === 'purple' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                      Open Tool
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  <div className={`h-1 bg-gradient-to-r ${tool.color === 'purple' ? 'from-purple-400 to-purple-600' : 'from-blue-400 to-blue-600'}`}></div>
                </div>
              </Link>
            );
          })}
        </div>

 
        
      </div>
    </div>
  );
};

export default ToolsPage;