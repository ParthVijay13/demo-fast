import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import toastReducer from './slices/toastslice';
import ordersReducer from './slices/ordersSlice';
import reverseOrdersReducer from './slices/reverseOrdersSlice';
import pickupReducer from './slices/pickupSlice';
import bulkUploadReducer from './slices/bulkUploadSlice';

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    orders: ordersReducer,
    reverseOrders: reverseOrdersReducer,
    pickup: pickupReducer,
    bulkUpload: bulkUploadReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;