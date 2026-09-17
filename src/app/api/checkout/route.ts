import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { computeShipping, applyCoupon } from '@/lib/commerce';
import { generateOrderNumber } from '@/lib/crypto';
import { createRazorpayOrder, razorpayConfigured, getRazorpayKeyId } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const {
      address,
      couponCode,
      paymentMethod = 'razorpay',
    } = body as {
      address?: {
        label?: string;
        fullName: string;
        phone: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        pincode: string;
      };
      couponCode?: string;
      paymentMethod?: string;
    };

    if (!address?.fullName || !address?.phone || !address?.line1 || !address?.city || !address?.state || !address?.pincode) {
      return NextResponse.json({ error: 'Please complete your delivery details.' }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: { include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Your bag is empty.' }, { status: 400 });
    }

    // ---- Server-side pricing: never trust the client ----
    let subtotal = 0;
    const lineItems = cart.items.map((item) => {
      const p = item.product;
      const unit = p.price.toNumber();
      const qty = Math.min(item.quantity, Math.max(p.stock, 0));
      const price = unit * qty;
      subtotal += price;
      return { item, qty, unit, price };
    });
    if (lineItems.some((l) => l.qty <= 0 || l.item.quantity <= 0)) {
      return NextResponse.json({ error: 'One of your pieces is out of stock. Please review your bag.' }, { status: 409 });
    }

    // Coupon
    let coupon = null;
    let discount = 0;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } });
      if (!coupon || !coupon.active) {
        return NextResponse.json({ error: 'This coupon is not valid.' }, { status: 400 });
      }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return NextResponse.json({ error: 'This coupon has expired.' }, { status: 400 });
      }
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return NextResponse.json({ error: 'This coupon has reached its usage limit.' }, { status: 400 });
      }
      const applied = applyCoupon(subtotal, { type: coupon.type, value: coupon.value.toNumber(), maxDiscount: coupon.maxDiscount?.toNumber() ?? null, minOrderValue: coupon.minOrderValue.toNumber() });
      if (applied.discount <= 0) {
        return NextResponse.json({ error: `Coupon requires a minimum order of ₹${coupon.minOrderValue.toNumber().toLocaleString('en-IN')}.` }, { status: 400 });
      }
      discount = applied.discount;
      coupon.usageCount = coupon.usageCount; // increment after successful payment
    }

    const shipping = computeShipping(subtotal);
    const total = subtotal - discount + shipping;

    const orderNumber = generateOrderNumber('JGTHS');
    const addressLabel = [address.label, address.fullName].filter(Boolean).join(' · ');

    // Save/upsert address for the user
    const savedAddress = await prisma.address.create({
      data: {
        userId: user.id,
        label: address.label || 'Shipping',
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || null,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
    });

    // Create order + reserve stock transactionally
    const order = await prisma.$transaction(async (tx) => {
      for (const { item, qty } of lineItems) {
        if (!item.product.isMadeToOrder && item.product.stock < qty) {
          throw new Error('OUT_OF_STOCK');
        }
      }
      for (const { item, qty } of lineItems) {
        if (item.product.isMadeToOrder) continue;
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: qty } },
        });
      }
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }
      return tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          customerName: address.fullName,
          customerEmail: user.email,
          customerPhone: address.phone,
          addressId: savedAddress.id,
          shippingAddress: `${addressLabel}, ${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} - ${address.pincode}`,
          subtotal,
          discount,
          shipping,
          total,
          couponCode: coupon?.code ?? null,
          status: 'PENDING_PAYMENT',
          paymentStatus: 'UNPAID',
          items: {
            create: lineItems.map(({ item, qty, unit }) => ({
              productId: item.productId,
              productName: item.product.name,
              productImage: item.product.images[0]?.url ?? null,
              size: item.size,
              color: item.color,
              quantity: qty,
              sku: item.product.sku ?? undefined,
              unitPrice: unit,
              totalPrice: unit * qty,
            })),
          },
        },
      });
    }).catch((e: unknown) => {
      if (e instanceof Error && e.message === 'OUT_OF_STOCK') {
        const err = new Error('OUT_OF_STOCK');
        (err as Error & { expose?: boolean }).expose = true;
        throw err;
      }
      throw e;
    });

    // Payment setup
    let razorpayOrderId: string | null = null;
    let mock = false;
    if (paymentMethod === 'mock' || !razorpayConfigured()) {
      mock = true;
      razorpayOrderId = `mock_${orderNumber}`;
    } else {
      try {
        const rp = await createRazorpayOrder(total, orderNumber);
        razorpayOrderId = rp.id;
      } catch (e) {
        // Fall back to mock if Razorpay is unreachable
        console.error('razorpay create failed, falling back to mock', e);
        mock = true;
        razorpayOrderId = `mock_${orderNumber}`;
      }
    }

    await prisma.payment.create({
      data: {
        orderId: order.id,
        razorpayOrderId,
        amount: total,
        currency: 'INR',
        method: paymentMethod === 'mock' || mock ? 'MOCK' : 'RAZORPAY',
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      orderNumber,
      total,
      mock,
      razorpayOrderId,
      razorpayKeyId: mock ? null : getRazorpayKeyId(),
      subtotal,
      discount,
      shipping,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in to checkout.' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'OUT_OF_STOCK') {
      return NextResponse.json({ error: 'A piece in your bag is now out of stock. Please review your bag.' }, { status: 409 });
    }
    console.error('checkout error', error);
    return NextResponse.json({ error: 'We could not place your order. Please try again.' }, { status: 500 });
  }
}