import type { PaymentProvider, PaymentResult } from './PaymentProvider';

export class MockPaymentProvider implements PaymentProvider {
  async charge(amount: number, meta: { bookingId: number }): Promise<PaymentResult> {
    // Simulate real network latency, so the frontend loading state is genuinely testable
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate a ~90% success rate — realistic enough to test both paths
    const isSuccess = Math.random() < 0.9;

    return {
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      transactionRef: `MOCK-${meta.bookingId}-${Date.now()}`,
    };
  }
}