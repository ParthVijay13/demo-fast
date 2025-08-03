// app/api/kyc/gstin/verify/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("this is the body for gstin",body)
    const authHeader = req.headers.get('authorization') ?? '';

    const backendRes = await axios.post(
      `${process.env.BASE_URL}/kyc/gstin/verify`,
      body,
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(backendRes.data, { status: backendRes.status });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: error.message };
    return NextResponse.json(data, { status });
  }
}
