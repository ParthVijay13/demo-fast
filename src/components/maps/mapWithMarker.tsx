'use client';
import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '350px',
};

interface MapWithMarkerProps {
  location: { lat: number; lng: number };
  onLocationChange: (loc: { lat: number; lng: number }) => void;
}

const MapWithMarker: React.FC<MapWithMarkerProps> = ({ location, onLocationChange }) => {
  const [marker, setMarker] = useState(location);

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLoc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarker(newLoc);
      onLocationChange(newLoc);
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={marker}
      zoom={15}
    >
      <Marker
        position={marker}
        draggable
        onDragEnd={handleDragEnd}
        title="Drag to adjust location"
      />
    </GoogleMap>
  );
};

export default MapWithMarker;
