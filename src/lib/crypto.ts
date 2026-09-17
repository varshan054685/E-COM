import crypto from 'crypto';

export function generateOrderNumber(prefix: string): string {
  const rand = crypto.randomInt(1024, 9999).toString();
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${time}${rand}`;
}

export function sha256Verify(data: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return signature === expected;
}