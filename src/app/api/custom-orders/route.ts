import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/crypto';
import { GARMENT_TYPES, OCCASIONS, FABRICS, EMBROIDERY_STYLES, NECK_DESIGNS, SLEEVE_DESIGNS, BACK_DESIGNS, STANDARD_SIZES } from '@/lib/custom-order';

async function loadProfiles(userId: string) {
  return prisma.measurementProfile.findMany({ where: { userId } });
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const {
      creationType,
      occasion,
      preferredColor,
      fabric,
      embroideryStyle,
      neckDesign,
      sleeveDesign,
      backDesign,
      additionalNotes,
      standardSize,
      useCustomMeasurements,
      measurementProfileId,
      customMeasurements,
      deadline,
      imageUrls,
    } = body as {
      creationType?: string;
      occasion?: string;
      preferredColor?: string;
      fabric?: string;
      embroideryStyle?: string;
      neckDesign?: string;
      sleeveDesign?: string;
      backDesign?: string;
      additionalNotes?: string;
      standardSize?: string;
      useCustomMeasurements?: boolean;
      measurementProfileId?: string;
      customMeasurements?: Record<string, string | null>;
      deadline?: string;
      imageUrls?: string[];
    };

    if (!creationType || !GARMENT_TYPES.includes(creationType as never)) {
      return NextResponse.json({ error: 'Please choose what you would like created.' }, { status: 400 });
    }

    // Resolve measurements
    let profileUsed = false;
    let measurementsSummary = '';
    if (useCustomMeasurements && measurementProfileId) {
      const profile = await prisma.measurementProfile.findUnique({ where: { id: measurementProfileId } });
      if (profile && profile.userId === user.id) {
        profileUsed = true;
        const m = profile;
        measurementsSummary = [
          m.name ? `Profile: ${m.name}` : null,
          m.bust ? `Bust ${m.bust}` : null,
          m.waist ? `Waist ${m.waist}` : null,
          m.hip ? `Hip ${m.hip}` : null,
          m.shoulder ? `Shoulder ${m.shoulder}` : null,
          m.sleeveLength ? `Sleeve ${m.sleeveLength}` : null,
          m.armhole ? `Armhole ${m.armhole}` : null,
          m.blouseLength ? `Blouse length ${m.blouseLength}` : null,
          m.frontNeckDepth ? `Front neck ${m.frontNeckDepth}` : null,
          m.backNeckDepth ? `Back neck ${m.backNeckDepth}` : null,
        ].filter(Boolean).join(' · ');
      }
    } else if (useCustomMeasurements && customMeasurements) {
      const map: Array<[keyof typeof customMeasurements, string]> = [
        ['bust', 'Bust'],
        ['waist', 'Waist'],
        ['hip', 'Hip'],
        ['shoulder', 'Shoulder'],
        ['sleeveLength', 'Sleeve length'],
        ['armhole', 'Armhole'],
        ['blouseLength', 'Blouse length'],
        ['frontNeckDepth', 'Front neck depth'],
        ['backNeckDepth', 'Back neck depth'],
      ];
      measurementsSummary = map
        .map(([k, label]) => (customMeasurements[k] ? `${label} ${customMeasurements[k]}` : null))
        .filter(Boolean)
        .join(' · ');
      if (!measurementsSummary.length && !standardSize) {
        return NextResponse.json({ error: 'Please provide your measurements or a standard size.' }, { status: 400 });
      }
    } else if (!standardSize) {
      return NextResponse.json({ error: 'Please provide your measurements or a standard size.' }, { status: 400 });
    }

    const orderNumber = generateOrderNumber('CO');
    const sanitize = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 600) : null);

    const customOrder = await prisma.customOrder.create({
      data: {
        orderNumber,
        userId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '',
        creationType: creationType,
        occasion: sanitize(occasion),
        preferredColor: sanitize(preferredColor),
        fabric: sanitize(fabric),
        embroideryStyle: sanitize(embroideryStyle),
        neckDesign: sanitize(neckDesign),
        sleeveDesign: sanitize(sleeveDesign),
        backDesign: sanitize(backDesign),
        additionalNotes: sanitize(additionalNotes),
        standardSize: STANDARD_SIZES.includes(standardSize as never) ? standardSize : null,
        useCustomMeasurements: Boolean(useCustomMeasurements),
        measurementProfileId: profileUsed ? measurementProfileId : null,
        measurementsSummary: measurementsSummary || null,
        deadline: deadline ? new Date(deadline) : null,
        status: 'NEW_REQUEST',
        paymentStatus: 'UNPAID',
        images: {
          create: (imageUrls || []).slice(0, 3).map((url) => ({ url })),
        },
      },
    });

    return NextResponse.json({ customOrder: { orderNumber: customOrder.orderNumber, status: customOrder.status } });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in to submit your creation request.' }, { status: 401 });
    }
    console.error('custom order create error', error);
    return NextResponse.json({ error: 'We could not save your request. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await prisma.customOrder.findMany({
      where: { userId: user.id },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({
      requests: rows.map((r) => ({
        orderNumber: r.orderNumber,
        creationType: r.creationType,
        status: r.status,
        statusLabel: r.status,
        paymentStatus: r.paymentStatus,
        quoteAmount: r.quoteAmount?.toNumber() ?? null,
        createdAt: r.createdAt,
        deadline: r.deadline,
        image: r.images[0]?.url ?? null,
      })),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to load your requests.' }, { status: 500 });
  }
}