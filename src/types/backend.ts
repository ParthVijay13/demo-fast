// Backend API types to match the controller responses

export interface BackendApiResponse<T = any> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
  error?: string;
}

export interface BackendOrder {
  id: string;
  order_id: string;
  consignee_name: string;
  consignee_phone: string;
  consingee_email?: string;
  consignee_address_line_1: string;
  consignee_address_line_2?: string;
  consignee_state: string;
  consignee_city: string;
  consignee_country: string;
  consignee_pincode: string;
  same_billing_shipping: boolean;
  billing_address_line_1: string;
  billing_address_line_2?: string;
  billing_state: string;
  billing_city: string;
  billing_country: string;
  billing_pincode: string;
  package_weight?: number;
  package_length?: number;
  package_breadth?: number;
  package_height?: number;
  payment_mode: string;
  cod_amount?: number;
  shipment_mode: string;
  order_type: string;
  status: string;
  awb_number?: string;
  pickup_address_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  order_items: BackendOrderItem[];
  pickup_address: BackendPickupAddress;
}

export interface BackendOrderItem {
  id: string;
  order_id: string;
  item_name: string;
  sku_code: string;
  category: string;
  product_image?: string;
  price?: number;
  discount?: number;
  is_fragile?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BackendPickupAddress {
  id: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_country: string;
  pickup_pincode: string;
  warehouse_name: string;
  return_address?: string;
  return_city?: string;
  return_state?: string;
  return_country?: string;
  return_pincode?: string;
  phone?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateForwardOrderRequest {
  order_id: string;
  consignee_name: string;
  consignee_phone: string;
  consingee_email?: string;
  consignee_address_line_1: string;
  consignee_address_line_2?: string;
  consignee_state: string;
  consignee_city: string;
  consignee_country: string;
  consignee_pincode: string;
  same_billing_shipping?: boolean;
  billing_address_line_1?: string;
  billing_address_line_2?: string;
  billing_state?: string;
  billing_city?: string;
  billing_country?: string;
  billing_pincode?: string;
  package_weight?: number;
  package_length?: number;
  package_breadth?: number;
  package_height?: number;
  payment_mode: string;
  cod_amount?: number;
  shipment_mode: string;
  order_items: CreateOrderItemRequest[];
  pickup_address_id: string;
}

export interface CreateOrderItemRequest {
  item_name: string;
  sku_code: string;
  category: string;
  product_image?: string;
  price?: number;
  discount?: number;
  is_fragile?: boolean;
}

export interface CreateReverseOrderRequest {
  order_id: string;
  consignee_name: string;
  consignee_phone: string;
  consingee_email?: string;
  consignee_address_line_1: string;
  consignee_address_line_2?: string;
  consignee_pincode: string;
  consignee_city: string;
  consignee_state: string;
  consignee_country: string;
  reason_for_return?: string;
  package_breadth?: number;
  package_height?: number;
  package_length?: number;
  package_weight?: number;
  order_items: CreateOrderItemRequest[];
  pickup_address_id: string;
}

export interface GetOrdersRequest {
  page?: string;
  offset?: string;
  query?: string;
  order_type?: string;
  status?: string;
  payment_mode?: string;
}

export interface GetOrdersResponse {
  orders: BackendOrder[];
  metadata: {
    total_items: number;
    current_page: number;
    items_per_page: number;
    total_pages: number;
  };
}

export interface ManifestOrdersRequest {
  order_ids: string[];
}

export interface ManifestOrdersResponse {
  successful: Array<{
    order_id: string;
    id: string;
    awb_number: string;
    status: string;
  }>;
  failed: Array<{
    order_id: string;
    id: string;
    error: string;
  }>;
  summary: {
    total_requested: number;
    successful_count: number;
    failed_count: number;
  };
}

export interface CreateReverseOrderOnExistingRequest {
  order_ids: string[];
}

export interface CreateReverseOrderOnExistingResponse {
  successful: Array<{
    original_order_id: string;
    reverse_order_id: string;
    reverse_internal_id: string;
    awb_number: string;
    status: string;
  }>;
  failed: Array<{
    order_id: string;
    id: string;
    error: string;
  }>;
  summary: {
    total_requested: number;
    successful_count: number;
    failed_count: number;
  };
}

// CSV Bulk Upload Response
export interface BulkOrderUploadResponse {
  successful: Array<{
    row: number;
    order_id: string;
    id: string;
    status: string;
  }>;
  failed: Array<{
    row: number;
    order_id: string;
    error: string;
  }>;
  summary: {
    total_rows: number;
    successful_count: number;
    failed_count: number;
  };
}
