// This file has been replaced with UnifiedAddressInput for better warehouse integration
// Keeping this as a compatibility wrapper

"use client";

import React from "react";
import UnifiedAddressInput, { 
  AddressData, 
  AddressErrors, 
  PincodeStatus 
} from './UnifiedAddressInput';

export type { AddressData, AddressErrors, PincodeStatus };

export interface DynamicAddressInputProps {
  title: string;
  addresses: AddressData[];
  errors: Record<string, AddressErrors>;
  onAddressChange: (id: string, field: keyof AddressData | string, value: string) => void;
  onAddAddress: () => void;
  onRemoveAddress: (id: string) => void;
  minAddresses?: number;
  maxAddresses?: number;
  showCountry?: boolean;
  addressLine1Label?: string;
  addressLine2Label?: string;
  pincodeLabel?: string;
  cityLabel?: string;
  stateLabel?: string;
  countryLabel?: string;
  enablePincodeValidation?: boolean;
}

// Compatibility wrapper - forwards all props to UnifiedAddressInput
const DynamicAddressInput: React.FC<DynamicAddressInputProps> = (props) => {
  return (
    <UnifiedAddressInput
      {...props}
      onAddressChange={props.onAddressChange}
      showSaveButton={false} // Default to false for compatibility
    />
  );
};

export default DynamicAddressInput;
