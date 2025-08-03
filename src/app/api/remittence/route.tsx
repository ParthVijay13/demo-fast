// app/api/remmitance/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ success: false, message: 'No auth token.' }, { status: 401 });
  }
  try {
    const res = await axios.get(`${process.env.BASE_URL}/remittence`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || "Failed to fetch bank details" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Parse incoming request body
    const body = await req.json();
    console.log("Received body:", body);
    
    // Get token from Authorization header (if you are passing from frontend)
    const authHeader = req.headers.get('authorization');
    
    // Send POST to your backend Express API
    const apiResponse = await axios.patch(
      `${process.env.BASE_URL}/remittence`, // Change port if needed
      body,
      {
        headers: {
          Authorization: authHeader ?? "",
        },
      }
    );

    // Forward the response back to Next.js frontend
    return NextResponse.json(apiResponse.data, { status: 200 });
  } catch (error: any) {
    console.error("Remittance Proxy Error:", error?.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error?.response?.data?.message || "Internal Server Error" },
      { status: error?.response?.status || 500 }
    );
  }
}
