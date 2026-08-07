import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { exportUserData } from '@/lib/db/repository';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * Data export.
 *
 * Returns everything held about the caller as one JSON file. Rate limited
 * because it is an expensive read, and `no-store` so a shared browser does not
 * keep a copy of someone's whole profile in its cache.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
  }

  const limit = await checkRateLimit(`export:${session.userId}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Trop de demandes d’export. Reessayez plus tard.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  const data = await exportUserData(session.userId);
  const filename = `mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
