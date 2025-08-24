"use client";
import React, { useEffect } from 'react';
import { useAppDispatch } from '@/app/redux/store';
import { setStatus } from '@/app/redux/slices/reverseOrdersSlice';
import ReverseOrdersPage from '../page';

const ReadyForPickupReverseOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set the status filter to ready-for-pickup when this page loads
    dispatch(setStatus('ready-for-pickup'));
  }, [dispatch]);

  return <ReverseOrdersPage />;
};

export default ReadyForPickupReverseOrdersPage;
