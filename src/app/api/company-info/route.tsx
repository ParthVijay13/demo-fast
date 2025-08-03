import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';


export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("this is the body",body)

    // Get token from header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'No auth token.' }, { status: 401 });
    }
    console.log("ghsgfhsfghf");
    
    // Call your real backend API
    const res = await axios.patch(
      `${process.env.BASE_URL}/company/info`,
      body,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        
      }
    );

    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    // If backend sent a response, forward its status/message
      return NextResponse.json(
        { success: false, message: err.response.data?.message || 'Failed to update company info' },
      );
    }
   
  }




export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ success: false, message: "No auth token." }, { status: 401 });
  }

  try {
    // Use Axios to call your backend API
    const res = await axios.get(`${process.env.BASE_URL}/company/info`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
     
    });

    // Return backend response directly to client
    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    
      return NextResponse.json(
        { success: false, message: err.response.data?.message || "Failed to fetch company info" },
        { status: err.response.status }
      );
    }
    
  }

