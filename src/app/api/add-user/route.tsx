// // app/api/add-user/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';

// export async function POST(request: NextRequest) {
//   try {
//     // Parse the request body
//     const body = await request.json();
//     console.log(body);
    
    
//     // Validate required fields
//     const { first_name, last_name, email, role, permissions, buyer_detail_access } = await body;
//     // console.log(buyer_detail_access)
    
    
//     const authHeader = request.headers.get('Authorization');
//     const token = authHeader.split(' ')[1];
//     // console.log(token)

//     // Prepare data for backend API
//     const userData = {
//       first_name,
//       last_name,
//       email,
//       role: role.toUpperCase(), // Ensure role is uppercase
//       permissions: permissions || [],
//       buyer_detail_access: buyer_detail_access === 'Allowed' ? true : false
//     };
//     console.log("this is userdata",userData)
//     Make API call to backend
//         const response = await axios.post(
//     `http://localhost:5000/api/v1/auth/user`,
//     userData,
//     {
//         headers: {
        
//         'Authorization': `Bearer ${token}`,
//         },
//         timeout: 10000, // 10 second timeout
//     }
// );
//   console.log("this is response");

//     // Return success response
//     // return NextResponse.json(
//     //   { 
//     //     message: response.data.message ||'User added successfully', 
//     //     data: response.data,
//     //     user: {
//     //       id: response.data.id || Date.now(), // Use backend ID or fallback
//     //       name: `${first_name} ${last_name}`,
//     //       email,
//     //       lastLogin: 'NA',
//     //       modules: permissions || [],
//     //       buyerDetailAccess: buyer_detail_access === 'Allowed' ? true : false,
//     //       role,
//     //     //   status: 'ACTIVE'
//     //     }
//     //   },
//     //   { status: 201 }
//     // );
    
//     return NextResponse.json({
//       "message":"mukund ki "
//     })
//   } 
//    catch (error: any) {
//     console.log("this is not working user is not creating ")
//     return NextResponse.json(
//       { success: error.response.data.success, message: error.response.data.message },
//       { status: error.response.data.status_code }
//     );
//   }
// }   


// // app/api/add-user/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';

// export async function POST(request: NextRequest) {
//   try {
//     // 1. Parse and destructure the incoming JSON
//     const {
//       first_name,
//       last_name,
//       email,
//       role,
//       permissions,
//       buyer_detail_access
//     } = await request.json();

//     // 2. Extract the bearer token
//     const authHeader = request.headers.get('Authorization') || '';
//     const token = authHeader.split(' ')[1] || '';

//     // 3. Prepare payload for your real backend
//     const userData = {
//       first_name,
//       last_name,
//       email,
//       role: role.toUpperCase(),
//       permissions: permissions || [],
//       buyer_detail_access: buyer_detail_access === 'Allowed'?true:false
//     };
//     console.log('this is userdata', userData);

//     // 4. Forward to your actual API
//     const response = await axios.post(
//       'http://localhost:5000/api/v1/auth/add-user',
//       userData,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         timeout: 10000,
//       }
//     );

//     // 5. Log the successful backend response
//     console.log('backend responded:', response.data);

//     // 6. Return a 201 to the client
//     return NextResponse.json(
//       {
//         message: response.data.message || 'User added successfully',
//         data: response.data,
//         user: {
//           id: response.data.id || Date.now(),
//           name: `${first_name} ${last_name}`,
//           email,
//           lastLogin: 'NA',
//           modules: permissions || [],
//           buyerDetailAccess: buyer_detail_access === 'Allowed',
//           role,
//         }
//       },
//       { status: 201 }
//     );

//   } catch (err: any) {
//     // 7. Extract real backend error
//     const status = err.response?.status || 500;
//     const message = err.response?.data?.message || 'Unknown error when creating user';
//     console.error('add-user failed:', {
//       status,
//       body: err.response?.data
//     });

//     // 8. Forward the error status & message to your React client
//     return NextResponse.json(
//       { success: false, message },
//       { status }
//     );
//   }
// }







// app/api/add-user/route.ts


import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse incoming JSON body
    const { first_name, last_name, email, role, permissions, buyer_detail_access } =
      await request.json();

    // 2. Extract bearer token from incoming headers
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.split(' ')[1] || '';

    // 3. Build payload for backend
    const userData = {
      first_name,
      last_name,
      email,
      role: role.toUpperCase(),
      permissions: permissions || [],
      buyer_detail_access: Boolean(buyer_detail_access),
    };
    console.log('this is userdata', userData);
    
    // 4. Forward to real backend API
    const response = await axios.post(
      `${process.env.BASE_URL}/auth/user`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      }
    );
    console.log('backend responded:', response.data);

    // 5. Return success to client
    return NextResponse.json(
      {
        message: response.data.message || 'User added successfully',
        data: response.data,
        user: {
          id: response.data.id || Date.now(),
          name: `${first_name} ${last_name}`,
          email,
          lastLogin: 'NA',
          modules: permissions || [],
          buyerDetailAccess: Boolean(buyer_detail_access),
          role,
        },
      },
      { status: response.status }
    );

  } catch (err: any) {
    // 6. Error handling: forward real status and message
    console.error('add-user failed:', err.response?.status, err.response?.data);
    console.log("This is add user error ",err.response.data.message)
    const status = err.response?.data.status_code;
    const message = err.response?.data?.message || 'Unknown error when creating user';
    return NextResponse.json(
      { success: err.response?.data.success, message },
      { status }
    );
  }
}



