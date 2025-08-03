// pages/api/kyc/aadhar/otp.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     console.log("this is the response from otp :");
    
//     const backendRes = await axios.post(
//       `${process.env.BACKEND_URL}/kyc/aadhar/otp`,
//       req.body,
//       {
//         headers: {
//           Authorization: req.headers.authorization || '',
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//     res.status(backendRes.status).json(backendRes.data);
//   } catch (error: any) {
//     res
//       .status(error.response?.status || 500)
//       .json(error.response?.data || { message: error.message });
//   }
// }

// app/api/kyc/aadhar/otp/route.ts
import { NextResponse } from 'next/server';
export const runtime = 'edge';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // const authHeader = req.headers.get('authorization') ?? '';
      // console.log("dsf",authHeader);
    const backendRes = await axios.post(
      `${process.env.BASE_URL}/kyc/aadhar/otp`,
      body,
      {
         headers: {
        Authorization: req.headers.get('authorization') || '',
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
