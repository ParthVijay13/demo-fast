"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
} from "lucide-react";
import { PincodeApi, PincodeServiceabilityResponse } from "@/lib/api/pincode";
import { useWarehouses } from "@/hooks/useWarehouses";
import type { CreateWarehouseRequest, Warehouse } from "@/lib/api/warehouse";

// Legacy interface for backward compatibility
export interface AddressData {
  id: string;
  warehouse_name: string;       // <-- added to UI model
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

// Extended interface for warehouse data (unused in this component but kept for reference)
export interface WarehouseAddressData {
  id: string;
  warehouse_name: string;
  phone: string;
  email: string;
  pickup_address: string;
  pickup_city: string;
  pickup_pincode: string;
  pickup_state: string;
  pickup_country: string;
  return_address: string;
  return_city: string;
  return_state: string;
  return_pincode: string;
  return_country: string;
}

export interface AddressErrors {
  warehouse_name?: string;      // <-- optional validation for name
  addressLine1?: string;
  pincode?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface PincodeStatus {
  checking: boolean;
  serviceable: boolean | null;
  error?: string;
  serviceabilityData?: PincodeServiceabilityResponse;
}

export interface UnifiedAddressInputProps {
  title: string;
  addresses: AddressData[];
  errors: Record<string, AddressErrors>;
  onAddressChange: (
    id: string,
    field: keyof AddressData | string,
    value: string
  ) => void;
  onAddAddress: () => void;
  onRemoveAddress: (id: string) => void;
  minAddresses?: number;
  maxAddresses?: number;
  showCountry?: boolean;

  // Labels
  warehouseNameLabel?: string;
  addressLine1Label?: string;
  addressLine2Label?: string;
  pincodeLabel?: string;
  cityLabel?: string;
  stateLabel?: string;
  countryLabel?: string;

  enablePincodeValidation?: boolean;
  showSaveButton?: boolean;

  existingAddresses?: Warehouse[];
  onSelectExistingAddress?: (address: Warehouse) => void;
}

const isValidPincode = (p?: string) => !!p && /^\d{6}$/.test(p.trim());
const isValidEmail = (email?: string) =>
  !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone?: string) => !!phone && /^\d{10}$/.test(phone.trim());

const mergeLines = (l1?: string, l2?: string) =>
  [l1?.trim(), l2?.trim()].filter(Boolean).join(", ");

// Helper function to convert AddressData to warehouse format for saving
const convertAddressToWarehouse = (
  address: AddressData
): CreateWarehouseRequest => {
  return {
    warehouse_name:
      (address.warehouse_name || `delivery_${address.id}`).toLowerCase(),
    phone: "", // TODO: wire real phone field + validation
    email: "delivery@example.com", // TODO: wire real email field + validation
    pickup_address: mergeLines(address.addressLine1, address.addressLine2),
    pickup_city: address.city,
    pickup_pincode: address.pincode,
    pickup_state: address.state,
    pickup_country: address.country,
    return_address: mergeLines(address.addressLine1, address.addressLine2),
    return_city: address.city,
    return_state: address.state,
    return_pincode: address.pincode,
    return_country: address.country,
  };
};

const UnifiedAddressInput: React.FC<UnifiedAddressInputProps> = ({
  title,
  addresses,
  errors,
  onAddressChange,
  onAddAddress,
  onRemoveAddress,
  minAddresses = 1,
  maxAddresses = 5,
  showCountry = true,
  warehouseNameLabel = "Warehouse Name",
  addressLine1Label = "Address Line 1",
  addressLine2Label = "Address Line 2",
  pincodeLabel = "Pincode",
  cityLabel = "City",
  stateLabel = "State",
  countryLabel = "Country",
  enablePincodeValidation = true,
  showSaveButton = true,
  existingAddresses = [],
  onSelectExistingAddress,
}) => {
  const {
    createWarehouse,
    loading: warehouseLoading,
    error: warehouseError,
  } = useWarehouses();

  const canAddMore = addresses.length < maxAddresses;
  const canRemove = addresses.length > minAddresses;

  // Serviceability state keyed by PINCODE
  const [pincodeStatus, setPincodeStatus] = useState<
    Record<string, PincodeStatus>
  >({});
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  // Call backend using only the pincode
  const checkPincodeServiceability = useCallback(
    async (rawPin: string) => {
      const pincode = rawPin?.trim();

      if (!enablePincodeValidation || !isValidPincode(pincode)) {
        setPincodeStatus((prev) => ({
          ...prev,
          [pincode || ""]: { checking: false, serviceable: null },
        }));
        return;
      }

      // If we already have a success and not checking, skip re-fetch to reduce chatter
      const existing = pincodeStatus[pincode];
      if (existing && existing.serviceable === true && existing.checking === false)
        return;

      setPincodeStatus((prev) => ({
        ...prev,
        [pincode]: { checking: true, serviceable: null },
      }));

      try {
        const data = await PincodeApi.checkServiceability(pincode);

        setPincodeStatus((prev) => ({
          ...prev,
          [pincode]: {
            checking: false,
            serviceable: true,
            serviceabilityData: data,
          },
        }));

        // Auto-fill city/state/country for addresses that currently have this pincode
        addresses.forEach((address) => {
          if (address.pincode?.trim() === pincode) {
            if (data.city) onAddressChange(address.id, "city", data.city);
            if (data.state_code) onAddressChange(address.id, "state", data.state_code);
            if (showCountry && data.country_code)
              onAddressChange(address.id, "country", data.country_code);
          }
        });
      } catch (err: any) {
        setPincodeStatus((prev) => ({
          ...prev,
          [pincode]: {
            checking: false,
            serviceable: false,
            error: err?.message || "Pincode not serviceable",
          },
        }));
      }
    },
    [enablePincodeValidation, addresses, onAddressChange, showCountry, pincodeStatus]
  );

  // Debounce per-unique-pincode
  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};
    const uniquePins = new Set<string>();

