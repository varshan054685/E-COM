import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MEASUREMENT_FIELDS = [
  'name',
  'bust',
  'waist',
  'hip',
  'shoulder',
  'sleeveLength',
  'armhole',
  'blouseLength',
  'frontNeckDepth',
  'backNeckDepth',
  'notes',
] as const;

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await prisma.measurementProfile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ profiles: rows });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to load measurements.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const data: Record<string, string | boolean | null> = { userId: user.id };
    for (const field of MEASUREMENT_FIELDS) {
      if (typeof body[field] === 'string') data[field] = body[field].trim() || null;
    }
    if (!data.name) {
      return NextResponse.json({ error: 'Please name this measurement profile.' }, { status: 400 });
    }
    if (body.isDefault) {
      await prisma.measurementProfile.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
      data.isDefault = true;
    }
    const profile = await prisma.measurementProfile.create({
      data: data as {
        userId: string;
        name: string;
        bust?: string | null;
        waist?: string | null;
        hip?: string | null;
        shoulder?: string | null;
        sleeveLength?: string | null;
        armhole?: string | null;
        blouseLength?: string | null;
        frontNeckDepth?: string | null;
        backNeckDepth?: string | null;
        notes?: string | null;
        isDefault?: boolean;
      },
    });
    return NextResponse.json({ profile });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unable to save measurements.' }, { status: 500 });
  }
}