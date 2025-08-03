// src/lib/axios.ts
import axios from 'axios'
// import Router from 'next/router'
// import { toast } from 'react-hot-toast'
import TokenExpiredModal from '@/components/tokenExpirationmode'
import { createRoot } from 'react-dom/client';

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

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL })

api.interceptors.response.use(
  r => r,
  err => {
    // console.log("erro in api interceptor",err.response.data)
    if (err.response.data.message.toLowerCase().includes("token")) {
      showTokenExpiredModal();
      // localStorage.clear()
      // setTimeout(() => Router.replace('/login'), 800)
    }
    return Promise.reject(err)
  }
)

export default api;
