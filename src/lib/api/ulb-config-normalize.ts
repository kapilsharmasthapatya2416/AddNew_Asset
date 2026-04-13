import type { UlbConfigApiBody } from '@/types/login.types';

function read(obj: Record<string, unknown>, camel: string, pascal: string): unknown {
  if (Object.prototype.hasOwnProperty.call(obj, camel) && obj[camel] != null) return obj[camel];
  if (Object.prototype.hasOwnProperty.call(obj, pascal) && obj[pascal] != null) return obj[pascal];
  return undefined;
}

function str(v: unknown): string {
  return v == null ? '' : String(v);
}

/**
 * Accepts flat camelCase, flat PascalCase (.NET Newtonsoft), or a wrapped `{ data }` / `{ result }` object.
 */
export function parseUlbConfigPayload(data: unknown): UlbConfigApiBody | null {
  if (data === null || data === undefined || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }

  let o: Record<string, unknown> = data as Record<string, unknown>;

  const unwrap = (key: string) => {
    const inner = o[key];
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      const rec = inner as Record<string, unknown>;
      if (rec.ulbId !== undefined || rec.UlbId !== undefined) {
        o = rec;
      }
    }
  };
  unwrap('data');
  unwrap('result');
  unwrap('value');

  const ulbIdRaw = read(o, 'ulbId', 'UlbId');
  const ulbId = typeof ulbIdRaw === 'number' ? ulbIdRaw : Number(ulbIdRaw);
  if (!Number.isFinite(ulbId) || ulbId < 1) {
    return null;
  }

  return {
    ulbId,
    ulbCode: str(read(o, 'ulbCode', 'UlbCode')),
    ulbName: str(read(o, 'ulbName', 'UlbName')),
    ulbNameLocal: (read(o, 'ulbNameLocal', 'UlbNameLocal') as string | null | undefined) ?? null,
    ulbLogo: (read(o, 'ulbLogo', 'UlbLogo') as string | null | undefined) ?? null,
    emailId: (read(o, 'emailId', 'EmailId') as string | null | undefined) ?? null,
    mobileNo: (read(o, 'mobileNo', 'MobileNo') as string | null | undefined) ?? null,
    websiteUrl: (read(o, 'websiteUrl', 'WebsiteUrl') as string | null | undefined) ?? null,
    ulbAddress: (read(o, 'ulbAddress', 'UlbAddress') as string | null | undefined) ?? null,
    state: (read(o, 'state', 'State') as string | null | undefined) ?? null,
    district: (read(o, 'district', 'District') as string | null | undefined) ?? null,
  };
}
