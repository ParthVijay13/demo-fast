"use client"
import React, { useState,useEffect } from 'react';
// import axios from "axios";
import ThreeBodyLoader from '@/components/loader/loader';
import { useDirty } from '@/hooks/useDIrty';
import internalApi from '@/app/interceptors/internalAPI';
// import api from '@/app/interceptors/tokenexpire';
import toast from 'react-hot-toast';
interface BankDetails {
  accountNumber: string;
  confirmAccountNumber: string;
  accountType: string;
  beneficiaryName: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

const BankDetailsForm: React.FC = () => {
  const [formData, setFormData] = useState<BankDetails>({
    accountNumber: '',
    confirmAccountNumber: '',
    accountType: '',
    beneficiaryName: '',
    ifscCode: '',
    bankName: '',
    branchName: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

 
  const [initialFormData, setInitialFormData] = useState<BankDetails | null>(null);
  const areBankDetailsDirty = useDirty(initialFormData, formData);


  const accountTypes = ['Saving Account', 'Current Account'];

  const handleInputChange = (field: keyof BankDetails, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  // useEffect(()=>{
  //   const loadBankDetails = async () => {
  //     try {
  //       const token = localStorage.getItem('access_token');
  //       const response = await internalApi.get(`/api/remittence`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
        
  //       if (response.data.success && response.data.data) {
  //           const mapped = {
  //        accountNumber:   response.data.data.account_number || '',
  //        confirmAccountNumber: '',
  //        accountType:     response.data.data.account_type || '',
  //        beneficiaryName: response.data.data.beneficiary_name || '',
  //        ifscCode:        response.data.data.ifsc_code || '',
  //        bankName:        response.data.data.bank_name || '',
  //        branchName:      response.data.data.branch_name || ''
  //      };
  //      setFormData(mapped);
  //      setInitialFormData(mapped);
       

  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching bank details:', error);
  //     }
  //   };

  //   loadBankDetails();
  // }, []);

  const handleAccountTypeSelect = (accountType: string) => {
    handleInputChange('accountType', accountType);
    setIsDropdownOpen(false);
  };
  
  // if(loading) {
  //   return(
  //    < ThreeBodyLoader/>
  //   )
  // }

  const handleSave = async() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const payload = {
        account_number: formData.accountNumber,
        account_type: formData.accountType === 'Saving Account' ? 'SAVING' : 'CURRENT',
        beneficiary_name: formData.beneficiaryName,
        ifsc_code: formData.ifscCode,
        bank_name: formData.bankName,
        branch_name: formData.branchName
      }

      const response = await internalApi.patch("/api/remittence",payload,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      })
      if (response.data.success) {
        setInitialFormData(formData);
        // setToast({message:"Bank details saved successfully",type:"success"});
        toast.success("Bank details saved successfully!")
      }

    } catch (error:any) {
      // console.error('Error saving bank details:', error);
      const errmsg = error.response?.data.message;
      toast.error(errmsg);

    }
  };

  return (
    <div className="max-w-10xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Bank Details</h1>
        <p className="text-gray-600 text-sm">Add bank account details where you want your COD to be remitted.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 mb-1">
          <span className="font-medium">Note:</span>
        </p>
        <p className="text-sm text-gray-700 mb-2">
          1. As a verification process, we will make a transaction of Rs. 1.0 to your bank account. Your account gets verified when the amount is credited successfully in your bank account.
        </p>
        <p className="text-sm text-gray-700">
          2. <span className="font-medium">Account holder&apos;s name should be the same as the name mentioned in the KYC document</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Account Number
            </label>
            <input
              type="text"
              placeholder="Confirm account number"
              value={formData.confirmAccountNumber}
              onChange={(e) => handleInputChange('confirmAccountNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white flex justify-between items-center"
              >
                <span className={formData.accountType ? 'text-gray-900' : 'text-gray-500'}>
                  {formData.accountType || 'Select Account Type'}
                </span>
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {accountTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleAccountTypeSelect(type)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beneficiary Name
          </label>
          <input
            type="text"
            placeholder="Enter Beneficiary Name"
            value={formData.beneficiaryName}
            onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC Code
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter IFSC Code"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {/* <button
                type="button"
                onClick={findIFSCCode}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 text-sm font-medium hover:text-purple-700"
              >
                Find your bank IFSC Code
              </button> */}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              placeholder="Enter Bank Name"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch Name
            </label>
            <input
              type="text"
              placeholder="Enter Branch Name"
              value={formData.branchName}
              onChange={(e) => handleInputChange('branchName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled = {!areBankDetailsDirty}
            className={`px-8 py-2 rounded-md font-medium transition-colors

            ${areBankDetailsDirty? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500': 'bg-gray-600 text-white cursor-not-allowed'}`}
          >
            Save
          </button>
        </div>
      </div>
      
    </div>
    
  );
};

export default BankDetailsForm;