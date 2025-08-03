import { CheckCircle } from 'lucide-react';
// import Link from 'next/link';
export default function KYCCompleted() {
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md border p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        KYC Completed
      </h2>
      
      <p className="text-gray-600 text-sm mb-6">
        Your identity verification is complete
      </p>
{/*       
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        <Link href="/settings">Continue</Link>
        
      </button> */}
    </div>
  );
}