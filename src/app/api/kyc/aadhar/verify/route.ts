// app/api/kyc/aadhar/verify/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';
// import { News_Cycle } from 'next/font/google';

export async function POST(req: Request) {
  try {
    const body = await req.json();
     console.log(body)
    const authHeader = req.headers.get('authorization') ?? '';

    const backendRes = await axios.post(
      `${process.env.BASE_URL}/kyc/aadhar/verify`,
      body,
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(backendRes);

    return NextResponse.json(backendRes.data, { status: backendRes.status });
    // return NextResponse.json({msg:"hello babe"});
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: error.message };
    return NextResponse.json(data, { status });
  }
}
