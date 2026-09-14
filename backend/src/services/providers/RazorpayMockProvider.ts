import type { PaymentProvider, PaymentResult } from './PaymentProvider';
import crypto from 'crypto';

/**
 * RazorpayMockProvider
 * Mimics Razorpay's two-phase order/capture flow without real API keys.
 * - createOrder: generates a realistic rzp_order_* ID
 * - verifySignature: performs HMAC-SHA256 verification using a mock secret
 * - charge: legacy single-step path (kept for backward compat)
 */

export const RAZORPAY_MOCK_KEY_ID = 'rzp_test_BuffTurf_MOCK';
export const RAZORPAY_MOCK_KEY_SECRET = 'mock_secret_buffturf_2024';

export class RazorpayMockProvider implements PaymentProvider {
  /** Generate a mock Razorpay order */
  createOrder(amount: number, bookingId: number): { orderId: string; amount: number; currency: string; keyId: string } {
    const orderId = `rzp_order_BT${bookingId}_${Date.now()}`;
    return {
      orderId,
      amount: Math.round(amount * 100), // Razorpay works in paise
      currency: 'INR',
      keyId: RAZORPAY_MOCK_KEY_ID,
    };
  }

  /**
   * Verify mock Razorpay signature.
   * Real Razorpay: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
   */
  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_MOCK_KEY_SECRET)
      .update(payload)
      .digest('hex');
    return expectedSignature === signature;
  }

  /** Legacy single-step charge (used by old payForBooking path) */
  async charge(amount: number, meta: { bookingId: number }): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const isSuccess = Math.random() < 0.95;
    return {
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      transactionRef: `BT-PAY-${meta.bookingId}-${Date.now()}`,
    };
  }
}
