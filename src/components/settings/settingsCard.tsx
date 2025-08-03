'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsCardProps {
  title: string;
  description: string;
  href: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, href }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4 mt-1" />
      </div>
    </div>
  );
};

export default SettingsCard;