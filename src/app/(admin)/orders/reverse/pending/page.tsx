"use client";
import React, { useEffect } from 'react';
import { useAppDispatch } from '@/app/redux/store';
import { setStatus } from '@/app/redux/slices/reverseOrdersSlice';
import ReverseOrdersPage from '../page';

const PendingReverseOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set the status filter to pending when this page loads
    dispatch(setStatus('pending'));
  }, [dispatch]);

  return <ReverseOrdersPage />;
};

export default PendingReverseOrdersPage;
