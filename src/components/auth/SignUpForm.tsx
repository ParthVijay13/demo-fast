

"use client";
import React, { useState, useRef, useMemo } from "react";
import { useAuth } from '../../context/AuthContext';
import Link from "next/link";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import OtpVerificationView from '../otp/OtpVerificationView'; // Import the OTP component
import axios, { AxiosError } from "axios";
export default function SignUpPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [loginwithEmail, setloginwithEmail] = useState<boolean>(true);
  // const [loginwithnumber, setLoginwithNumber] = useState<boolean>(false)
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showOtpVerification, setShowOtpVerification] = useState<boolean>(false);
  const [otpPhoneNumber, setOtpPhoneNumber] = useState<string>("");
  const [session_uuid, setSessionUuid] = useState("");


  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { login, loginWithOtp } = useAuth();

  // const handleContinue = async () => {
  //   // Clear any existing timeout
  //   if (errorTimeoutRef.current) {
  //     clearTimeout(errorTimeoutRef.current);
  //   }

  //   // Validate that at least one field is filled
  //   if (!phoneNumber && (!email || !password)) {
  //     setError("Please enter either your phone number or email address");
  //     errorTimeoutRef.current = setTimeout(() => {
  //       setError("");
  //     }, 1000);
  //     return;
  //   }

  //   // Validate that both fields are not filled
  //   if (phoneNumber && (email && password)) {
  //     setError("Please enter either phone number or email address, not both");
  //     errorTimeoutRef.current = setTimeout(() => {
  //       setError("");
  //     }, 3000);
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   // If phone number is provided, show OTP verification
  //   if (phoneNumber) {
  //     setOtpPhoneNumber(phoneNumber);
  //     setShowOtpVerification(true);
  //     setLoading(false);
  //     return;
  //   }

  //   // If email is provided, proceed with email login
  //   if (email && password) {
  //     const result = login(phoneNumber, email, password);
  //     if (!result.success) {
  //       setError(result.error || "Login failed");
  //       errorTimeoutRef.current = setTimeout(() => {
  //         setError("");
  //       }, 3000);
  //     }
  //     setLoading(false);
  //   }
  // };
  const handleFormToggle = () => {
    if (loading) return; // Prevent toggle during loading

    setloginwithEmail(prev => !prev);
    setError("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
  };
  const isEmailFormValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() !== "" &&
      emailRegex.test(email) &&
      password.trim() !== "" &&
      password.length >= 6; // Minimum password length
  }, [email, password]);

  const isPhoneFormValid = useMemo(() => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number validation
    return phoneNumber.trim() !== "" &&
      phoneRegex.test(phoneNumber);
  }, [phoneNumber]);

  // Determine if the current form is valid
  const isFormValid = useMemo(() => {
    if (loginwithEmail) {
      return isEmailFormValid;
    } else {
      return isPhoneFormValid;
    }
  }, [loginwithEmail, isEmailFormValid, isPhoneFormValid]);
  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    
    // Bypass all validation and API calls - redirect directly to home
    if (phoneNumber || (email && password)) {
      // Redirect to home page
      window.location.href = '/';
      return;
    }
    
    // Only show error if no credentials provided
    setError("Please enter either your phone number or email address");
    errorTimeoutRef.current = setTimeout(() => setError(""), 1000);
  }

  const handleEditPhoneNumber = () => {
    setShowOtpVerification(false);
    setOtpPhoneNumber("");
    // Keep the phone number in the input
  };

  // const handleVerifyOtp = async (otp: string) => {
  //   setLoading(true);

  //   // Here you would typically verify the OTP with your backend
  //   // For now, let's simulate OTP verification with a dummy check
  //   if (otp === "123456") { // Replace with actual OTP verification
  //     // After successful OTP verification, login the user
  //     console.log("when using correct otp")
  //     const result = login(otpPhoneNumber, "", "");
  //     console.log(result);

  //     if (!result.success) {
  //       // console.log("=======");
  //       setError(result.error || "Login failed");
  //       errorTimeoutRef.current = setTimeout(() => {
  //         setError("");
  //       }, 3000);
  //     }
  //   } else {
  //     setError("Invalid OTP. Please try again.");
  //     errorTimeoutRef.current = setTimeout(() => {
  //       setError("");
  //     }, 3000);
  //   }

  //   setLoading(false);
  // };
  const handleVerifyOtp = async (otp: string) => {
    // Bypass OTP verification - redirect directly to home
    window.location.href = '/';
  };

  // If OTP verification is active, show the OTP component
  if (showOtpVerification) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 lg:w-1/2 justify-center items-center flex">
        <div className="flex flex-1 w-full px-4 sm:px-8">
          <OtpVerificationView
            phoneNumber={otpPhoneNumber}
            onEditPhoneNumber={handleEditPhoneNumber}
            onVerifyOtp={handleVerifyOtp}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 lg:w-1/2 justify-center items-center flex">
      {/* Left Section - Form */}
      <div className="flex flex-1 w-full px-4 sm:px-8">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto pb-10">

          <div>
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              {loginwithEmail ? (

                <div>
                  <form onSubmit={handleContinue}>

                    <div className="mb-5 sm:mb-8">
                      <h1 className="mb-2 font-semibold text-gray-800 text-2xl sm:text-3xl dark:text-white/90">
                        Login for Business
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your details to Login!
                      </p>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {

                          setEmail(e.target.value);
                          if (e.target.value && phoneNumber) {
                            setPhoneNumber("");
                          }
                        }}
                        placeholder="info@gmail.com"
                        className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-900 dark:text-white"
                      />
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setPassword(e.target.value);
                        }}
                        placeholder="Enter your password"
                        className="w-full px-4  py-3 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      onClick={handleContinue}
                      disabled={!isFormValid || loading}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-4"
                    >
                      {loading ? "Signing Up..." : "Login"}
                    </button>
                  </form>
                </div>


              ) : (
                <form onSubmit={handleContinue}>
                  <div className="space-y-6">

                    <div className="mb-5 sm:mb-8">
                      <h1 className="mb-2 font-semibold text-gray-800 text-2xl sm:text-3xl dark:text-white/90">
                        Sign Up for Business
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your details to create your account!
                      </p>
                    </div>
                    {/* Phone Number Input */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
                        <div className="flex items-center px-3 py-3 bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">+91</span>
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          disabled={loading}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              setPhoneNumber(value);
                              if (value && email) {
                                setEmail("");
                              }
                              if (error) setError("");
                            }
                          }}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                            if (phoneNumber.length >= 10 && !allowedKeys.includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          placeholder="XXXXXXXXXX"
                          className="flex-1 px-4 py-3 text-sm bg-white dark:bg-gray-900 border-0 focus:outline-none dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      {/* {phoneNumber && !isPhoneFormValid && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9
                        </p>
                      )} */}
                      {/* //orders, dashboard, returns, settings, Integrations */}
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!isFormValid || loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                      >
                        {loading ? "Signing Up..." : "Continue"}
                      </button>
                    </div>

                  </div>
                </form>

              )}
              <div>
                <div className="relative py-3 sm:py-5 ">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                      Or
                    </span>
                  </div>
                </div>
                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-4"
                  onClick={handleFormToggle} // Toggle the view
                >
                  {loginwithEmail ? "Continue with Number" : "Continue with Email"}
                </button>

                <p className="text-center p-4">Don&apos;t have an account <Link href={"/register"} className="text-purple-600">register</Link></p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



