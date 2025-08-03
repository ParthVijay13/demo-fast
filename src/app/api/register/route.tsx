// import { NextResponse } from 'next/server';
// import axios from "axios" ;
// const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5000';

// export async function POST(request: Request) {
//   try {
//     const formData = await request.json();

//     // Validate required fields
//     if (!formData.phone_number || !formData.email) {
//       return NextResponse.json(
//         { error: 'Phone number and email are required' },
//         { status: 400 }
//       );
//     }

//     // Determine if this is initial registration or OTP verification
//     const isOtpVerification = Boolean(formData.otp && formData.session_uuid);

//     // Prepare payload - remove redundancy by using spread operator efficiently
//     const basePayload = {
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       company_name: formData.company_name,
//       phone_number: formData.phone_number,
//       email: formData.email,
//       password: formData.password,
//       parcels_per_month: formData.parcels_per_month
//     };

//     const payload = isOtpVerification 
//       ? { ...basePayload, otp: formData.otp, session_uuid: formData.session_uuid }
//       : basePayload;

//     // Call backend API
//     const response = await axios.post(`http://localhost:5000/api/v1/auth/register`, 
//       payload
//     );
//     // const data = await response.json();
//    return NextResponse.json(response.data, { status: response.data.status_code });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: error.response.data.success, message: error.response.data.message },
//       { status: error.response.data.status_code }
//     );
//   }
// }



// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';

// const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Validate required fields
    if (!formData.phone_number || !formData.email) {
      return NextResponse.json(
        { error: 'Phone number and email are required' },
        { status: 400 }
      );
    }

    // Determine if this is initial registration or OTP verification
    const isOtpVerification = Boolean(formData.otp && formData.session_uuid);

    // Build base payload
    const basePayload: Record<string, any> = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      email: formData.email,
      password: formData.password,
      user_type: formData.user_type || formData.accountType, 
      // accept either `user_type` or map from `accountType`
    };

    // Only include company_name & parcels_per_month when provided (i.e. BUSINESS)
    if (formData.company_name) {
      basePayload.company_name = formData.company_name;
    }
    if (formData.parcels_per_month) {
      basePayload.parcels_per_month = formData.parcels_per_month;
    }

    // Add OTP fields if this is the verification step
    const payload = isOtpVerification
      ? {
          ...basePayload,
          otp: formData.otp,
          session_uuid: formData.session_uuid,
        }
      : basePayload;
      

      console.log("this is your payload",payload)
    // Forward to your backend
    const response = await axios.post(
      `${process.env.BASE_URL}/auth/register`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Return backend’s response
    return NextResponse.json(
      response.data,
      { status: response.data.status_code || 200 }
    );
  } catch (err: any) {
    // Handle errors from backend or network
    const status = err.response?.data?.status_code || 500;
    const body = {
      success: err.response?.data?.success ?? false,
      message: err.response?.data?.message || err.message,
    };
    return NextResponse.json(body, { status });
  }
}
