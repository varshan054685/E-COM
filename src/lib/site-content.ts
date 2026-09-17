import { prisma } from '@/lib/prisma';

export async function getSiteContentMap(): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getSiteValue(key: string) {
  const row = await prisma.siteContent.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function setSiteValue(key: string, value: string) {
  return prisma.siteContent.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}