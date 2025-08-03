"use client"
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import internalApi from '@/app/interceptors/internalAPI';
import { ChevronDown, ArrowLeft, Check, Upload, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ThreeBodyLoader from '@/components/loader/loader';
import KYCCompleted from '../kycdone';

// Types and Interfaces
interface FormData {
  businessType: string;
  individualType: string;
  documentType: string;
  documentNumber: string;
  mobileNumber: string;
  kycMethod: string;
  panNumber: string;
  panName: string;
  gstin: string;
  aadharNumber: string;
  otp: string;
  tanNumber: string;
}

interface VerificationData {
  aadharRefId: string;
  verificationResults: Record<string, any>;
}

interface AlertData {
  message: string;
  type: 'success' | 'error';
}



interface Step {
  id: number;
  title: string;
  completed: boolean;
}

interface BusinessInfoResponse {
  success: boolean;
  data: {
    business_category: string;
    business_subcategory?: string;
  };
  message?: string;
}

// interface KYCResponse {
//   success: boolean;
//   data?: any;
//   message?: string;
// }

// interface AadharOTPResponse {
//   success: boolean;
//   data?: {
//     ref_id: string;
//   };
//   message?: string;
// }

// Constants
const BUSINESS_TYPES = {
  INDIVIDUAL: 'INDIVIDUAL',
  SOLE_PROPRIETOR: 'SOLE',
  COMPANY: 'COMPANY'
} as const;

const INDIVIDUAL_TYPES = {
  INDIVIDUAL: 'INDIVIDUAL',
  HUF: 'HUF'
} as const;

const COMPANY_TYPES = {
  PARTNERSHIP: "PARTNERSHIP",
  LLP: 'LLP'
} as const;

const KYC_METHODS = {
  PAN: 'pan',
  AADHAR: 'express-aadhar',
  TAN: 'tan',
  GSTIN: 'gstin',
  UPLOAD: 'upload'
} as const;

// Validation utilities
const validators = {
  pan: (value: string): boolean => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
  aadhar: (value: string): boolean => /^\d{12}$/.test(value),
  gstin: (value: string): boolean => /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(value),
  tan: (value: string): boolean => /^[A-Z]{4}\d{5}[A-Z]{1}$/.test(value),
  otp: (value: string): boolean => /^\d{6}$/.test(value),
  mobile: (value: string): boolean => /^[6-9]\d{9}$/.test(value)
};

// Alert Component Props
interface AlertProps {
  type?: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

// Alert Component
const Alert: React.FC<AlertProps> = ({ type = 'error', message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`${bgColor} ${borderColor} ${textColor} border rounded-md p-4 mb-4 flex items-start`}>
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
          ×
        </button>
      )}
    </div>
  );
};

// Step Tracker Component Props
interface StepTrackerProps {
  steps: Step[];
  currentStep: number;
}

// Step Tracker Component
const StepTracker: React.FC<StepTrackerProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-colors ${
              step.completed ? 'bg-green-500' : 
              step.id === currentStep ? 'bg-purple-600' : 'bg-gray-400'
            }`}>
              {step.completed ? <Check size={20} /> : step.id}
            </div>
            <span className="text-sm mt-2 text-gray-600 text-center max-w-20">
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-32 h-0.5 mx-4 transition-colors ${
              steps[index + 1].completed || currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

// Radio Option Component Props
interface RadioOptionProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

// Radio Option Component
const RadioOption: React.FC<RadioOptionProps> = ({ selected, onClick, title, description }) => {
  return (
    <div 
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        selected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-purple-500' : 'border-gray-300'
        }`}>
          {selected && <div className="w-3 h-3 rounded-full bg-purple-500"></div>}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Patch Business Info Function
