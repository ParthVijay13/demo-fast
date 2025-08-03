'use client';

import React, { useState } from 'react';
import { Upload, Info } from 'lucide-react';
import Image from 'next/image';
// import ThreeBodyLoader from '../../loader/loader';
import {toast} from "react-hot-toast"


import { useDirty } from '@/hooks/useDIrty';
import internalApi from '@/app/interceptors/internalAPI';
const CompanyDetails = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    brandName: '',
    email: '',
    website: '',
    companyId:''
  });
  const [initialData, setInitialData] = useState(formData);
  // const [loading,setLoading] = useState(false);
  const isDirty = useDirty(formData,initialData);
  // const dispatch = useAppDispatch();
  // const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const token  = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
//  useEffect(() => {
//   const load = async () => {
//     try {
//       // Always use relative path for Next.js API routes
//       const res = await internalApi.get('/api/company-info', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       // console.log("this is the res ", res);
//       const { success, data } = res.data;
//       if (success && data) {
//         const mapped = {
//           companyName: data.company_name,
//           brandName: data.brand_name ?? '',
//           email: data.company_email ?? '',
//           website: data.company_website ?? '',
//           companyId: data.id
//         };
//         setFormData(mapped);
//         setInitialData(mapped);
//         setLoading(false);
//         if (data.company_logo) {
//           setLogoPreview(data.company_logo);
//         }
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data.message);
//     }
//   }
//   load();
// }, [token]);


const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 1024 * 1024) {
    alert('File size should be less than 1 MB');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setLogoPreview(reader.result as string);
  };
  reader.readAsDataURL(file);
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form submission
  console.log('Form submitted:', formData);
  try {
    const payload = {
      company_name: formData.companyName,
      brand_name: formData.brandName,
      company_email: formData.email,
      company_website: formData.website
    };
    const res = await internalApi.patch(
      `/api/company-info`,         // <----- Changed here
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("This is the response", res);

    if (res.data.success) {
      toast.success("Company details saved successfully!");
      const updated = {
        companyName: res.data.data.company_name,
        brandName: res.data.data.brand_name ?? '',
        email: res.data.data.company_email ?? '',
        website: res.data.data.company_website ?? '',
        companyId: res.data.data.id
      };
      setFormData(updated);
      setInitialData(updated);
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to update details');
  }
};

// if(loading){
//   return (
//     <ThreeBodyLoader/>
//   )
// }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Company Details</h2>
        <p className="text-sm text-gray-600 mt-1">View, edit and update the company related details</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Company ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
            <div className="text-sm font-semibold">{formData.companyId}</div>
          </div>

        </div>

        <div className="mt-8 space-y-6">
          {/* Registered Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registered Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Company Email ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Email ID
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Company Logo */}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Company Logo <span className="text-gray-400">(Optional)</span>
  </label>

  <label
    htmlFor="logo-upload"
    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer flex flex-col items-center justify-center"
  >
    {logoPreview ? (
      <Image
        src={logoPreview}
        alt="Company Logo"
        className="max-h-24 mx-auto object-contain"
        // unoptimized={true}
      />
    ) : (
      <>
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Upload</p>
      </>
    )}
    <input
      id="logo-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleLogoUpload}
      
    />
  </label>

  <p className="mt-2 text-xs text-gray-500 flex items-start gap-1">
    <span>Note:</span>
    <span>
      Image used in Company Logo should be less than 1 MB (Recommended dimension
      of logo is 250 X 100)
    </span>
  </p>
</div>


          <div className="grid grid-cols-2 gap-6">
            {/* Brand Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name <span className="text-gray-400">(Optional)</span>
                <Info className="inline-block w-4 h-4 ml-1 text-gray-400" />
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                placeholder="Enter Brand name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Enter Website link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={!isDirty}
            className={`px-6 py-2 rounded-md transition-colors ${
              !isDirty ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            Save
          </button>
        </div>
      </form>
      
        
          {/* {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>} */}
        
    </div>
    
  );
};

export default CompanyDetails;