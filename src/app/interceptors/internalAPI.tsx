// // src/lib/internalApi.ts
// import axios from 'axios';
// import Router from 'next/router';
// // import { toast } from 'react-hot-toast';
// import TokenExpiredModal from '@/components/tokenExpirationmode';
// const internalApi = axios.create();
// internalApi.interceptors.response.use(
//   r => r,
//   err => {
//     if (err.response?.status === 401) {
//       // toast.error('Session expired, login again!');
//       <TokenExpiredModal/>
//       // localStorage.clear();
//       setTimeout(() => Router.replace('/login'), 800);
//     }
//     return Promise.reject(err);
//   }
// );
// export default internalApi;

// src/lib/internalApi.ts
import axios from 'axios';
import { createRoot } from 'react-dom/client';

import TokenExpiredModal from '@/components/tokenExpirationmode';


let modalRoot: any = null;

const showTokenExpiredModal = () => {
  // Prevent multiple modals
  if (modalRoot) return;

  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.id = 'token-expired-modal';
  document.body.appendChild(modalContainer);

  // Create React root and render modal
  modalRoot = createRoot(modalContainer);
  modalRoot.render(<TokenExpiredModal />);
};

const internalApi = axios.create();

internalApi.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

internalApi.interceptors.response.use(
  r => r,
  err => {
    console.log("erro in internal interceptor",err.response.data)
    if (err.response?.data?.message?.toLowerCase()?.includes("token")) {
      showTokenExpiredModal();
    }
    return Promise.reject(err);
  }
);

export default internalApi;