async function patchBusinessInfo(business_category: string, business_subcategory?: string): Promise<BusinessInfoResponse> {
  
  const payload = {
    business_category: business_category.toUpperCase(),
    ...(business_subcategory
      ? { business_subcategory: business_subcategory.toUpperCase() }
      : {})
  };
  const res = await internalApi.patch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/kyc/business-info`,
    payload
  );
  
  return res.data;
}



// Business Type Step Props
interface BusinessTypeStepProps {
  formData: FormData;
  onBusinessTypeSelect: (type: string) => void;
  onIndividualTypeSelect: (type: string) => void;
  onNext: () => void;
}

// Business Type Step Component
const BusinessTypeStep: React.FC<BusinessTypeStepProps> = ({ 
  formData, 
  onBusinessTypeSelect, 
  onIndividualTypeSelect, 
  onNext 
}) => {
  const canProceed = formData.businessType && (
    formData.businessType === BUSINESS_TYPES.SOLE_PROPRIETOR ||
    (formData.businessType !== BUSINESS_TYPES.SOLE_PROPRIETOR && formData.individualType)
  );
  // const [toast, setToast] = useState<ToastData | null>(null);

  const handleNext = async () => {
    try {
      console.log("into the handle next");
      const res = await patchBusinessInfo(
        formData.businessType,
        formData.individualType || undefined
      );
      console.log("This is the response: in handle next", res);
      if (res && res.success) {
        // setToast({ message: res.message || 'Business info saved!', type: 'success' });
        onNext();
      } else {
        // setToast({ message: res?.message || 'Failed to save business info', type: 'error' });
      }
    } catch (err: any) {
      // console.error("Error in handleNext:", err);
      toast.error(err.response?.data?.message)
      // setToast({ 
      //   message: err.response?.data?.message || err.message || 'Failed to save business info', 
      //   type: 'error' 
      // });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6">Please confirm your Business Type</h2>
        
        <div className="space-y-4">
          <RadioOption
            selected={formData.businessType === BUSINESS_TYPES.INDIVIDUAL}
            onClick={() => onBusinessTypeSelect(BUSINESS_TYPES.INDIVIDUAL)}
            title="Individual"
            description="A Seller who is selling through online selling platforms, and has not registered his/her firm under Companies Act 2013"
          />
          
          <RadioOption
            selected={formData.businessType === BUSINESS_TYPES.SOLE_PROPRIETOR}
            onClick={() => onBusinessTypeSelect(BUSINESS_TYPES.SOLE_PROPRIETOR)}
            title="Sole Proprietor"
            description="Registered company as 'Sole Proprietor' under Companies Act 2013"
          />
          
          <RadioOption
            selected={formData.businessType === BUSINESS_TYPES.COMPANY}
            onClick={() => onBusinessTypeSelect(BUSINESS_TYPES.COMPANY)}
            title="Company"
            description="Registered company as 'LLP', 'Private', 'Subsidiary', 'Holding', etc, under Companies Act 2013"
          />
        </div>

        {formData.businessType === BUSINESS_TYPES.INDIVIDUAL && (
          <div className="mt-6">
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.individualType}
              onChange={(e) => onIndividualTypeSelect(e.target.value)}
            >
              <option value="">Select Individual Type</option>
              <option value={INDIVIDUAL_TYPES.INDIVIDUAL}>Individual</option>
              <option value={INDIVIDUAL_TYPES.HUF}>HUF</option>
            </select>
          </div>
        )}

        {formData.businessType === BUSINESS_TYPES.COMPANY && (
          <div className="mt-6">
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.individualType}
              onChange={(e) => onIndividualTypeSelect(e.target.value)}
            >
              <option value="">Select Company Type</option>
              <option value={COMPANY_TYPES.PARTNERSHIP}>Partnership</option>
              <option value={COMPANY_TYPES.LLP}>Limited Liability Partnership</option>
            </select>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      
    </>
  );
};

// Verification Method Props
interface VerificationMethodProps {
  method: string;
  selected: boolean;
  onSelect: (method: string) => void;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  children?: React.ReactNode;
}

// Verification Method Component
const VerificationMethod: React.FC<VerificationMethodProps> = ({ 
  method, 
  selected, 
  onSelect, 
  title, 
  subtitle, 
  description, 
  icon, 
  iconBgColor,
  children 
}) => {
  return (
    <div 
      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
        selected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
      }`}
      onClick={() => onSelect(method)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`${iconBgColor} p-2 rounded`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
            <p className="text-sm text-orange-600 mt-1">{description}</p>
          </div>
        </div>
        <ChevronDown className={`transform transition-transform ${
          selected ? 'rotate-180' : ''
        }`} />
      </div>
      
      {selected && children}
    </div>
  );
};

// Input Field Props
interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  pattern?: string;
  error?: string;
  disabled?: boolean;
}

