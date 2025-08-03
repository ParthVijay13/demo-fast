'use client';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
// import { store } from '../store';
// import { Store } from 'lucide-react';
// import { Store } from '@reduxjs/toolkit';
import { store } from './redux/store';

export function Providers({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}