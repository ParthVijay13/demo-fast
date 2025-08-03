// import React, { useEffect, useState } from 'react';
// import { CheckCircle, XCircle, X } from 'lucide-react';

// type ToastProps = {
//   message: string;
//   type?: 'success' | 'error' | 'info' | 'warning';
//   onClose: () => void;
//   duration?: number;
// };

// const Toast: React.FC<ToastProps> = ({ 
//   message, 
//   type = 'success', 
//   onClose, 
//   duration = 4000 
// }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [isLeaving, setIsLeaving] = useState(false);

//   useEffect(() => {
//     // Trigger entrance animation
//     const showTimer = setTimeout(() => setIsVisible(true), 50);
    
//     // Auto-dismiss timer
//     const dismissTimer = setTimeout(() => {
//       handleClose();
//     }, duration);

//     return () => {
//       clearTimeout(showTimer);
//       clearTimeout(dismissTimer);
//     };
//   }, [duration]);

//   const handleClose = () => {
//     setIsLeaving(true);
//     setTimeout(() => {
//       onClose();
//     }, 300); // Match exit animation duration
//   };

//   const getIcon = () => {
//     switch (type) {
//       case 'success':
//         return <CheckCircle className="w-5 h-5 text-black" />;
//       case 'error':
//         return <XCircle className="w-5 h-5 text-red-400" />;
//       case 'warning':
//         return <XCircle className="w-5 h-5 text-yellow-400" />;
//       case 'info':
//         return <CheckCircle className="w-5 h-5 text-blue-400" />;
//       default:
//         return <CheckCircle className="w-5 h-5 text-green-400" />;
//     }
//   };

//   const getStyles = () => {
//     const baseStyles = "backdrop-blur-md border shadow-lg";
    
//     switch (type) {
//       case 'success':
//         return `${baseStyles} bg-green-500/10 border-green-500/20 text-black`;
//       case 'error':
//         return `${baseStyles} bg-red-500/10 border-red-500/20`;
//       case 'warning':
//         return `${baseStyles} bg-yellow-500/10 border-yellow-500/20`;
//       case 'info':
//         return `${baseStyles} bg-blue-500/10 border-blue-500/20`;
//       default:
//         return `${baseStyles} bg-green-500/10 border-green-500/20`;
//     }
//   };

//   return (
//     <div
//       className={`
//         fixed bottom-6 right-6 max-w-sm w-full mx-4 sm:mx-0
//         ${getStyles()}
//         rounded-xl p-4 z-50
//         transform transition-all duration-300 ease-out
//         ${isVisible && !isLeaving 
//           ? 'translate-y-0 opacity-100 scale-100' 
//           : 'translate-y-2 opacity-0 scale-95'
//         }
//       `}
//     >
//       <div className="flex items-center gap-3">
//         {getIcon()}
//         <p className="text-sm font-medium text-black flex-1 leading-relaxed">
//           {message}
//         </p>
//         <button
//           onClick={handleClose}
//           className="ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
//           aria-label="Close notification"
//         >
//           <X className="w-4 h-4 text-white/60 group-hover:text-white/90" />
//         </button>
//       </div>
      
//       {/* Progress bar */}
//       <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
//         <div 
//           className={`h-full ${
//             type === 'success' ? 'bg-green-400' :
//             type === 'error' ? 'bg-red-400' :
//             type === 'warning' ? '  bg-yellow-400' :
//             'bg-blue-400'
//           } rounded-b-xl transition-all duration-300 ease-linear`}
//           style={{
//             animation: `shrink ${duration}ms linear forwards`,
//             transformOrigin: 'left'
//           }}
//         />
//       </div>

//       <style jsx>{`
//         @keyframes shrink {
//           from { transform: scaleX(1); }
//           to { transform: scaleX(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Toast;



'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import type { ToastType } from '@/app/redux/slices/toastslice';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Entrance animation trigger
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    // Auto‑dismiss timer
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // keep in sync with exit animation duration
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <XCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getStyles = () => {
    const base = 'backdrop-blur-md border shadow-lg';
    switch (type) {
      case 'success':
        return `${base} bg-green-500/10 border-green-500/20 text-black`;
      case 'error':
        return `${base} bg-red-500/10 border-red-500/20`;
      case 'warning':
        return `${base} bg-yellow-500/10 border-yellow-500/20`;
      case 'info':
        return `${base} bg-blue-500/10 border-blue-500/20`;
      default:
        return `${base} bg-green-500/10 border-green-500/20`;
    }
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 max-w-sm w-full mx-4 sm:mx-0
        ${getStyles()}
        rounded-xl p-4 z-50
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'}
      `}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="text-sm font-medium text-black flex-1 leading-relaxed">
          {message}
        </p>
        <button
          onClick={handleClose}
          className="ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-white/60 group-hover:text-white/90" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
        <div
          className={`h-full ${
            type === 'success'
              ? 'bg-green-400'
              : type === 'error'
              ? 'bg-red-400'
              : type === 'warning'
              ? 'bg-yellow-400'
              : 'bg-blue-400'
          } rounded-b-xl transition-all duration-300 ease-linear`}
          style={{
            animation: `shrink ${duration}ms linear forwards`,
            transformOrigin: 'left',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;