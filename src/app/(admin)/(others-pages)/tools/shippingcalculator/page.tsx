"use client"
import React from 'react';

import ShippingCalculator from '@/components/tools/rateCalculator';

const ShippingCalculatorPage: React.FC = () => {
  return (
    <div className='w-full h-full'>
      <ShippingCalculator />
    </div>
    
  );
};

export default ShippingCalculatorPage;