import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Contact form submission
    if (body.type === 'contact') {
      const email = String(body.email || '').trim().toLowerCase();
      const name = String(body.name || '').trim();
      const message = String(body.message || '').trim();
      const phone = String(body.phone || '').trim();

      if (!name) return NextResponse.json({ error: 'Please tell us your name.' }, { status: 400 });
      if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
      if (message.length < 5) return NextResponse.json({ error: 'Please write a short message.' }, { status: 400 });

      await prisma.siteContent.create({
        data: {
          key: `contact:${Date.now()}:${email}`,
          value: JSON.stringify({ name, email, phone, message, receivedAt: new Date().toISOString() }),
        },
      });
      return NextResponse.json({ ok: true });
    }

    // Newsletter signup
    const email = String(body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    await prisma.siteContent.upsert({
      where: { key: `newsletter:${email}` },
      create: { key: `newsletter:${email}`, value: new Date().toISOString() },
      update: {},
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unable to submit. Please try again.' }, { status: 500 });
  }
}
