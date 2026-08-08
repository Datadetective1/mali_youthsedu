/**
 * Hero illustration: the seven-step journey as a rising path.
 *
 * Inline SVG, not an image. A photograph or a raster illustration would be
 * 100–400 KB on a connection where that is real money; this is under 2 KB of
 * markup, scales to any screen, and inherits the theme's colours.
 *
 * It is decorative — the same information is in the text beside it — so it is
 * hidden from assistive technology rather than given a description nobody
 * needs to hear.
 */
export function JourneyIllustration({ className }: { className?: string }) {
  const steps = [
    { x: 40, y: 190, label: 'Découvrir' },
    { x: 110, y: 165, label: 'Apprendre' },
    { x: 180, y: 138, label: 'Pratiquer' },
    { x: 250, y: 112, label: 'Préparer' },
    { x: 320, y: 86, label: 'Postuler' },
    { x: 390, y: 58, label: 'Gagner' },
    { x: 452, y: 32, label: 'Transmettre' },
  ];

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 500 230"
      className={className}
      role="presentation"
    >
      <defs>
        <linearGradient id="myp-journey" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-brand-500)" />
          <stop offset="55%" stopColor="var(--color-accent-500)" />
          <stop offset="100%" stopColor="var(--color-accent-300)" />
        </linearGradient>
      </defs>

      {/* Ground line. */}
      <line
        x1="16"
        y1="212"
        x2="484"
        y2="212"
        stroke="var(--color-sand-200)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* The climb. */}
      <path
        d="M40 190 C 90 182, 90 172, 110 165 S 160 148, 180 138 S 230 120, 250 112 S 300 94, 320 86 S 370 66, 390 58 S 440 40, 452 32"
        fill="none"
        stroke="url(#myp-journey)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Steps. The last one is filled — the point is that it is reachable. */}
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <g key={step.label}>
            <line
              x1={step.x}
              y1={step.y + 8}
              x2={step.x}
              y2="212"
              stroke="var(--color-sand-200)"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
            <circle
              cx={step.x}
              cy={step.y}
              r={last ? 11 : 8}
              fill={last ? 'var(--color-accent-500)' : 'var(--color-sand-50)'}
              stroke={last ? 'var(--color-accent-600)' : 'var(--color-brand-500)'}
              strokeWidth="2.5"
            />
            {last ? (
              <path
                d={`M${step.x - 4.5} ${step.y} l3.2 3.4 l6-6.4`}
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </g>
        );
      })}

      {/* Labels only at the ends: seven rotated labels would be unreadable at
          320px, and the list beneath the hero already names every step. */}
      <text x="40" y="228" textAnchor="middle" fontSize="11" fill="var(--color-sand-500)">
        Découvrir
      </text>
      <text x="452" y="228" textAnchor="end" fontSize="11" fill="var(--color-accent-700)" fontWeight="600">
        Transmettre
      </text>
    </svg>
  );
}
