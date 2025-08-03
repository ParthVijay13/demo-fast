import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { old_password, new_password, confirm_password } = await req.json();
    
    const authHeader: string | null = req.headers.get('Authorization');
    
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'No token' },
        { status: 401 }
      );
    }

    // Forward this request to your backend API using Axios
    const response = await axios.post(
      `${process.env.BASE_URL}/auth/change-password`,
      {
        old_password,
        new_password,
        confirm_password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return NextResponse.json(
      { 
        message: response.data.message || 'Password changed successfully', 
        data: response.data 
      },
      { status: response.status }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: error.response.data.success, message: error.response.data.message },
      { status: error.response.data.status_code }
    );
  }
}