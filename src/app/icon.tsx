import { ImageResponse } from 'next/og';
import { brand } from '@/config';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 20,
          fontWeight: 700,
          borderRadius: 7,
        }}
      >
        {brand.shortName.slice(0, 1).toUpperCase() || 'M'}
      </div>
    ),
    size,
  );
}
