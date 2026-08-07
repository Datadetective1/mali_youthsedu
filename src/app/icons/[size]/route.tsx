import { ImageResponse } from 'next/og';
import { brand } from '@/config';

/**
 * PWA icons, rendered at build time rather than committed as binaries.
 *
 * Keeps the repository free of generated assets and means the icon follows the
 * brand name if it changes. Only the two sizes the manifest declares are
 * generated; anything else 404s.
 */

const SIZES = ['192', '512'] as const;

export function generateStaticParams() {
  return SIZES.map((size) => ({ size }));
}

export const dynamicParams = false;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: rawSize } = await params;
  const size = Number(rawSize);
  if (!SIZES.includes(rawSize as (typeof SIZES)[number])) {
    return new Response('Not found', { status: 404 });
  }

  const letter = brand.shortName.slice(0, 1).toUpperCase() || 'M';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#124d3e',
          color: '#ffffff',
          fontSize: size * 0.5,
          fontWeight: 700,
          // Maskable icons are cropped to a circle on many launchers; the
          // rounded square keeps the letter inside the safe zone.
          borderRadius: size * 0.22,
        }}
      >
        {letter}
      </div>
    ),
    { width: size, height: size },
  );
}
