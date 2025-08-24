"use client";
import React, { useEffect } from 'react';
import { useAppDispatch } from '@/app/redux/store';
import { setStatus } from '@/app/redux/slices/reverseOrdersSlice';
import ReverseOrdersPage from '../page';

const CancelledReverseOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set the status filter to cancelled when this page loads
    dispatch(setStatus('cancelled'));
  }, [dispatch]);

  return <ReverseOrdersPage />;
};

export default CancelledReverseOrdersPage;
