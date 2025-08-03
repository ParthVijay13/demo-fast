// app/api/kyc/pan/verify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // console.log("into the file nextjs")
    const auth = req.headers.get('authorization') 
    console.log("this is the auth header",auth)
    const body = await req.json();           // { pan, name }
    const backend = process.env.BASE_URL; // e.g. http://localhost:5000
    const resp   = await axios.post(`${backend}/kyc/pan/verify`, body, {
      headers: {
        Authorization: auth || '',
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(resp.data, { status: resp.status });
  } catch (err: any) {
    console.log("error in pan verify route",err.response.data);    
    const status = err.response?.status || 500;
    const data   = err.response?.data   || { message: err.message };
    return NextResponse.json(data, { status });
  }
}

