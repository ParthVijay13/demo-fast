import { apiClient } from './client';

export interface PincodeServiceabilityResponse {
  pincode: string;
  city: string;
  district: string;
  state_code: string;
  country_code: string;
  is_serviceable: boolean;
  services: {
    cash_on_delivery: boolean;
    prepaid: boolean;
    pickup_available: boolean;
    cash_collection: boolean;
    replacement: boolean;
  };
  delivery_info: {
    is_out_of_delivery: boolean;
    max_weight: number;
    max_amount: number;
    sort_code: string;
    sunday_delivery: boolean;
  };
  additional_info: {
    covid_zone: string;
    remarks: string;
    protect_blacklist: boolean;
    inc: string;
  };
}

export interface BackendApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
}

export const PincodeApi = {
  // Check pincode serviceability
  checkServiceability: async (pincode: string): Promise<PincodeServiceabilityResponse> => {
    const response = await apiClient.get<BackendApiResponse<PincodeServiceabilityResponse>>(
      `/pincode-serviceability?pincode=${pincode}`
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to check pincode serviceability');
    }

    return response.data;
  },
};

export type PincodeApiType = typeof PincodeApi;
