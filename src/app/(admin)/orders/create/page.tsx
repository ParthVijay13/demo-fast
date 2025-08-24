"use client";
import React from 'react';
import CreateOrderFormNew from '@/components/orders/CreateOrderFormNew';

const CreateOrderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CreateOrderFormNew />
    </div>
  );
};

export default CreateOrderPage;
