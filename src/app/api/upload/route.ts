import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
const MAX_SIZE = 6 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Please upload a JPG, PNG, WEBP or HEIC image.' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image must be under 6MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.jpg';
    const name = `${crypto.randomBytes(12).toString('hex')}${ext.toLowerCase()}`;
    const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, name), buffer);

    return NextResponse.json({ url: `/uploads/${name}` });
  } catch {
    return NextResponse.json({ error: 'Unable to upload the image. Please try again.' }, { status: 500 });
  }
}