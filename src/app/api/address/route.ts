// src/app/api/address/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from "axios"
// const BACKEND_URL = process.env.BASE_URL!
export const runtime = 'edge';




export async function GET(req: NextRequest) {
  // Grab token from Authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: 'No auth token.' },
      { status: 401 }
    );
  }

  try {
    // Call your backend API
    const res = await axios.get(`${process.env.BASE_URL}/address`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });
    // Return backend response directly
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || "Failed to fetch address" },
      { status: err.response?.status || 500 }
    );
  }
}


export async function PATCH(req:NextRequest) {
  try {
    const body = await req.json();
    const headers = Object.fromEntries(req.headers.entries());
    headers['Content-Type'] = 'application/json';

    // Axios PATCH request
    const res = await axios.patch(`${ process.env.BASE_URL}/address`, body, { headers });

    // Return backend response
    return NextResponse.json(res.data, { status: res.status });
  } catch (error:any) {
    return NextResponse.json(error.response.data, { status: error.response.status });
  }
}