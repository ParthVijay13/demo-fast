"use client";
import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from "react";
// import { useAuth } from '../../context/AuthContext'; // Assuming this path is correct
// Link, ChevronLeftIcon, EyeCloseIcon, EyeIcon are not used in the OTP flow, removed for brevity unless needed elsewhere.
// import { useRouter } from 'next/navigation';

// Simple Pencil Icon SVG component
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
    <path d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828Z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h4a1 1 0 0 1 0 2H4v10h10v-4a1 1 0 1 1 2 0v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Z" clipRule="evenodd" />
  </svg>
);

interface OtpVerificationViewProps {
  phoneNumber: string;
  onEditPhoneNumber: () => void;
  onVerifyOtp: (otp: string) => void;
  loading: boolean;
  error?: string
}

const OtpVerificationView: React.FC<OtpVerificationViewProps> = ({
  phoneNumber,
  onEditPhoneNumber,
  onVerifyOtp,
  loading,
  error
}) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    // Allow only one digit
    const digit = value.slice(-1);

    if (/^[0-9]$/.test(digit) || digit === "") {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = digit;
      setOtpDigits(newOtpDigits);

      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent default backspace behavior (like navigating back)
      const newOtpDigits = [...otpDigits];
      if (newOtpDigits[index]) {
        newOtpDigits[index] = ""; // Clear current input
        setOtpDigits(newOtpDigits);
      } else if (index > 0) {
        newOtpDigits[index - 1] = ""; // Clear previous input if current is already empty
        setOtpDigits(newOtpDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d{0,6}$/.test(pastedData)) {
      const newOtpDigits = [...otpDigits];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) { // Ensure we don't go out of bounds for otpDigits
          newOtpDigits[i] = pastedData[i];
        }
      }
      setOtpDigits(newOtpDigits);
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      if (pastedData.length === 6) {
        inputRefs.current[5]?.focus();
      }
    }
  };


  const handleSubmit = () => {
    const otp = otpDigits.join("");
    if (otp.length === 6) {
      onVerifyOtp(otp);
      setOtpDigits(new Array(6).fill(""));
    } else {
      // Optionally, set an error state for OTP view (out of scope as per prompt)
      console.warn("OTP is not 6 digits long");
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto py-10 px-4 sm:px-0">
      <h1 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">
        Verify Your Phone Number
      </h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Enter the 6 digit OTP sent to mobile number
      </p>
      <div className="mb-6 flex items-center">
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
          +91 {phoneNumber}
        </span>
        <button
          onClick={onEditPhoneNumber}
          className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Edit phone number"
        >
          <PencilIcon />
        </button>
      </div>

      <div className="mb-8 flex justify-between space-x-2 sm:space-x-3">
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
      inputRefs.current[index] = el;   // ← no value returned
    }}
            type="tel" // Use "tel" for numeric keyboard on mobile
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined} // Allow paste only on the first input
            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-medium border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-colors"
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      {/* "Didn't receive OTP? Resend via SMS" - As per image, but functionality not implemented */}
      <div className="mb-6 text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Didn&apos;t receive OTP? </span>
        <button className="font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
          Resend via SMS
        </button>
      </div>
      {error && (
        <div className="mb-4 text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || otpDigits.join("").length !== 6}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        {loading ? "Verifying..." : "Verify Number"}
      </button>
    </div>
  );
};

export default OtpVerificationView;