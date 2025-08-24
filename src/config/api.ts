// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    AUTH: '/auth',
    ORDERS: '/orders',
    USERS: '/users',
    ADDRESSES: '/address',
    PINCODE: '/pincode-serviceability',
  },
  TIMEOUT: 30000, // 30 seconds
};

export default API_CONFIG;
