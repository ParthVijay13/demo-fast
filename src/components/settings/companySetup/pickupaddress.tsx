

"use client"
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Plus, Check, X, MapPin } from 'lucide-react';
// import Toast from '@/components/Toast';
import _ from "lodash";
import MapWithMarker from '@/components/maps/mapWithMarker';
import internalApi from '@/app/interceptors/internalAPI';

import { MapProvider } from '@/components/maps/mapProvider';
import ThreeBodyLoader from '@/components/loader/loader';
import toast from 'react-hot-toast';
import {
  useJsApiLoader,
  Autocomplete
} from '@react-google-maps/api';
// import axios from "axios"
import { useDirty } from '@/hooks/useDIrty';

// Define libraries as a constant outside component to prevent re-renders
const libraries: ("places")[] = ["places"];

// Types
interface PickupAddressState {
  id: string;
  pickupAddress: string;
  pickupPincode: string;
  pickupCity: string;
  pickupState: string;
  pickupPocName: string;
  pickupPocPhone: string;
  pickupLandmark: string;
  sameReturnAddress: boolean;
  returnWarehouse: {
    returnAddress: string;
    returnPincode: string;
    returnCity: string;
    returnState: string;
    returnPocName: string;
    returnPocPhone: string;
    returnLandmark: string;
  };
  pickupLat: number;
  pickupLng: number;
  returnLat: number;
  returnLng: number;
}


// Modern Places Autocomplete Component
const ModernPlacesAutocomplete: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoaded: boolean;
}> = ({ value, onChange, onPlaceSelect, placeholder, disabled, isLoaded }) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelect(place);
      }
    }
  }, [autocomplete, onPlaceSelect]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  if (!isLoaded) {
    return (
      <div className="w-full space-y-2">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            disabled={true}
            className="w-full pl-10 pr-10 py-3 border-2 rounded-xl text-sm font-medium
                     border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            placeholder="Loading Google Maps..."
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="h-4 w-4 text-purple-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="relative group">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <MapPin className="h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
        </div>

        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            componentRestrictions: { country: 'in' },
            fields: ['address_components', 'geometry', 'formatted_address'],
            types: ['geocode', 'establishment']
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className={`
              w-full pl-10 pr-10 py-3 
              border-2 rounded-xl
              text-sm font-medium
              transition-all duration-200 ease-in-out
              placeholder:text-gray-400 placeholder:font-normal
              focus:outline-none focus:ring-0
              disabled:cursor-not-allowed
              ${disabled
                ? 'border-gray-200 bg-gray-50 text-gray-500'
                : 'border-gray-200 bg-white focus:border-purple-500 focus:bg-white hover:border-gray-300'
              }
              ${!disabled ? 'focus:shadow-lg focus:shadow-purple-500/10' : ''}
            `}
            placeholder={placeholder || "Start typing address..."}
            autoComplete="off"
          />
        </Autocomplete>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className={`
          absolute inset-0 rounded-xl pointer-events-none
          transition-opacity duration-200
          ${!disabled ? 'group-focus-within:ring-2 group-focus-within:ring-purple-500/20' : ''}
        `} />
      </div>
    </div>
  );
};

