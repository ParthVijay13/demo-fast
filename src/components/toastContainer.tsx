
// import { useAppDispatch,useAppSelector } from '@/app/redux/store';
// import { removeToast } from '@/app/redux/slices/toastslice';

// import Toast from './Toast';


// /**
//  * The container simply renders whatever toasts are in Redux.
//  * Each Toast takes care of its own auto‑dismiss timer and calls onClose,
//  * which dispatches `removeToast`. No mutation of Redux objects needed.
//  */
// export default function ToastContainer() {
//   const toasts = useAppSelector(state => state.toast);
//   const dispatch = useAppDispatch();

//   return (
//     <>
//       {toasts.map(t => (
//         <Toast
//           key={t.id}
//           message={t.message}
//           type={t.type}
//           duration={t.duration}
//           onClose={() => dispatch(removeToast(t.id))}
//         />
//       ))}
//     </>
//   );
// }