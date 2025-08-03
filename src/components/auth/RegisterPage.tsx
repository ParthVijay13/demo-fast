"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import Link from 'next/link';
import OtpVerificationView from '../otp/OtpVerificationView'; // Adjust the import path as needed
import { useAuth } from '@/context/AuthContext';

interface FormData {
  userType: 'seller' | 'buyer';
  accountType: 'BUSINESS' | 'INDIVIDUAL';
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  password: string;
  ordersPerMonth: string;
  agreeToTerms: boolean;
}

// --- Start of New BuyerTrackingView Component ---
const BuyerTrackingView: React.FC = () => {
  const [trackBy, setTrackBy] = useState<'AWB' | 'Order Id'>('AWB');
  const [trackingValue, setTrackingValue] = useState('');

  const handleTrackNow = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Tracking by: ${trackBy}, Value: ${trackingValue}`);
    alert(`Simulating track for ${trackBy}: ${trackingValue}`);
  };

  const getPlaceholder = () => {
    switch (trackBy) {
      case 'AWB':
        return 'Enter AWB Number';
      case 'Order Id':
        return 'Enter Order ID';
      default:
        return 'Enter Tracking ID';
    }
  };

  return (
    <div className="flex flex-col flex-grow justify-center p-4 md:p-6 lg:p-8 h-full">
      <form onSubmit={handleTrackNow}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Track By:</label>
          <div className="flex items-center space-x-4 text-sm">
            {(['AWB', 'Order Id'] as const).map((method) => (
              <label key={method} className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="trackBy"
                  value={method}
                  checked={trackBy === method}
                  onChange={() => {
                    setTrackBy(method);
                    setTrackingValue('');
                  }}
                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <input
            type="number"
            value={trackingValue}
            onChange={(e) => setTrackingValue(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm shadow-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          Track Now
        </button>
      </form>

      <div className="mt-10 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Can&apos;t Find Your Order Details?</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          We sent your AWB tracking number to you via Email & SMS upon order confirmation.
        </p>
      </div>
    </div>
  );
};
// --- End of New BuyerTrackingView Component ---

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userType: 'seller',
    accountType: 'BUSINESS',
    firstName: '',
    lastName: '',
    companyName: '',
    phoneNumber: '',
    email: '',
    password: '',
    ordersPerMonth: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionUuid, setSessionUuid] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const { register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear any previous error when user starts editing
    setError('');
  };

  useEffect(() => {
    const { firstName, lastName, companyName, phoneNumber, email, password, ordersPerMonth, agreeToTerms, accountType } = formData;
    const baseValid =
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      agreeToTerms;

    const isValid = accountType === 'BUSINESS'
      ? baseValid && companyName.trim() !== '' && ordersPerMonth !== ''
      : baseValid;

    setIsFormValid(isValid);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');

    // build base payload
    const base: any = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      company_name: formData.companyName,
      phone_number: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
      user_type: formData.accountType,
    };
    if (formData.accountType === 'BUSINESS') {
      base.parcels_per_month = formData.ordersPerMonth;
    }

    const res = await register(base);
    if (res.success && res.session_uuid) {
      setSessionUuid(res.session_uuid);
      setShowOtpVerification(true);
    } else {
      // show backend failure message here
      // console.log("this is the error from backend",res.error)
      setError(res.error  || 'Registration initiation failed.');
    }

    setLoading(false);
  };

  const handleEditPhoneNumber = () => {
    setShowOtpVerification(false);
    setError('');
  };

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    setError('');

    const payload: any = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      company_name: formData.companyName,
      phone_number: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
      user_type: formData.accountType,
      otp,
      session_uuid: sessionUuid,
    };
    if (formData.accountType === 'BUSINESS') {
      payload.parcels_per_month = formData.ordersPerMonth;
    }

    const res = await register(payload);
    if (!res.success) {
      // console.log("this is the error from backend",res.error)
      setError(res.error || 'Registration failed.');
    }
    setLoading(false);
  };

  const features = [
    'AI-Powered Courier Selection',
    'Branded Order Tracking Page',
    'Automated NDR Management',
    'Up To 45% Lesser RTOs'
  ];

  const brands = [
    { name: 'Zomato', color: 'text-red-500' },
    { name: 'Samsung', color: 'text-blue-600' },
    { name: 'Levi\'s', color: 'text-blue-700' },
    { name: 'Wildcraft', color: 'text-purple-600' },
    { name: 'Fabindia', color: 'text-orange-600' },
    { name: 'boAt', color: 'text-gray-700' },
    { name: 'Bata', color: 'text-red-600' },
    { name: 'Snitch', color: 'text-gray-600' }
  ];

  // OTP Step
  if (showOtpVerification && formData.userType === 'seller') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Your Account</h2>
          <p className="text-gray-600 mb-8">
            We&apos;ve sent a verification code to your phone number ending in{' '}
            <span className="font-semibold">
              {formData.phoneNumber.slice(-4)}
            </span>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <OtpVerificationView
            phoneNumber={formData.phoneNumber}
            onEditPhoneNumber={handleEditPhoneNumber}
            onVerifyOtp={handleVerifyOtp}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  // Main Registration / Tracking View
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-7xl w-full bg-white overflow-hidden flex flex-grow min-h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)]">
        <div className="flex flex-col lg:flex-row flex-grow">
          {/* Left Section */}
          <div className="hidden md:flex lg:w-1/2 w-full md:w-1/2 p-4 md:p-6 lg:p-10 xl:p-12 flex-col justify-center relative overflow-hidden flex-shrink-0">
            <div className="relative z-10 flex flex-col justify-center h-full">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                We Are More than Just a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Shipping Partner
                </span>
              </h1>
              <div className="space-y-3 sm:space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Trusted by 1 Lakh+ Brands</h3>
                <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  {brands.map((brand, index) => (
                    <div key={index} className="text-center">
                      <span className={`font-bold text-sm sm:text-base lg:text-lg ${brand.color}`}>
                        {brand.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 opacity-20 hidden lg:block">
              <div className="w-full h-40 md:h-48 lg:h-56 xl:h-64 bg-gradient-to-t from-purple-200 to-transparent rounded-t-full"></div>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="w-full lg:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col overflow-y-auto max-h-screen lg:max-h-none">
            {/* User Type Toggle */}
            <div className="flex mb-6 text-sm flex-shrink-0">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'seller' }))}
                className={`flex-1 py-3 px-4 rounded-l-lg font-medium transition-all text-center flex flex-col items-center justify-center ${
                  formData.userType === 'seller'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-base">👨‍💼</span>
                I&apos;m a Seller
                <div className="text-xs sm:text-sm opacity-75">I sell my products online</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
                className={`flex-1 py-3 px-4 rounded-r-lg font-medium transition-all text-center flex flex-col items-center justify-center ${
                  formData.userType === 'buyer'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-base">🛒</span>
                Track your order
                <div className="text-xs opacity-75">I&apos;m here to track an order</div>
              </button>
            </div>

            {formData.userType === 'seller' ? (
              <div className="flex flex-col flex-grow overflow-hidden">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex-shrink-0">Get started with a free account</h2>

                {/* Social Login */}
                {/* <div className="grid grid-cols-3 gap-3 mb-5 text-sm flex-shrink-0">
                  <button className="flex items-center justify-center py-2 px-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-green-600 font-bold mr-1">S</span> Shopify
                  </button>
                  <button className="flex items-center justify-center py-2 px-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-green-500 mr-1">📱</span> WhatsApp
                  </button>
                </div>
                <div className="text-center text-gray-500 mb-5 text-sm flex-shrink-0">or</div> */}

                {/* Form Fields Container (Scrollable) */}
                <div className="flex-grow  pr-2">
                  {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                  <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
                    {/* Account Type Selection */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Account Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, accountType: 'BUSINESS' }))}
                          className={`py-2 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                            formData.accountType === 'BUSINESS'
                              ? 'border-purple-600 bg-purple-50 text-purple-700'
                              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-lg mb-1">🏢</span>
                            <span>Business</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, accountType: 'INDIVIDUAL' }))}
                          className={`py-2 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                            formData.accountType === 'INDIVIDUAL'
                              ? 'border-purple-600 bg-purple-50 text-purple-700'
                              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-lg mb-1">👤</span>
                            <span>Individual</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter First Name"
                          className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter Last Name"
                          className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                    </div>

                    {formData.accountType === 'BUSINESS' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Enter Company Name"
                          className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                              // strip all non-digits, clamp to 10
                              const digits  = e.target.value.replace(/\D/g, '');
                              const clamped = digits.slice(0, 10);

                              setFormData(prev => ({ ...prev, phoneNumber: clamped }));
                              setError('');
                            }}
                            onKeyDown={(e) => {
                              const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab'];
                              if (
                                formData.phoneNumber.length >= 10 &&
                                !allowed.includes(e.key)
                              ) {
                                e.preventDefault();
                              }
                            }}
                        placeholder="Enter Phone Number"
                        className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email ID</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter Email Id"
                        className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter Password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 text-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">How many orders do you ship in a month?</label>
                      <select
                        name="ordersPerMonth"
                        value={formData.ordersPerMonth}
                        onChange={handleInputChange}
                        className="w-full px-6 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        required
                      >
                        <option value="">Please Select</option>
                        <option value="1-50">1-50 orders</option>
                        <option value="51-200">51-200 orders</option>
                        <option value="201-500">201-500 orders</option>
                        <option value="500+">500+ orders</option>
                      </select>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5 flex-shrink-0"
                        required
                      />
                      <label className="text-xs text-gray-600 leading-tight">
                        By clicking Sign up for Free, you agree to Shiprocket&apos;s{' '}
                        <Link href="/terms-of-service" className="text-purple-600 hover:underline">Terms Of Service</Link> and{' '}
                        <Link href="#" className="text-purple-600 hover:underline">Privacy Policy</Link>
                      </label>
                    </div>
                  </form>
                </div>

                {/* <-- Error banner inserted here --> */}
                

                {/* Buttons and login link */}
                <div className="flex-shrink-0 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid || loading}
                    className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 sm:py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl cursor-pointer ${
                      !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {!loading ? "Sign up for Free" : "Signing up...."}
                  </button>
                  <div className="text-center mt-3 text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link href="/login" className="text-purple-600 hover:underline font-medium">Login</Link>
                  </div>
                </div>
              </div>
            ) : (
              <BuyerTrackingView />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


// "use client";

// import React, { useState, useEffect } from 'react';
// import { Eye, EyeOff, Check } from 'lucide-react';
// import Link from 'next/link';
// import OtpVerificationView from '../otp/OtpVerificationView'; // Adjust the import path as needed
// import { useAuth } from '@/context/AuthContext';

// interface FormData {
//   userType: 'seller' | 'buyer';
//   accountType: 'BUSINESS' | 'INDIVIDUAL';
//   firstName: string;
//   lastName: string;
//   companyName: string;
//   phoneNumber: string;
//   email: string;
//   password: string;
//   ordersPerMonth: string;
//   agreeToTerms: boolean;
// }

// // --- Start of New BuyerTrackingView Component ---
// const BuyerTrackingView: React.FC = () => {
//   const [trackBy, setTrackBy] = useState<'AWB' | 'Order Id'>('AWB');
//   const [trackingValue, setTrackingValue] = useState('');

//   const handleTrackNow = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(`Tracking by: ${trackBy}, Value: ${trackingValue}`);
//     alert(`Simulating track for ${trackBy}: ${trackingValue}`);
//   };

//   const getPlaceholder = () => {
//     switch (trackBy) {
//       case 'AWB':
//         return 'Enter AWB Number';
//       case 'Order Id':
//         return 'Enter Order ID';
//       default:
//         return 'Enter Tracking ID';
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center h-full p-4 sm:p-6 md:p-8">
//       <div className="max-w-md mx-auto w-full">
//         <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
//           Track Your Order
//         </h2>
        
//         <form onSubmit={handleTrackNow} className="space-y-4 sm:space-y-6">
//           <div>
//             <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">Track By:</label>
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               {(['AWB', 'Order Id'] as const).map((method) => (
//                 <label key={method} className="flex items-center space-x-2 cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors">
//                   <input
//                     type="radio"
//                     name="trackBy"
//                     value={method}
//                     checked={trackBy === method}
//                     onChange={() => {
//                       setTrackBy(method);
//                       setTrackingValue('');
//                     }}
//                     className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
//                   />
//                   <span className="text-sm sm:text-base text-gray-700">{method}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <input
//               type="text"
//               value={trackingValue}
//               onChange={(e) => setTrackingValue(e.target.value)}
//               placeholder={getPlaceholder()}
//               className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base shadow-sm"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-purple-600 text-white py-3 sm:py-3.5 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
//           >
//             Track Now
//           </button>
//         </form>

//         <div className="mt-8 sm:mt-10 text-center">
//           <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
//             Can&apos;t Find Your Order Details?
//           </h3>
//           <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-md mx-auto">
//             We sent your AWB tracking number to you via Email & SMS upon order confirmation.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
// // --- End of New BuyerTrackingView Component ---

// const RegisterPage: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     userType: 'seller',
//     accountType: 'BUSINESS',
//     firstName: '',
//     lastName: '',
//     companyName: '',
//     phoneNumber: '',
//     email: '',
//     password: '',
//     ordersPerMonth: '',
//     agreeToTerms: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showOtpVerification, setShowOtpVerification] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [sessionUuid, setSessionUuid] = useState("");
//   const [isFormValid, setIsFormValid] = useState(false);
//   const { register } = useAuth();

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//     // Clear any previous error when user starts editing
//     setError('');
//   };

//   useEffect(() => {
//     const { firstName, lastName, companyName, phoneNumber, email, password, ordersPerMonth, agreeToTerms, accountType } = formData;
//     const baseValid =
//       firstName.trim() !== '' &&
//       lastName.trim() !== '' &&
//       phoneNumber.trim() !== '' &&
//       email.trim() !== '' &&
//       password.trim() !== '' &&
//       agreeToTerms;

//     const isValid = accountType === 'BUSINESS'
//       ? baseValid && companyName.trim() !== '' && ordersPerMonth !== ''
//       : baseValid;

//     setIsFormValid(isValid);
//   }, [formData]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isFormValid) return;

//     setLoading(true);
//     setError('');

//     // build base payload
//     const base: any = {
//       first_name: formData.firstName,
//       last_name: formData.lastName,
//       company_name: formData.companyName,
//       phone_number: formData.phoneNumber,
//       email: formData.email,
//       password: formData.password,
//       user_type: formData.accountType,
//     };
//     if (formData.accountType === 'BUSINESS') {
//       base.parcels_per_month = formData.ordersPerMonth;
//     }

//     const res = await register(base);
//     if (res.success && res.session_uuid) {
//       setSessionUuid(res.session_uuid);
//       setShowOtpVerification(true);
//     } else {
//       setError(res.error  || 'Registration initiation failed.');
//     }

//     setLoading(false);
//   };

//   const handleEditPhoneNumber = () => {
//     setShowOtpVerification(false);
//     setError('');
//   };

//   const handleVerifyOtp = async (otp: string) => {
//     setLoading(true);
//     setError('');

//     const payload: any = {
//       first_name: formData.firstName,
//       last_name: formData.lastName,
//       company_name: formData.companyName,
//       phone_number: formData.phoneNumber,
//       email: formData.email,
//       password: formData.password,
//       user_type: formData.accountType,
//       otp,
//       session_uuid: sessionUuid,
//     };
//     if (formData.accountType === 'BUSINESS') {
//       payload.parcels_per_month = formData.ordersPerMonth;
//     }

//     const res = await register(payload);
//     if (!res.success) {
//       setError(res.error || 'Registration failed.');
//     }
//     setLoading(false);
//   };

//   const features = [
//     'AI-Powered Courier Selection',
//     'Branded Order Tracking Page',
//     'Automated NDR Management',
//     'Up To 45% Lesser RTOs'
//   ];

//   const brands = [
//     { name: 'Zomato', color: 'text-red-500' },
//     { name: 'Samsung', color: 'text-blue-600' },
//     { name: 'Levi\'s', color: 'text-blue-700' },
//     { name: 'Wildcraft', color: 'text-purple-600' },
//     { name: 'Fabindia', color: 'text-orange-600' },
//     { name: 'boAt', color: 'text-gray-700' },
//     { name: 'Bata', color: 'text-red-600' },
//     { name: 'Snitch', color: 'text-gray-600' }
//   ];

//   // OTP Step
//   if (showOtpVerification && formData.userType === 'seller') {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//         <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8">
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Verify Your Account</h2>
//           <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
//             We&apos;ve sent a verification code to your phone number ending in{' '}
//             <span className="font-semibold">
//               {formData.phoneNumber.slice(-4)}
//             </span>
//           </p>

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm">
//               {error}
//             </div>
//           )}

//           <OtpVerificationView
//             phoneNumber={formData.phoneNumber}
//             onEditPhoneNumber={handleEditPhoneNumber}
//             onVerifyOtp={handleVerifyOtp}
//             loading={loading}
//           />
//         </div>
//       </div>
//     );
//   }

//   // Main Registration / Tracking View
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
//       <div className="w-full max-w-7xl bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
//         <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px]">
//           {/* Left Section - Features */}
//           <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 p-8 xl:p-12 flex-col justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
//             <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
            
//             <div className="relative z-10 max-w-lg">
//               <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-6 xl:mb-8 leading-tight">
//                 We Are More than Just a{' '}
//                 <span className="text-yellow-300">
//                   Shipping Partner
//                 </span>
//               </h1>
//               <div className="space-y-4 mb-8 xl:mb-10">
//                 {features.map((feature, index) => (
//                   <div key={index} className="flex items-center space-x-3">
//                     <div className="w-6 h-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
//                       <Check className="w-4 h-4 text-white" />
//                     </div>
//                     <span className="text-sm xl:text-base text-white font-medium">{feature}</span>
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <h3 className="text-base xl:text-lg font-semibold text-white mb-4">Trusted by 1 Lakh+ Brands</h3>
//                 <div className="grid grid-cols-4 gap-3 xl:gap-4">
//                   {brands.map((brand, index) => (
//                     <div key={index} className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-2">
//                       <span className="font-bold text-xs xl:text-sm text-white">
//                         {brand.name}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Right Section - Form */}
//           <div className="w-full lg:w-1/2 xl:w-7/12 p-4 sm:p-6 md:p-8 xl:p-12 flex flex-col">
//             {/* Mobile Header - Visible only on mobile */}
//             <div className="lg:hidden mb-6 text-center">
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//                 Welcome to <span className="text-purple-600">Shiprocket</span>
//               </h1>
//               <p className="text-sm text-gray-600">Your Shipping Partner</p>
//             </div>

//             {/* User Type Toggle */}
//             <div className="flex gap-2 mb-6 sm:mb-8">
//               <button
//                 type="button"
//                 onClick={() => setFormData(prev => ({ ...prev, userType: 'seller' }))}
//                 className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 rounded-xl font-medium transition-all ${
//                   formData.userType === 'seller'
//                     ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
//                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 <div className="flex flex-col items-center space-y-1">
//                   <span className="text-xl sm:text-2xl">👨‍💼</span>
//                   <span className="text-xs sm:text-sm font-semibold">I&apos;m a Seller</span>
//                   <span className="text-[10px] sm:text-xs opacity-80">I sell my products online</span>
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
//                 className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 rounded-xl font-medium transition-all ${
//                   formData.userType === 'buyer'
//                     ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
//                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 <div className="flex flex-col items-center space-y-1">
//                   <span className="text-xl sm:text-2xl">🛒</span>
//                   <span className="text-xs sm:text-sm font-semibold">Track your order</span>
//                   <span className="text-[10px] sm:text-xs opacity-80">I&apos;m here to track an order</span>
//                 </div>
//               </button>
//             </div>

//             {formData.userType === 'seller' ? (
//               <div className="flex-1 flex flex-col">
//                 <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
//                   Get started with a free account
//                 </h2>

//                 {error && (
//                   <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm">
//                     {error}
//                   </div>
//                 )}
                
//                 <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
//                   {/* Account Type Selection */}
//                   <div>
//                     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Account Type</label>
//                     <div className="grid grid-cols-2 gap-2 sm:gap-3">
//                       <button
//                         type="button"
//                         onClick={() => setFormData(prev => ({ ...prev, accountType: 'BUSINESS' }))}
//                         className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-2 font-medium transition-all text-xs sm:text-sm ${
//                           formData.accountType === 'BUSINESS'
//                             ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
//                             : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
//                         }`}
//                       >
//                         <span className="text-base sm:text-lg mr-1">🏢</span> Business
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setFormData(prev => ({ ...prev, accountType: 'INDIVIDUAL' }))}
//                         className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-2 font-medium transition-all text-xs sm:text-sm ${
//                           formData.accountType === 'INDIVIDUAL'
//                             ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
//                             : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
//                         }`}
//                       >
//                         <span className="text-base sm:text-lg mr-1">👤</span> Individual
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">First Name</label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleInputChange}
//                         placeholder="John"
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleInputChange}
//                         placeholder="Doe"
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {formData.accountType === 'BUSINESS' && (
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Company Name</label>
//                       <input
//                         type="text"
//                         name="companyName"
//                         value={formData.companyName}
//                         onChange={handleInputChange}
//                         placeholder="Your Company Ltd."
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
//                         required
//                       />
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                       <input
//                         type="tel"
//                         name="phoneNumber"
//                         value={formData.phoneNumber}
//                         onChange={(e) => {
//                           const digits  = e.target.value.replace(/\D/g, '');
//                           const clamped = digits.slice(0, 10);
//                           setFormData(prev => ({ ...prev, phoneNumber: clamped }));
//                           setError('');
//                         }}
//                         onKeyDown={(e) => {
//                           const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab'];
//                           if (
//                             formData.phoneNumber.length >= 10 &&
//                             !allowed.includes(e.key)
//                           ) {
//                             e.preventDefault();
//                           }
//                         }}
//                         placeholder="9876543210"
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email ID</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         placeholder="john@example.com"
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? 'text' : 'password'}
//                         name="password"
//                         value={formData.password}
//                         onChange={handleInputChange}
//                         placeholder="Enter a strong password"
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 text-sm sm:text-base"
//                         required
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
//                       </button>
//                     </div>
//                   </div>

//                   {formData.accountType === 'BUSINESS' && (
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Orders per month</label>
//                       <select
//                         name="ordersPerMonth"
//                         value={formData.ordersPerMonth}
//                         onChange={handleInputChange}
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
//                         required
//                       >
//                         <option value="">Please Select</option>
//                         <option value="1-50">1-50 orders</option>
//                         <option value="51-200">51-200 orders</option>
//                         <option value="201-500">201-500 orders</option>
//                         <option value="500+">500+ orders</option>
//                       </select>
//                     </div>
//                   )}

//                   <div className="flex items-start space-x-2">
//                     <input
//                       type="checkbox"
//                       name="agreeToTerms"
//                       checked={formData.agreeToTerms}
//                       onChange={handleInputChange}
//                       className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5 flex-shrink-0"
//                       required
//                     />
//                     <label className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
//                       By clicking Sign up for Free, you agree to Shiprocket&apos;s{' '}
//                       <Link href="/terms-of-service" className="text-purple-600 hover:underline font-medium">Terms Of Service</Link> and{' '}
//                       <Link href="#" className="text-purple-600 hover:underline font-medium">Privacy Policy</Link>
//                     </label>
//                   </div>

//                   <div className="flex-1"></div>

//                   <button
//                     type="submit"
//                     disabled={!isFormValid || loading}
//                     className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 sm:py-3.5 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base ${
//                       !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                   >
//                     {!loading ? "Sign up for Free" : "Signing up...."}
//                   </button>
//                 </form>

//                 <div className="text-center mt-4 text-xs sm:text-sm">
//                   <span className="text-gray-600">Already have an account? </span>
//                   <Link href="/login" className="text-purple-600 hover:underline font-medium">Login</Link>
//                 </div>
//               </div>
//             ) : (
//               <BuyerTrackingView />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;