// Main Component
const PickupAddress: React.FC = () => {
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!,
    libraries
  });

  const [showForm, setShowForm] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<PickupAddressState[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [pickupData, setPickupData] = useState<PickupAddressState>({
    id: '',
    pickupAddress: '',
    pickupPincode: '',
    pickupCity: '',
    pickupState: '',
    pickupPocName: '',
    pickupPocPhone: '',
    pickupLandmark: '',
    sameReturnAddress: true,
    returnWarehouse: {
      returnAddress: '',
      returnPincode: '',
      returnCity: '',
      returnState: '',
      returnPocName: '',
      returnPocPhone: '',
      returnLandmark: ''
    },
    pickupLat: 0,
    pickupLng: 0,
    returnLat: 0,
    returnLng: 0
  });

  // component ke top mein
  const [initialPickupData, setInitialPickupData] = useState<PickupAddressState | null>(null);


  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  // const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showReturnMap, setShowReturnMap] = useState(false);
  const [pickupAddressConfirmed, setPickupAddressConfirmed] = useState(false);
  const [returnAddressConfirmed, setReturnAddressConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const isDirty = useDirty(initialPickupData, pickupData);


  // Add custom styles for Google Places dropdown
  useEffect(() => {
    if (isLoaded) {
      const style = document.createElement('style');
      style.innerHTML = `
        .pac-container {
          background-color: #fff;
          position: absolute;
          z-index: 9999;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin-top: 8px;
          overflow: hidden;
        }

        .pac-container:after {
          content: none !important;
        }

        .pac-item {
          cursor: pointer;
          padding: 14px 16px;
          line-height: 22px;
          border: none;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: flex-start;
          transition: all 0.15s ease;
          gap: 12px;
        }

        .pac-item:last-child {
          border-bottom: none;
        }

        .pac-item:hover {
          background-color: #faf5ff;
        }

        .pac-item-selected,
        .pac-item-selected:hover {
          background-color: #ede9fe;
        }

        .pac-icon {
          width: 20px;
          height: 20px;
          margin-right: 0;
          margin-top: 2px;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%237c3aed"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100%;
          flex-shrink: 0;
        }

        .pac-item-query {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          flex: 1;
          line-height: 1.4;
        }

        .pac-item span {
          color: #6b7280;
          font-size: 13px;
        }

        .pac-matched {
          font-weight: 600;
          color: #7c3aed;
        }

        .pac-logo:after {
          content: "powered by Google";
          font-size: 11px;
          color: #9ca3af;
          padding: 10px 16px;
          display: block;
          text-align: right;
          background-color: #faf5ff;
          border-top: 1px solid #e5e7eb;
        }

        .pac-container {
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);

      return () => {
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      };
    }
  }, [isLoaded]);

  const updatePickupCoordinates = useCallback((loc: { lat: number; lng: number }) => {
    setPickupData((data) => ({ ...data, pickupLat: loc.lat, pickupLng: loc.lng }));
  }, []);

  const updateReturnCoordinates = useCallback((loc: { lat: number; lng: number }) => {
    setPickupData((data) => ({
      ...data,
      returnLat: loc.lat,
      returnLng: loc.lng
    }));
  }, []);

  const debouncedPickupUpdate = useMemo(
    () => _.debounce(updatePickupCoordinates, 300),
    [updatePickupCoordinates]
  );

  const debouncedReturnUpdate = useMemo(
    () => _.debounce(updateReturnCoordinates, 300),
    [updateReturnCoordinates]
  );

  useEffect(() => {
    return () => {
      debouncedPickupUpdate.cancel();
      debouncedReturnUpdate.cancel();
    };
  }, [debouncedPickupUpdate, debouncedReturnUpdate]);

  const extractAddressComponents = (place: google.maps.places.PlaceResult) => {
    let city = '';
    let state = '';
    let pincode = '';

    place.address_components?.forEach((component) => {
      const types = component.types;
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (types.includes('postal_code')) {
        pincode = component.long_name;
      }
    });

    return { city, state, pincode };
  };

  const handlePickupPlaceSelect = (place: google.maps.places.PlaceResult) => {
    const { city, state, pincode } = extractAddressComponents(place);
    const address = place.formatted_address || '';

    const newData = {
      ...pickupData,
      pickupAddress: address,
      pickupCity: city,
      pickupState: state,
      pickupPincode: pincode,
      pickupLat: place.geometry?.location?.lat() || 0,
      pickupLng: place.geometry?.location?.lng() || 0
    };

    setPickupData(newData);

    if (pickupData.sameReturnAddress) {
      setPickupData({
        ...newData,
        returnWarehouse: {
          ...newData.returnWarehouse,
          returnAddress: address,
          returnCity: city,
          returnState: state,
          returnPincode: pincode,

        },
        returnLat: place.geometry?.location?.lat() || 0,
        returnLng: place.geometry?.location?.lng() || 0
      });
    }

    setShowPickupMap(true);
  };

  const handleReturnPlaceSelect = (place: google.maps.places.PlaceResult) => {
    const { city, state, pincode } = extractAddressComponents(place);

    setPickupData({
      ...pickupData,
      returnWarehouse: {
        ...pickupData.returnWarehouse,
        returnAddress: place.formatted_address || '',
        returnCity: city,
        returnState: state,
        returnPincode: pincode
      },
      returnLat: place.geometry?.location?.lat() || 0,
      returnLng: place.geometry?.location?.lng() || 0
    });
    setShowReturnMap(true);
  };

  const resetForm = () => {
    setPickupData({
      id: '',
      pickupAddress: '',
      pickupPincode: '',
      pickupCity: '',
      pickupState: '',
      pickupPocName: '',
      pickupPocPhone: '',
      pickupLandmark: '',
      sameReturnAddress: true,
      returnWarehouse: {
        returnAddress: '',
        returnPincode: '',
        returnCity: '',
        returnState: '',
        returnPocName: '',
        returnPocPhone: '',
        returnLandmark: ''
      },
      pickupLat: 0,
      pickupLng: 0,
      returnLat: 0,
      returnLng: 0
    });

    setOtpSent(false);
    setOtpVerified(false);
    setOtp('');
    setEditingId(null);
    setPickupAddressConfirmed(false);
    setReturnAddressConfirmed(false);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await internalApi.get(`/api/address`,
  //         { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }

  //       )

  //       if (res.data.success && res.data.data) {
  //         const d = res.data.data
  //         const mapped: PickupAddressState = {
  //           id: d.id,
  //           pickupAddress: d.pickup_address,
  //           pickupLandmark: d.pickup_landmark,
  //           pickupPincode: d.pickup_pincode,
  //           pickupCity: d.pickup_city,
  //           pickupState: d.pickup_state,
  //           pickupPocName: d.pickup_username,
  //           pickupPocPhone: d.pickup_user_number,
  //           sameReturnAddress: d.is_pickup_rto_same,
  //           returnWarehouse: {
  //             returnAddress: d.return_address,
  //             returnLandmark: d.return_landmark,
  //             returnPincode: d.return_pincode,
  //             returnCity: d.return_city,
  //             returnState: d.return_state,
  //             returnPocName: d.return_username,
  //             returnPocPhone: d.return_user_number,
  //           },
  //           pickupLat: parseFloat(d.pickup_lat),
  //           pickupLng: parseFloat(d.pickup_long),
  //           returnLat: parseFloat(d.return_lat),
  //           returnLng: parseFloat(d.return_long),
  //         };
  //         setPickupData(mapped);
  //         setInitialPickupData(mapped);  
  //         if (mapped.pickupAddress) {
  //         setPickupAddressConfirmed(true);
  //       }
  //       if (mapped.sameReturnAddress || mapped.returnWarehouse.returnAddress) {
  //         setReturnAddressConfirmed(true);
  //       }
  //         setLoading(false);


  //       }
  //     } catch (err: any) {
        
  //       // console.log(err)
  //       toast.error(err.response.data.message)
        
  //     }

  //   }
  //   fetchData();
  // }, [])

  const handlePickupChange = (field: keyof Omit<PickupAddressState, 'returnWarehouse' | 'sameReturnAddress' | 'id'>, value: string) => {
    const newData = { ...pickupData, [field]: value };
    setPickupData(newData);

    if (pickupData.sameReturnAddress) {
      const returnField = field.replace('pickup', 'return') as keyof PickupAddressState['returnWarehouse'];
      if (returnField in newData.returnWarehouse) {
        setPickupData({
          ...newData,
          returnWarehouse: {
            ...newData.returnWarehouse,
            [returnField]: value
          }
        });
      }
    }
  };

  const handleReturnChange = (field: keyof PickupAddressState['returnWarehouse'], value: string) => {
    setPickupData({
      ...pickupData,
      returnWarehouse: {
        ...pickupData.returnWarehouse,
        [field]: value
      }
    });
  };

  const handleSameAddressToggle = () => {
    const newSameAddress = !pickupData.sameReturnAddress;
    console.log("Toggling same address", newSameAddress);
    let newReturnWarehouse = pickupData.returnWarehouse;

    if (newSameAddress) {
      newReturnWarehouse = {
        returnAddress: pickupData.pickupAddress,
        returnPincode: pickupData.pickupPincode,
        returnCity: pickupData.pickupCity,
        returnState: pickupData.pickupState,
        returnPocName: pickupData.pickupPocName,
        returnPocPhone: pickupData.pickupPocPhone,
        returnLandmark: pickupData.pickupLandmark
      };
      setPickupData({
        ...pickupData,
        sameReturnAddress: newSameAddress,
        returnWarehouse: newReturnWarehouse,
        returnLat: pickupData.pickupLat,
        returnLng: pickupData.pickupLng
      });
      if (pickupAddressConfirmed) {
        setReturnAddressConfirmed(true);
      }
    } else {
      setPickupData({
        ...pickupData,
        sameReturnAddress: newSameAddress,
        returnWarehouse: newReturnWarehouse
      });
    }
  };

  const handleSendOtp = () => {
    if (pickupData.pickupPocPhone) {
      setOtpSent(true);
      
      // setToast({message:'OTP sent to your phone number!',type:"success"});
      toast.success("OTP sent to your phone number!")
    } else {
      // setToast({ message: 'Please enter phone number first', type: 'error' });
      toast.error("Please enter phone number first")
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') {
      setOtpVerified(true);
      // setToast({ message: 'Your otp is verified', type: 'success' });
      return;
    } else {
      // setToast({message:'Invalid OTP. Please try again.',type:"error"});
      toast.error("Invalid OTP. Please try again.")

    }
  };

  const handleSaveAddress = async () => {
      function validatePickupFields(pickup: PickupAddressState) {
      if (!pickup.pickupAddress) return "Pickup address is required.";
      if (!pickup.pickupLandmark) return "Pickup landmark is required.";
      if (!pickup.pickupPocName) return "Pickup POC name is required.";
      if (!pickup.pickupPocPhone) return "Pickup POC phone is required.";
      if (!pickup.pickupCity) return "Pickup city is required.";
      if (!pickup.pickupState) return "Pickup state is required.";
      if (!pickup.pickupPincode) return "Pickup pincode is required.";
      if (!pickup.sameReturnAddress) {
        if (!pickup.returnWarehouse.returnAddress) return "Return address is required.";
        if (!pickup.returnWarehouse.returnLandmark) return "Return landmark is required.";
        if (!pickup.returnWarehouse.returnPocName) return "Return POC name is required.";
        if (!pickup.returnWarehouse.returnPocPhone) return "Return POC phone is required.";
        if (!pickup.returnWarehouse.returnCity) return "Return city is required.";
        if (!pickup.returnWarehouse.returnState) return "Return state is required.";
        if (!pickup.returnWarehouse.returnPincode) return "Return pincode is required.";
      }
      return null;
    }
    const errorMsg = validatePickupFields(pickupData);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    if (!otpVerified) {
      // setToast({message:'Please verify your phone number first',type:"error"});
      toast.error("Please verify your phone number first")
      return;
    }

    if (!pickupAddressConfirmed) {
      // setToast({message:'Please confirm pickup address on map',type:"error"});
      toast.error("Please confirm pickup address on map")
      return;
    }

    if (!pickupData.sameReturnAddress && !returnAddressConfirmed) {
      // setToast({message:'Please confirm return address on map',type:"error"});
      toast.error("Please confirm pickup address on map")
      return;
    }

    if (editingId) {
      setSavedAddresses(savedAddresses.map(addr =>
        addr.id === editingId ? { ...pickupData, id: editingId } : addr
      ));
      // setToast({message:'Address updated successfully!',type:"success"});
      // toast.success("Address updated successfully!")
    } else {
      const newAddress = { ...pickupData, id: Date.now().toString() };
      setSavedAddresses([...savedAddresses, newAddress]);
      // setToast({message:'Pickup address added successfully!',type:"success"});
      // toast.success("Pickup address added successfully!")
      // toast.success("Address updated successfully!")
    }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const payload = {
        pickup_address: pickupData.pickupAddress,
        pickup_landmark: pickupData.pickupLandmark,
        pickup_pincode: pickupData.pickupPincode,
        pickup_city: pickupData.pickupCity,
        pickup_state: pickupData.pickupState,
        pickup_lat: pickupData.pickupLat.toString() || "",
        pickup_long: pickupData.pickupLng.toString() || "",
        pickup_username: pickupData.pickupPocName,
        pickup_user_number: pickupData.pickupPocPhone,
        is_pickup_rto_same:pickupData.sameReturnAddress,
        // and likewise for return_*
        return_address: pickupData.returnWarehouse.returnAddress,
        return_landmark: pickupData.returnWarehouse.returnLandmark,
        return_pincode: pickupData.returnWarehouse.returnPincode,
        return_city: pickupData.returnWarehouse.returnCity,
        return_state: pickupData.returnWarehouse.returnState,
        return_lat: pickupData?.returnLat.toString() || "",
        return_long: pickupData?.returnLng.toString() || "",
        return_username: pickupData.returnWarehouse.returnPocName,
        return_user_number: pickupData.returnWarehouse.returnPocPhone,
      }
      const response = await internalApi.patch('/api/address', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.success) {
        toast.success('Address saved successfully!')
        const saved = { ...pickupData, id: editingId ?? response.data.data.id };
        setPickupData(saved);
        setInitialPickupData(saved);
      }

    } catch (error: any) {
      console.log("inside patch error",error);
      const message = error.response?.data.message;
      toast.error(message);
    }


  };

  // const handleEdit = (address: PickupAddressState) => {
  //   setPickupData(address);
  //   setEditingId(address.id);
  //   setOtpVerified(true);
  //   setPickupAddressConfirmed(true);
  //   setReturnAddressConfirmed(true);
  //   setShowForm(true);
  // };

  // const handleDelete = (id: string) => {
  //   if (confirm('Are you sure you want to delete this address?')) {
  //     setSavedAddresses(savedAddresses.filter(addr => addr.id !== id));
  //   }
  // };


  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  // Handle loading error
  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          <p className="font-medium">Failed to load Google Maps</p>
          <p className="text-sm mt-1">Please check your API key configuration or refresh the page.</p>
          <p className="text-xs mt-2">Error: {loadError.message}</p>
        </div>
      </div>
    );
  }
  // if (loading) {
  //   return (
  //     <ThreeBodyLoader />
  //   )
  // }
  // console.log("This is pickup data", pickupData);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Pickup Addresses</h1>
        <p className="text-gray-600">Manage your pickup locations and return warehouse details</p>
      </div>

      {/* Add/Edit Form */}
      {showForm ? (
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit Pickup Address' : 'Add New Pickup Address'}
            </h2>
            {/* <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button> */}
          </div>

          {/* Pickup Address Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Pickup Address with Map */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Address <span className="text-red-500">*</span>
                  </label>
                  <ModernPlacesAutocomplete
                    value={pickupData.pickupAddress}
                    onChange={(value) => handlePickupChange('pickupAddress', value)}
                    onPlaceSelect={handlePickupPlaceSelect}
                    placeholder="Start typing pickup address..."
                    isLoaded={isLoaded}
                  />

                  {pickupAddressConfirmed && (
                    <div className="mt-2 flex items-center text-green-600 text-sm">
                      <Check className="w-4 h-4 mr-1" />
                      Address confirmed on map
                    </div>
                  )}

                  {/* Auto-filled fields */}
                  
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={pickupData.pickupCity}
                          onChange={(e) => handlePickupChange('pickupCity', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={pickupData.pickupState}
                          onChange={(e) => handlePickupChange('pickupState', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          value={pickupData.pickupPincode}
                          onChange={(e) => handlePickupChange('pickupPincode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  
                </div>

                {/* Map Display */}
                {pickupData.pickupLat && pickupData.pickupLng && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location on Map
                    </label>
                    <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                      <MapProvider>
                        <MapWithMarker
                          location={{ lat: pickupData.pickupLat, lng: pickupData.pickupLng }}
                          onLocationChange={() => { }}
                        />
                      </MapProvider>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Landmark <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={pickupData.pickupLandmark}
                onChange={(e) => handlePickupChange('pickupLandmark', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter a Pickup Landmark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup POC Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pickupData.pickupPocName}
                
                required
                onChange={(e) => handlePickupChange('pickupPocName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup POC Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={pickupData.pickupPocPhone}
                    // onChange={(e) => handlePickupChange('pickupPocPhone', e.target.value)}
                              onChange={(e) => {
                          // 1) strip out non-digits
                          const justDigits = e.target.value.replace(/\D/g, '');
                          // 2) clamp to 10 chars
                          const clamped    = justDigits.slice(0, 10);

                          // 3) update state once
                          handlePickupChange('pickupPocPhone', clamped);
                        }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={otpVerified}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 text-sm whitespace-nowrap"
                  >
                    {otpVerified ? <Check className="w-4 h-4" /> : 'Send OTP'}
                  </button>
                </div>

                {otpSent && !otpVerified && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter OTP"
                      maxLength={6}
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Verify
                    </button>
                  </div>
                )}

                {otpVerified && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Phone number verified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Same Return Address Toggle */}
          <div className="mb-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={!!pickupData.sameReturnAddress}
                onChange={handleSameAddressToggle}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Same as Pickup Address
              </span>
            </label>
          </div>

          {/* Return Warehouse Section */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Return Warehouse</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Return Address with Map */}
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Address <span className="text-red-500">*</span>
                    </label>
                    <ModernPlacesAutocomplete
                      value={pickupData.returnWarehouse.returnAddress}
                      onChange={(value) => handleReturnChange('returnAddress', value)}
                      onPlaceSelect={handleReturnPlaceSelect}
                      placeholder="Start typing return address..."
                      disabled={pickupData.sameReturnAddress}
                      isLoaded={isLoaded}
                    />

                    {returnAddressConfirmed && (
                      <div className="mt-2 flex items-center text-green-600 text-sm">
                        <Check className="w-4 h-4 mr-1" />
                        Address confirmed on map
                      </div>
                    )}

                    {/* Auto-filled fields */}
                    
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            value={pickupData.returnWarehouse.returnCity}
                            onChange={(e) => handleReturnChange('returnCity', e.target.value)}
                            disabled={pickupData.sameReturnAddress}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            value={pickupData.returnWarehouse.returnState}
                            onChange={(e) => handleReturnChange('returnState', e.target.value)}
                            disabled={pickupData.sameReturnAddress}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                          <input
                            type="text"
                            value={pickupData.returnWarehouse.returnPincode}
                            onChange={(e) => handleReturnChange('returnPincode', e.target.value)}
                            disabled={pickupData.sameReturnAddress}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                   
                  </div>

                  {/* Map Display */}
                  {pickupData.returnLat && pickupData.returnLng && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Return Location on Map
                      </label>
                      <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                        <MapProvider>
                          <MapWithMarker
                            location={{ lat: pickupData.returnLat, lng: pickupData.returnLng }}
                            onLocationChange={() => { }}
                          />
                        </MapProvider>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Landmark <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={pickupData.returnWarehouse.returnLandmark}
                  onChange={(e) => handleReturnChange('returnLandmark', e.target.value)}
                  disabled={pickupData.sameReturnAddress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter a Return Landmark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return POC Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={pickupData.returnWarehouse.returnPocName}
                  onChange={(e) => handleReturnChange('returnPocName', e.target.value)}
                  disabled={pickupData.sameReturnAddress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return POC Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={pickupData.returnWarehouse.returnPocPhone}
                  onChange={(e) => {
                    // remove anything that isn't 0–9
                    const digits = e.target.value.replace(/\D/g, '');
                    // limit to 10 characters
                    const clamped = digits.slice(0, 10);

                    handleReturnChange('returnPocPhone', clamped);
                  }}
                  disabled={pickupData.sameReturnAddress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSaveAddress}
              disabled={!isDirty}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
    ${isDirty ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              <Check className="w-5 h-5" />
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Add Address Button - Always visible when form is not shown */
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Address
        </button>
      )}

      {/* Pickup Map Modal */}
      {showPickupMap && pickupData.pickupLat != null && pickupData.pickupLng != null && (
        <div className='fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50 p-4'>
          <div className='bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-md relative overflow-hidden'>
            <div className='flex items-center justify-between p-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-800'>Confirm Pickup Location</h3>
              <button
                onClick={() => setShowPickupMap(false)}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group'
              >
                <X className='w-5 h-5 text-gray-500 group-hover:text-gray-700' />
              </button>
            </div>

            <div className='p-4'>
              <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
                <MapProvider>
                  <MapWithMarker
                    location={{ lat: pickupData.pickupLat, lng: pickupData.pickupLng }}
                    onLocationChange={debouncedPickupUpdate}
                  />
                </MapProvider>
              </div>
            </div>

            <div className='p-4 pt-0'>
              <button
                onClick={() => {
                  setShowPickupMap(false);
                  setPickupAddressConfirmed(true);
                }}
                className='w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              >
                Confirm Pickup Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Map Modal */}
      {showReturnMap && pickupData.returnLat != null && pickupData.returnLng != null && (
        <div className='fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50 p-4'>
          <div className='bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-md relative overflow-hidden'>
            <div className='flex items-center justify-between p-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-800'>Confirm Return Location</h3>
              <button
                onClick={() => setShowReturnMap(false)}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group'
              >
                <X className='w-5 h-5 text-gray-500 group-hover:text-gray-700' />
              </button>
            </div>

            <div className='p-4'>
              <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
                <MapProvider>
                  <MapWithMarker
                    location={{ lat: pickupData.returnLat, lng: pickupData.returnLng }}
                    onLocationChange={debouncedReturnUpdate}
                  />
                </MapProvider>
              </div>
            </div>

            <div className='p-4 pt-0'>
              <button
                onClick={() => {
                  setShowReturnMap(false);
                  setReturnAddressConfirmed(true);
                }}
                className='w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              >
                Confirm Return Location
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PickupAddress;