    addresses.forEach((address) => {
      const p = address.pincode?.trim();
      if (isValidPincode(p) && !uniquePins.has(p)) {
        uniquePins.add(p);
        timers[p] = setTimeout(() => {
          checkPincodeServiceability(p);
        }, 500);
      }
    });

    return () => Object.values(timers).forEach(clearTimeout);
  }, [addresses, checkPincodeServiceability]);

  const handleSaveAddress = useCallback(
    async (address: AddressData) => {
      setSavingStates((prev) => ({ ...prev, [address.id]: true }));

      try {
        const warehouseRequest = convertAddressToWarehouse(address);
        const result = await createWarehouse(warehouseRequest);
        console.log("Address saved successfully:", result);
      } catch (error: any) {
        console.error("Failed to save address:", error);
        // Optionally surface to UI via your errors state
      } finally {
        setSavingStates((prev) => ({ ...prev, [address.id]: false }));
      }
    },
    [createWarehouse]
  );

  const renderPincodeField = (
    address: AddressData,
    field: string,
    label: string
  ) => {
    const pincode = address.pincode || "";
    const pinState = pincodeStatus[pincode?.trim() || ""];
    const errorField = (errors[address.id] as any)?.[field];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} *
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={pincode}
            onChange={(e) => {
              const next = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
              onAddressChange(address.id, field, next);
            }}
            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errorField
                ? "border-red-500"
                : pinState?.serviceable === true
                ? "border-green-500"
                : pinState?.serviceable === false
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter 6-digit pincode"
            maxLength={6}
          />

          {/* Pincode validation status icon */}
          {enablePincodeValidation && pincode.length === 6 && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {pinState?.checking ? (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              ) : pinState?.serviceable === true ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : pinState?.serviceable === false ? (
                <XCircle className="w-4 h-4 text-red-500" />
              ) : null}
            </div>
          )}
        </div>

        {/* Error message */}
        {errorField && <p className="text-red-500 text-sm mt-1">{errorField}</p>}

        {/* Serviceability status */}
        {enablePincodeValidation && !errorField && (
          <>
            {pinState?.serviceable === true && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Pincode is serviceable
              </p>
            )}
            {pinState?.serviceable === false && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {pinState?.error || "Pincode not serviceable"}
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  const renderAddress = (address: AddressData, index: number) => {
    const isSaving = savingStates[address.id];

    return (
      <div
        key={address.id}
        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">
            Address {index + 1}
          </h3>
          <div className="flex gap-2">
            {showSaveButton && (
              <button
                type="button"
                onClick={() => handleSaveAddress(address)}
                disabled={isSaving}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {isSaving ? "Saving..." : "Save Address"}
              </button>
            )}
            {canRemove && (
              <button
                type="button"
                onClick={() => onRemoveAddress(address.id)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Warehouse Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {warehouseNameLabel}
            </label>
            <input
              type="text"
              value={address.warehouse_name}
              onChange={(e) =>
                onAddressChange(address.id, "warehouse_name", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter warehouse name (e.g., Main WH - BLR)"
            />
            {errors[address.id]?.warehouse_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors[address.id]?.warehouse_name}
              </p>
            )}
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {addressLine1Label} *
            </label>
            <input
              type="text"
              value={address.addressLine1}
              onChange={(e) =>
                onAddressChange(address.id, "addressLine1", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                (errors[address.id] as AddressErrors)?.addressLine1
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter address line 1"
            />
            {(errors[address.id] as AddressErrors)?.addressLine1 && (
              <p className="text-red-500 text-sm mt-1">
                {(errors[address.id] as AddressErrors)?.addressLine1}
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {addressLine2Label}
            </label>
            <input
              type="text"
              value={address.addressLine2}
              onChange={(e) =>
                onAddressChange(address.id, "addressLine2", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address line 2 (optional)"
            />
          </div>

          {/* Pins + City/State/Country */}
          <div
            className={`grid grid-cols-1 ${
              showCountry ? "md:grid-cols-4" : "md:grid-cols-3"
            } gap-4`}
          >
            {renderPincodeField(address, "pincode", pincodeLabel)}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {cityLabel}
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) =>
                  onAddressChange(address.id, "city", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                placeholder="Auto-filled from pincode"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {stateLabel}
              </label>
              <input
                type="text"
                value={address.state}
                onChange={(e) =>
                  onAddressChange(address.id, "state", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100"
                placeholder="Auto-filled from pincode"
                disabled
              />
            </div>

            {showCountry && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {countryLabel}
                </label>
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) =>
                    onAddressChange(address.id, "country", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Country"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {title}
        </h2>
        <div className="flex gap-2">
          {existingAddresses.length > 0 && (
            <select
              onChange={(e) => {
                const selectedAddress = existingAddresses.find(
                  (w) => w.id === e.target.value
                );
                if (selectedAddress && onSelectExistingAddress) {
                  onSelectExistingAddress(selectedAddress);
                }
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Saved Address</option>
              {existingAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.warehouse_name} - {address.pickup_city}
                </option>
              ))}
            </select>
          )}
          {canAddMore && (
            <button
              type="button"
              onClick={onAddAddress}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          )}
        </div>
      </div>

      {warehouseError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{warehouseError}</p>
        </div>
      )}

      <div className="space-y-6">
        {addresses.map((address, index) => renderAddress(address, index))}
      </div>

      {!canAddMore && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Maximum {maxAddresses} addresses allowed
        </p>
      )}

      {/* Display Saved Addresses List */}
      {existingAddresses && existingAddresses.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Saved Addresses ({existingAddresses.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingAddresses.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {address.warehouse_name}
                  </h4>
                  {onSelectExistingAddress && (
                    <button
                      onClick={() => onSelectExistingAddress(address)}
                      className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                    >
                      Use
                    </button>
                  )}
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>
                    📍 {address.pickup_address}, {address.pickup_city}
                  </p>
                  <p className="text-gray-500">
                    {address.pickup_state} - {address.pickup_pincode}
                  </p>
                  <p className="text-gray-400">
                    Created:{" "}
                    {address.created_at
                      ? new Date(address.created_at).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default UnifiedAddressInput;
