import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  try {
    const res = await axios.get(`${process.env.BASE_URL}/auth/user`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || "Failed to fetch permissions" },
      { status: err.response?.status || 500 }
    );
  }
}
