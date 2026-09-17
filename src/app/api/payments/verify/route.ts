import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature, razorpayConfigured } from '@/lib/razorpay';

/**
 * Verifies a payment for an order.
 * - Razorpay: HMAC signature is checked server-side.
 * - Mock (dev / no keys): accepts the demo "mock" signature to simulate success.
 * Never trusts the client for the paid amount — it reads the order total from the DB.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature, mock } = body as {
      orderNumber?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
      mock?: boolean;
    };

    if (!orderNumber) {
      return NextResponse.json({ error: 'Missing order reference.' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }
    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Not your order.' }, { status: 403 });
    }
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ orderNumber, ok: true });
    }
    if (order.status === 'CANCELLED') {
      return NextResponse.json({ error: 'This order was cancelled.' }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({ where: { orderId: order.id, status: 'PENDING' } });

    let verified = false;
    if (mock || !razorpayConfigured()) {
      verified = true;
    } else if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      verified = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    }

    if (!verified) {
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: { status: 'FAILED', razorpayPaymentId: razorpayPaymentId ?? null, razorpaySignature: razorpaySignature ?? null },
      });
      return NextResponse.json({ error: 'Payment verification failed. Your order was not charged.' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED', paymentStatus: 'PAID' },
      }),
      prisma.payment.updateMany({
        where: { orderId: order.id },
        data: {
          status: 'PAID',
          razorpayOrderId: razorpayOrderId ?? payment?.razorpayOrderId ?? null,
          razorpayPaymentId: razorpayPaymentId ?? null,
          razorpaySignature: razorpaySignature ?? null,
          method: mock || !razorpayConfigured() ? (payment?.method ?? 'MOCK') : 'RAZORPAY',
        },
      }),
    ]);

    return NextResponse.json({ orderNumber, ok: true, status: 'CONFIRMED' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    console.error('verify error', error);
    return NextResponse.json({ error: 'Unable to verify payment. Please contact us.' }, { status: 500 });
  }
}