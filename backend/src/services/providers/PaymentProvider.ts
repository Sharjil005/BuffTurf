export interface PaymentResult {
  status: 'SUCCESS' | 'FAILED';
  transactionRef: string;
}

export interface PaymentProvider {
  charge(amount: number, meta: { bookingId: number }): Promise<PaymentResult>;
}