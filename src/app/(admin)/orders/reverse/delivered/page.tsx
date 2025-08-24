"use client";
import React, { useEffect } from 'react';
import { useAppDispatch } from '@/app/redux/store';
import { setStatus } from '@/app/redux/slices/reverseOrdersSlice';
import ReverseOrdersPage from '../page';

const DeliveredReverseOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set the status filter to delivered when this page loads
    dispatch(setStatus('delivered'));
  }, [dispatch]);

  return <ReverseOrdersPage />;
};

export default DeliveredReverseOrdersPage;
