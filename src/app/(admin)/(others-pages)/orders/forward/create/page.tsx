"use client";
import React from 'react';
import CreateOrderForm from '@/components/orders/CreateOrderForm';
import { useRouter } from 'next/navigation';

const CreateForwardOrderPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 border-b border-gray-200 px-4 sm:px-6 py-4 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:-translate-x-1"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span className="sr-only">Go back</span>
      </button>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Create Order</h1>
      </div>
      <CreateOrderForm />
    </div>
  );
};

export default CreateForwardOrderPage;


