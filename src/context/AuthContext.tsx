
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from "axios";
// Define the User interface based on your API response
interface User {
  id: string;
  org_id: string;
  role: string;
  user_permissions: string[];
  access_token: string;
  email?: string;
  phone_number?: string;
  name?: string;
}
 
// Define the AuthContext interface
interface AuthContextType {
  user: User | null;
  register: (payload: {
    first_name: string;
    last_name: string;
    company_name?: string;
    phone_number: string;
    email: string;
    password: string;
    user_type: string;
    parcels_per_month?: string;
    otp?: string;
    session_uuid?: string;
  }) =>Promise<{ success: boolean; session_uuid?: string; error?: string }>;
  login: (phoneNumber: string, email: string, password: string, access_token?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginWithOtp: (phoneNumber: string, otp: string, session_uuid: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const UNPROTECTED_ROUTES = ['/login', '/register'];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        // Ensure access_token is set
        parsedUser.access_token = storedToken;
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Route protection logic
    if (!loading) {
      const isUnprotectedRoute = UNPROTECTED_ROUTES.includes(pathname);

      if (!user && !isUnprotectedRoute) {
        router.push('/login');
      } else if (user && isUnprotectedRoute) {
        router.push('/');
      }
    }
  }, [user, loading]);

  // Email/Password login
  const login = async (phoneNumber: string, email: string, password: string, access_token?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      // If access_token is provided (from SignUpPage), use it directly
      if (access_token) {
        // You might want to make an API call to get user details using the token
        // For now, creating a basic user object
        const user: User = {
          id: '', // Set from API response when you fetch user details
          org_id: '', // Set from API response
          role: '', // Set from API response
          user_permissions: [], // Set from API response
          access_token,
          email,
          phone_number: phoneNumber,
        };

        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', access_token);
        router.push('/');
        return { success: true, user };
      }

      // Regular email/password login
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', email, password }),
      });

      const data = await response.json();

      console.log(data);
      console.log(data.data.user_permissions);

      if (data.success && data.data?.access_token) {
        // console.log(data.data.user);
        const user: User = {
          id: data.data.user?.id || '',
          org_id: data.data.user?.org_id || '',
          role: data.data.user?.role || '',
          user_permissions: data.data.user_permissions || [],
          access_token: data.data.access_token,
          email,
        };

        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('permissions',data.data.user_permissions);
        localStorage.setItem('kyc',data.data.is_kyc_done);
         
        localStorage.setItem('crossed-kyc', 'false'); 
        router.push('/');
        return { success: true, user };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error, please try again' };
    }
  };

  // OTP-based login for phone numbers
  const loginWithOtp = async (phoneNumber: string, otp: string, session_uuid: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
     
      const response = await axios.post('api/login', {
        type: 'phone_number',
        phone_number: phoneNumber,
        otp,
        session_uuid

      });

      // const data = await response.json();
      

      if (response.data.success && response.data.data?.access_token) {

        const user: User = {
          id: response.data.data?.id || '',
          org_id: response.data.data?.org_id || '',
          role: response.data.data?.role || '',
          user_permissions: response.data.data?.user_permissions || [],
          access_token: response.data.data?.access_token,
          phone_number: phoneNumber,
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', response.data.data.access_token);
        localStorage.setItem('permissions',response.data.data.user_permissions);
        localStorage.setItem('kyc',response.data.data.is_kyc_done);
        localStorage.setItem('crossed-kyc', 'false'); 



        router.push('/');
        return { success: true, user };
      } 
      // Ensure a return if the condition is not met
      return { success: false, error: 'OTP login failed' };
    } catch (error:any) {
      // console.error('OTP login error:', error);
      return { success: false, error: error.response?.data?.message || 'OTP login error' };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('access_token');
    try {
      // 1. Tell the server to log you out
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`,
        {}, // no body needed
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error hitting logout endpoint', err);
    } finally {
      setUser(null);
      localStorage.clear();
      router.push('/login');
    }
  };

  const register = async (payload: {
    first_name: string;
    last_name: string;
    company_name?: string;
    phone_number: string;
    email: string;
    password: string;
    user_type: string;
    parcels_per_month?: string;
    otp?: string;
    session_uuid?: string;
  }): Promise<{ success: boolean; session_uuid?: string; error?: string }> => {
    try {
      // initial /api/register call (without otp) will return session_uuid
      const { data } = await axios.post('/api/register', payload);
      console.log("this is data",data);
      if (!payload.otp) {
        // OTP step
        console.log("ccode here ")
        if (data.data.session_uuid) {
          console.log("this is session uuid",data.data.session_uuid)
          return  { success: true, session_uuid: data.data.session_uuid }; // UI will show OTP view
        } else {
           return { success: false, error: "Session UUID not received" };
        }
      }

      // final OTP call
      if (data.success && data.data.access_token) {
        const user: User = {
          id:            data.data.id,
          org_id:        data.data.org_id,
          role:          data.data.role,
          user_permissions: data.data.user_permissions,
          access_token:  data.data.access_token,
          email:         payload.email,
          phone_number:  payload.phone_number,
        };
        // persist into state + storage
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('permissions', data.data.user_permissions);
        localStorage.setItem('kyc', data.data.is_kyc_done.toString());
        localStorage.setItem('crossed-kyc', 'false'); 
        router.push('/');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithOtp,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default context instead of throwing an error
    return {
      user: null,
      login: async () => ({ success: true, error: 'AuthProvider not available' }),
      loginWithOtp: async () => ({ success: true, error: 'AuthProvider not available' }),
      logout: () => {},
      register: async () => ({ success: true, error: 'AuthProvider not available' }),
      loading: false,
      isAuthenticated: true,
    };
  }
  return context;
};