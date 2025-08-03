import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type ToastState = Toast[];

const initialState: ToastState = [];

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: {
      reducer(state, action: PayloadAction<Toast>) {
        state.push(action.payload);
      },
      prepare({ message, type = 'info', duration = 3000 }: { message: string; type?: ToastType; duration?: number }) {
        return {
          payload: {
            id: nanoid(),
            message,
            type,
            duration,
          }
        };
      }
    },
    removeToast(state, action: PayloadAction<string>) {
      return state.filter(t => t.id !== action.payload);
    }
  }
});

export const { showToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;