// Input Field Component
const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  maxLength, 
  pattern, 
  error, 
  disabled 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : ''}`}
        maxLength={maxLength}
        pattern={pattern}
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Document Verification Step Props
interface DocumentVerificationStepProps {
  formData: FormData;
  loading: boolean;
  errors: Record<string, string>;
  alert: AlertData | null;
  onKYCMethodSelect: (method: string) => void;
  onInputChange: (field: string, value: string) => void;
  onVerifyPAN: () => void;
  onVerifyGSTIN: () => void;
  onSendAadharOTP: () => void;
  onVerifyAadharOTP: () => void;
  onBack: () => void;
  onComplete: () => void;
  otpSent: boolean;
}

// Document Verification Step Component
const DocumentVerificationStep: React.FC<DocumentVerificationStepProps> = ({ 
  formData, 
  loading, 
  errors,
  alert,
  onKYCMethodSelect,
  onInputChange,
  onVerifyPAN,
  onVerifyGSTIN,
  onSendAadharOTP,
  onVerifyAadharOTP,
  onBack,
  onComplete,
  otpSent
}) => {
  const isIndividual = formData.businessType === BUSINESS_TYPES.INDIVIDUAL;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isIndividual 
          ? 'Verify your identity using PAN or Aadhar' 
          : 'Verify your business using TAN or GSTIN'}
      </h2>
      
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => {}} 
        />
      )}
      
      <div className="space-y-4">
        {isIndividual ? (
          <>
            {/* PAN Verification */}
            <VerificationMethod
              method={KYC_METHODS.PAN}
              selected={formData.kycMethod === KYC_METHODS.PAN}
              onSelect={onKYCMethodSelect}
              title="Verify using PAN"
              subtitle="(Instant Verification)"
              description="Verify your PAN details instantly"
              icon={<div className="w-6 h-6 bg-blue-500 rounded"></div>}
              iconBgColor="bg-blue-100"
            >
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="PAN Number"
                    placeholder="ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) => onInputChange('panNumber', e.target.value.toUpperCase())}
                    maxLength={10}
                    error={errors.panNumber}
                  />
                  <InputField
                    label="Name as per PAN"
                    placeholder="Enter name"
                    value={formData.panName}
                    onChange={(e) => onInputChange('panName', e.target.value)}
                    error={errors.panName}
                  />
                </div>
                
                <button 
                  onClick={onVerifyPAN}
                  disabled={!formData.panNumber || !formData.panName || loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && <Loader2 className="animate-spin" size={20} />}
                  <span>Verify PAN</span>
                </button>
              </div>
            </VerificationMethod>

            {/* Aadhar Verification */}
            <VerificationMethod
              method={KYC_METHODS.AADHAR}
              selected={formData.kycMethod === KYC_METHODS.AADHAR}
              onSelect={onKYCMethodSelect}
              title="Express KYC using Aadhar OTP"
              subtitle="(No Document Upload Required)"
              description="Get KYC verified within 30 seconds"
              icon={<div className="w-6 h-6 bg-green-500 rounded"></div>}
              iconBgColor="bg-green-100"
            >
              <div className="mt-6 space-y-4">
                <InputField
                  label="Aadhar Number"
                  placeholder="XXXX-XXXX-XXXX"
                  value={formData.aadharNumber}
                  onChange={(e) => onInputChange('aadharNumber', e.target.value.replace(/\D/g, ''))}
                  maxLength={12}
                  error={errors.aadharNumber}
                  disabled={otpSent}
                />
                
                {!otpSent ? (
                  <button 
                    onClick={onSendAadharOTP}
                    disabled={!validators.aadhar(formData.aadharNumber) || loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading && <Loader2 className="animate-spin" size={20} />}
                    <span>Send OTP</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <InputField
                      label="Enter OTP"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={(e) => onInputChange('otp', e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      error={errors.otp}
                    />
                    <div className="flex space-x-4">
                      <button 
                        onClick={onVerifyAadharOTP}
                        disabled={!validators.otp(formData.otp) || loading}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        <span>Verify OTP</span>
                      </button>
                      <button 
                        onClick={onSendAadharOTP}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </VerificationMethod>
          </>
        ) : (
          <>
            {/* GSTIN Verification */}
            <VerificationMethod
              method={KYC_METHODS.GSTIN}
              selected={formData.kycMethod === KYC_METHODS.GSTIN}
              onSelect={onKYCMethodSelect}
              title="Verify using GSTIN"
              subtitle="(For GST Registered Businesses)"
              description="Instant GSTIN verification"
              icon={<div className="w-6 h-6 bg-yellow-500 rounded"></div>}
              iconBgColor="bg-yellow-100"
            >
              <div className="mt-6 space-y-4">
                <InputField
                  label="GSTIN Number"
                  placeholder="22AAAAA0000A1Z5"
                  value={formData.gstin}
                  onChange={(e) => onInputChange('gstin', e.target.value.toUpperCase())}
                  maxLength={15}
                  error={errors.gstin}
                />
                
                <button 
                  onClick={onVerifyGSTIN}
                  disabled={!validators.gstin(formData.gstin) || loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && <Loader2 className="animate-spin" size={20} />}
                  <span>Verify GSTIN</span>
                </button>
              </div>
            </VerificationMethod>
          </>
        )}

        <div className="text-center text-gray-500 font-semibold">OR</div>

        {/* Upload Documents */}
        <VerificationMethod
          method={KYC_METHODS.UPLOAD}
          selected={formData.kycMethod === KYC_METHODS.UPLOAD}
          onSelect={onKYCMethodSelect}
          title="KYC by uploading ID & Address Proofs"
          subtitle="(Document Upload Required)"
          description="KYC verification might take 2-3 business days"
          icon={<Upload className="w-6 h-6 text-gray-500" />}
          iconBgColor="bg-gray-100"
        >
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Document upload functionality would be implemented here.</p>
          </div>
        </VerificationMethod>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 hover:bg-purple-600 text-white rounded-lg bg-gray-300 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button
          onClick={onComplete}
          disabled={!formData.kycMethod || loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
        >
          Complete KYC
        </button>
      </div>
    </div>
  );
};

// // Placeholder Toast Component (since it's imported but not defined)
// const Toast: React.FC<ToastProps> = ({ message, type, duration, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, duration);
//     return () => clearTimeout(timer);
//   }, [duration, onClose]);

//   return null; // Placeholder implementation
// };

// Main Component
const DomesticKYC: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertData | null>(null);
  const [isKYCDone, setIsKYCDone] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    individualType: '',
    documentType: '',
    documentNumber: '',
    mobileNumber: '',
    kycMethod: '',
    panNumber: '',
    panName: '',
    gstin: '',
    aadharNumber: '',
    otp: '',
    tanNumber: ''
  });

  const [verificationData, setVerificationData] = useState<VerificationData>({
    aadharRefId: '',
    verificationResults: {}
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // New: fetch saved business-info on mount
  useEffect(() => {
    const init = async () => {
      try {
        
        const { data } = await internalApi.get(
          `/api/kyc/business-info`, 
        );
        
        console.log("This is the data from get api",data);
        
        if (data?.success && data.data.business_category) {
          const { business_category, business_subcategory } = data.data;
          setFormData(fd => ({
            ...fd,
            businessType: business_category,           
            individualType: business_subcategory || ''
          }));

          setCurrentStep(2);
          setLoading(false);
        }
        else{
          setLoading(false)
        }
      } catch (err:any) {
        toast.error(err.response.data.message);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsKYCDone(localStorage.getItem('kyc'));
    }
  }, []);

  // Computed steps with completion status
  const steps = useMemo<Step[]>(() => [
    { 
      id: 1, 
      title: 'Business Type', 
      completed: currentStep > 1 || (currentStep === 1 && formData.businessType !== '')
    },
    { 
      id: 2, 
      title: 'Document Verification', 
      completed: Object.keys(verificationData.verificationResults).length > 0
    }
  ], [currentStep, formData.businessType, verificationData.verificationResults]);

  // Show alert helper
  // const showAlert = useCallback((message: string, type: 'success' | 'error' = 'error') => {
  //   setAlert({ message, type });
  //   setTimeout(() => setAlert(null), 5000);
  // }, []);

  // Form validation
  const validateField = useCallback((fieldName: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'panNumber':
        if (!validators.pan(value)) {
          newErrors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
        } else {
          delete newErrors.panNumber;
        }
        break;
      case 'aadharNumber':
        if (!validators.aadhar(value)) {
          newErrors.aadharNumber = 'Aadhar must be 12 digits';
        } else {
          delete newErrors.aadharNumber;
        }
        break;
      case 'gstin':
        if (!validators.gstin(value)) {
          newErrors.gstin = 'Invalid GSTIN format';
        } else {
          delete newErrors.gstin;
        }
        break;
      case 'tanNumber':
        if (!validators.tan(value)) {
          newErrors.tanNumber = 'Invalid TAN format (e.g., ABCD12345E)';
        } else {
          delete newErrors.tanNumber;
        }
        break;
      case 'otp':
        if (!validators.otp(value)) {
          newErrors.otp = 'OTP must be 6 digits';
        } else {
          delete newErrors.otp;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  }, [errors]);

  // Event handlers
  const handleBusinessTypeSelect = useCallback((type: string) => {
    setFormData(prev => ({ 
      ...prev, 
      businessType: type,
      individualType: type === BUSINESS_TYPES.SOLE_PROPRIETOR ? 'sole-proprietor' : ''
    }));
  }, []);

  const handleIndividualTypeSelect = useCallback((type: string) => {
    setFormData(prev => ({ ...prev, individualType: type }));
  }, []);

  const handleKYCMethodSelect = useCallback((method: string) => {
    if (formData.kycMethod === method) return;
    setFormData(prev => ({ ...prev, kycMethod: method }));
    setOtpSent(false);
    setErrors({});
    setAlert(null);
  }, [formData.kycMethod]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  }, [validateField]);

  const handleNext = useCallback(() => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // API functions
  const verifyPAN = async () => {
    setLoading(true);
    try {
      // const token = localStorage.getItem('access_token');
      const response = await internalApi.post(
        '/api/kyc/pan/verify',
        { pan: formData.panNumber, name: formData.panName }
      );
      
      if (response.data.success) {
        setVerificationData(p => ({
          ...p,
          verificationResults: { ...p.verificationResults, pan: response.data.data },
        }));
        localStorage.setItem('kyc', 'true');
        setIsKYCDone('true');
        toast.success("PAN verified successfully!");
      } else {
        toast.error("PAN verification failed. Please check your details.");
      }
    } catch(err: any) {
      toast.error(err.response?.data?.message || "Error verifying PAN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyGSTIN = async () => {
    setLoading(true);
    try {
      
      const { data } = await internalApi.post('/api/kyc/gstin/verify', {
        gstin: formData.gstin,
      });

      if (data.success) {
        setVerificationData(p => ({
          ...p,
          verificationResults: { ...p.verificationResults, gstin: data.data },
        }));
        localStorage.setItem('kyc', 'true');
        setIsKYCDone('true');
        toast.success("GSTIN verified successfully!");
      } else {
        toast.error("GSTIN verification failed. Please check your details.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error verifying GSTIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendAadharOTP = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      console.log(token);
      
      const { data } = await internalApi.post('/api/kyc/aadhar/otp', {
        aadhaar_number: formData.aadharNumber,
      }
    );

      if (data.success) {
        setVerificationData(p => ({ ...p, aadharRefId: data.data.ref_id }));
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP. Please check your Aadhar number.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyAadharOTP = async () => {
    setLoading(true);
    try {
      
      console.log(verificationData);
      const { data } = await internalApi.post('/api/kyc/aadhar/verify', {
        ref_id: verificationData.aadharRefId,
        otp: formData.otp,
      });

      if (data.success) {
        setVerificationData(p => ({
          ...p,
          verificationResults: { ...p.verificationResults, aadhar: data.data },
        }));
        localStorage.setItem('kyc', 'true');
        setIsKYCDone('true');
        toast.success("Aadhar verified successfully!");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = useCallback(() => {
    if (Object.keys(verificationData.verificationResults).length > 0) {
      localStorage.setItem('kyc', 'true');
      setIsKYCDone('true');
      toast.success("KYC Completed!");
      console.log('KYC Completed:', { formData, verificationData });
    } else {
      toast.error("Please complete at least one verification method before proceeding.");
    }
  }, [formData, verificationData]);

  if (isKYCDone === 'true') {    
    return <KYCCompleted />;
  }

  if (loading) {
    return <ThreeBodyLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Domestic KYC</h1>
      
      <StepTracker steps={steps} currentStep={currentStep} />
      
      <div className="bg-white rounded-lg">
        {currentStep === 1 && (
          <BusinessTypeStep
            formData={formData}
            onBusinessTypeSelect={handleBusinessTypeSelect}
            onIndividualTypeSelect={handleIndividualTypeSelect}
            onNext={handleNext}
          />
        )}
        
        {currentStep === 2 && (
          <DocumentVerificationStep
            formData={formData}
            loading={loading}
            errors={errors}
            alert={alert}
            otpSent={otpSent}
            onKYCMethodSelect={handleKYCMethodSelect}
            onInputChange={handleInputChange}
            onVerifyPAN={verifyPAN}
            onVerifyGSTIN={verifyGSTIN}
            onSendAadharOTP={sendAadharOTP}
            onVerifyAadharOTP={verifyAadharOTP}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
};

export default DomesticKYC;