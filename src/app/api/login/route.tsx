import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, phone_number, email, password, otp, session_uuid } = body;
    
    const backendUrl = `${process.env.BASE_URL}/auth/login`;
    // console.log(backendUrl)
    
    
    const payload = phone_number
      ? { type, phone_number, ...(otp && session_uuid ? { otp, session_uuid } : {}) }
      : { type, email, password };

    // Make request to backend API
    const response = await axios.post(backendUrl, payload);
    return NextResponse.json(response.data, { status: response.data.status_code });
  } catch (error: any) {
    return NextResponse.json(
      { success: error.response.data.success, message: error.response.data.message },
      { status: error.response.data.status_code }
    );
  }
}