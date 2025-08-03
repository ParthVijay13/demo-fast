import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ success: false, message: 'No auth token.' }, { status: 401 });
  }
  try {
    const res = await axios.get(`${process.env.BASE_URL}/kyc/business-info`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || "Failed to fetch business info" },
      { status: err.response?.status || 500 }
    );
  }
}
