'use client';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import React from 'react';

const libraries: Libraries = ['places'];

export function MapProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!,
    libraries,
  });

  if (loadError) return <p>Error loading Google Maps</p>;
  if (!isLoaded) return <p>Loading Google Maps...</p>;
  return <>{children}</>;
}
