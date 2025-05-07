export type PaymentStatus = 'success' | 'pending' | 'error' | 'timeout';

export interface PaymentResponse {
  status: PaymentStatus;
  orderId?: string;
  buyOrder?: string;
  message?: string;
}

export interface PaymentData {
  nombre: string;
  email: string;
  sitio: string;
}

export interface FlowPaymentResponse {
  url: string;
  token?: string;
  orderId: string;
}

export interface WebpayPaymentResponse {
  url: string;
  token: string;
  buyOrder: string;
}

export interface PaymentStatusResponse {
  status: PaymentStatus;
  message?: string;
} 