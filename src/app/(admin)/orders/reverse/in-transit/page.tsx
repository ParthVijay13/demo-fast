"use client";
import React, { useEffect } from 'react';
import { useAppDispatch } from '@/app/redux/store';
import { setStatus } from '@/app/redux/slices/reverseOrdersSlice';
import ReverseOrdersPage from '../page';

const InTransitReverseOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set the status filter to in-transit when this page loads
    dispatch(setStatus('in-transit'));
  }, [dispatch]);

  return <ReverseOrdersPage />;
};

export default InTransitReverseOrdersPage;
