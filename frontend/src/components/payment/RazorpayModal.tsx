import { useState, useEffect } from 'react';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  type RazorpayOrder,
} from '../../services/api/booking';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate mock Razorpay payment ID */
function mockPaymentId() {
  return `pay_${Math.random().toString(36).substring(2, 18).toUpperCase()}`;
}

/**
 * Compute the HMAC-SHA256 signature the same way the backend does.
 * In the real Razorpay flow this is done server-side on their end;
 * here we compute it client-side using the same mock secret so the
 * backend's verification step always passes.
 */
async function computeSignature(orderId: string, paymentId: string): Promise<string> {
  const payload = `${orderId}|${paymentId}`;
  const secret = 'mock_secret_buffturf_2024';
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payload);
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface RazorpayModalProps {
  bookingId: number;
  turfName: string;
  amount: string; // display amount e.g. "₹450"
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'loading-order' | 'enter-card' | 'processing' | 'success' | 'failed';

// ─── Component ────────────────────────────────────────────────────────────────

export default function RazorpayModal({ bookingId, turfName, amount, onClose, onSuccess }: RazorpayModalProps) {
  const [step, setStep] = useState<Step>('loading-order');
  const [order, setOrder] = useState<RazorpayOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mock card fields (pre-filled with test values)
  const [cardNumber] = useState('4111 1111 1111 1111');
  const [expiry] = useState('12/26');
  const [cvv] = useState('123');
  const [cardName] = useState('Test User');

  useEffect(() => {
    // Phase 1: Create order on mount
    createRazorpayOrder(bookingId)
      .then((o) => {
        setOrder(o);
        setStep('enter-card');
      })
      .catch((err) => {
        setErrorMsg(err.response?.data?.message ?? 'Failed to initiate payment. Please try again.');
        setStep('failed');
      });
  }, [bookingId]);

  async function handlePay() {
    if (!order) return;
    setStep('processing');
    setErrorMsg(null);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1800));

    // Generate mock payment ID and compute valid signature
    const paymentId = mockPaymentId();
    const signature = await computeSignature(order.orderId, paymentId);

    try {
      await verifyRazorpayPayment(bookingId, {
        razorpay_order_id: order.orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });
      setStep('success');
      setTimeout(onSuccess, 1800);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message ?? 'Payment verification failed.');
      setStep('failed');
    }
  }

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 px-4 backdrop-blur-md">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl">

        {/* Razorpay header bar */}
        <div className="flex items-center justify-between bg-[#072654] px-5 py-4">
          <div className="flex items-center gap-3">
            {/* Razorpay logo (SVG inline) */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#3395FF" />
              <path d="M8 20L14 8L20 20H16.5L14 14.5L11.5 20H8Z" fill="white" />
            </svg>
            <div>
              <p className="text-[10px] text-blue-300 font-medium tracking-wide uppercase">Secure Checkout</p>
              <p className="text-sm font-bold text-white">{turfName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={step === 'processing' || step === 'loading-order'}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="bg-white px-6 py-6">

          {/* ── Loading order ── */}
          {step === 'loading-order' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Initiating secure payment session...</p>
            </div>
          )}

          {/* ── Enter card ── */}
          {step === 'enter-card' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Due</span>
                <span className="font-mono text-xl font-black text-gray-900">{amount}</span>
              </div>

              {/* Test mode badge */}
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                <span className="text-amber-500 text-sm">⚠️</span>
                <p className="text-xs text-amber-700 font-medium">Test Mode — Pre-filled with test card details</p>
              </div>

              {/* Card number */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Card Number</label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <input
                    readOnly
                    value={cardNumber}
                    className="flex-1 bg-transparent font-mono text-sm font-semibold text-gray-800 outline-none"
                  />
                  {/* Card brand icons */}
                  <div className="flex gap-1">
                    <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-blue-600">VISA</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Expiry Date</label>
                  <input
                    readOnly
                    value={expiry}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 font-mono text-sm text-gray-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">CVV</label>
                  <input
                    readOnly
                    value={cvv}
                    type="password"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 font-mono text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Cardholder Name</label>
                <input
                  readOnly
                  value={cardName}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none"
                />
              </div>

              <button
                onClick={handlePay}
                className="mt-2 w-full rounded-lg bg-[#3395FF] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#1a7fe0] active:scale-[0.98]"
              >
                Pay {amount} Securely →
              </button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <p className="text-[11px] text-gray-400">Secured by Razorpay · 256-bit SSL</p>
              </div>
            </div>
          )}

          {/* ── Processing ── */}
          {step === 'processing' && (
            <div className="flex flex-col items-center gap-5 py-10">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-100 border-t-blue-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-800">Processing Payment</p>
                <p className="text-sm text-gray-500 mt-1">Please wait, do not close this window...</p>
              </div>
              <div className="w-full space-y-2">
                {['Verifying card details', 'Contacting bank', 'Confirming transaction'].map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: `${i * 300}ms` }} />
                    <span className="text-xs text-gray-500">{label}...</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Success ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-9 w-9 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Payment Successful!</p>
                <p className="text-sm text-gray-500 mt-1">
                  {amount} paid · Booking confirmed 🎉
                </p>
              </div>
              <p className="text-xs text-gray-400">Redirecting...</p>
            </div>
          )}

          {/* ── Failed ── */}
          {step === 'failed' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-9 w-9 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">Payment Failed</p>
                <p className="text-sm text-red-500 mt-1">{errorMsg ?? 'Something went wrong. Please try again.'}</p>
              </div>
              <div className="flex w-full gap-3 mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setErrorMsg(null);
                    setStep('loading-order');
                    createRazorpayOrder(bookingId)
                      .then((o) => { setOrder(o); setStep('enter-card'); })
                      .catch(() => setStep('failed'));
                  }}
                  className="flex-1 rounded-lg bg-[#3395FF] py-2.5 text-sm font-bold text-white hover:bg-[#1a7fe0]"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Razorpay footer */}
        <div className="flex items-center justify-center gap-1.5 bg-gray-50 py-3 border-t border-gray-100">
          <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#3395FF" />
            <path d="M8 20L14 8L20 20H16.5L14 14.5L11.5 20H8Z" fill="white" />
          </svg>
          <span className="text-[11px] text-gray-400 font-medium">Powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
}
