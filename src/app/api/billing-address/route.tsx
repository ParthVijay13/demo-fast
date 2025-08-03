import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ success: false, message: 'No auth token.' }, { status: 401 });
  }

  try {
    const res = await axios.get(`${process.env.BASE_URL}/company/billing-address`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || "Failed to fetch billing address" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'No auth token.' }, { status: 401 });
    }
    const res = await axios.patch(
      `${process.env.BASE_URL}/company/billing-address`,
      body,
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        }
      }
    );
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || 'Failed to update billing address' },
      { status: err.response?.status || 500 }
    );
  }
}
