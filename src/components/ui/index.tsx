import type { ComponentProps, ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn, percent } from '@/lib/utils';

/**
 * Accessible primitives, hand-written.
 *
 * No component library and no Radix: every kilobyte here is downloaded over a
 * metered connection on a low-end phone. Native elements (`details`, `dialog`,
 * real form controls) give correct semantics and keyboard behaviour for free —
 * see docs/DECISIONS.md, ADR-002.
 */

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'rounded-[--radius-card] border border-sand-200 bg-white shadow-[--shadow-card]',
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-4 sm:p-5', className)} {...props} />;
}

export function CardHeader({
  title,
  description,
  action,
  level = 2,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  level?: 2 | 3 | 4;
  className?: string;
}) {
  const Heading = `h${level}` as 'h2' | 'h3' | 'h4';
  return (
    <div className={cn('flex items-start justify-between gap-3 p-4 pb-0 sm:p-5 sm:pb-0', className)}>
      <div className="min-w-0">
        <Heading className={cn(level === 2 ? 'text-lg' : 'text-base', 'font-bold')}>{title}</Heading>
        {description ? <p className="mt-1 text-sm text-sand-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
  action,
  id,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn('space-y-4', className)} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={id ? `${id}-title` : undefined} className="text-xl font-bold sm:text-2xl">
            {title}
          </h2>
          {description ? <p className="mt-1 max-w-2xl text-sand-600">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Badges and chips
// ---------------------------------------------------------------------------

const badgeTones = {
  neutral: 'bg-sand-100 text-sand-700 border-sand-200',
  brand: 'bg-brand-50 text-brand-800 border-brand-200',
  accent: 'bg-accent-50 text-accent-800 border-accent-200',
  success: 'bg-success-50 text-success-700 border-success-600/20',
  warning: 'bg-warning-50 text-warning-700 border-warning-600/20',
  danger: 'bg-danger-50 text-danger-700 border-danger-600/20',
  info: 'bg-info-50 text-info-700 border-info-600/20',
} as const;

export type BadgeTone = keyof typeof badgeTones;

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: ComponentProps<'span'> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

export function ProgressBar({
  value,
  total,
  label,
  showValue = true,
  tone = 'brand',
  className,
}: {
  value: number;
  total: number;
  label: string;
  showValue?: boolean;
  tone?: 'brand' | 'accent';
  className?: string;
}) {
  const pct = percent(value, total);
  return (
    <div className={className}>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-sand-700">{label}</span>
        {showValue ? (
          <span className="text-sm font-semibold tabular-nums text-sand-800">{pct} %</span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2.5 w-full overflow-hidden rounded-full bg-sand-200"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300',
            tone === 'brand' ? 'bg-brand-600' : 'bg-accent-500',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notices
// ---------------------------------------------------------------------------

const noticeTones = {
  info: { wrapper: 'bg-info-50 border-info-600/30 text-info-700', Icon: Info },
  success: { wrapper: 'bg-success-50 border-success-600/30 text-success-700', Icon: CheckCircle2 },
  warning: { wrapper: 'bg-warning-50 border-warning-600/30 text-warning-700', Icon: AlertTriangle },
  danger: { wrapper: 'bg-danger-50 border-danger-600/30 text-danger-700', Icon: XCircle },
} as const;

export function Notice({
  tone = 'info',
  title,
  children,
  className,
  role,
}: {
  tone?: keyof typeof noticeTones;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  role?: 'status' | 'alert';
}) {
  const { wrapper, Icon } = noticeTones[tone];
  return (
    <div
      role={role ?? (tone === 'danger' ? 'alert' : undefined)}
      className={cn('flex gap-3 rounded-lg border p-3 sm:p-4', wrapper, className)}
    >
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 text-sm">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn(title && 'mt-1', 'text-current/90')}>{children}</div> : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty and loading states
// ---------------------------------------------------------------------------

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[--radius-card] border border-dashed border-sand-300 bg-sand-50 p-6 text-center sm:p-10">
      {icon ? <div className="mx-auto mb-3 text-sand-400">{icon}</div> : null}
      <p className="font-semibold text-sand-800">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-sand-600">{description}</p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('skeleton', className)} />;
}

export function LoadingBlock({ label, rows = 3 }: { label: string; rows?: number }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-24 w-full" />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Disclosure — native <details>, so it works before hydration
// ---------------------------------------------------------------------------

export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        'group rounded-lg border border-sand-200 bg-white [&[open]>summary]:border-b',
        className,
      )}
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 border-sand-200 px-4 py-3 font-semibold marker:content-none">
        <span className="min-w-0">{summary}</span>
        <span
          aria-hidden
          className="shrink-0 text-sand-500 transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="px-4 py-3 text-sm">{children}</div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------

export function BulletList({
  items,
  className,
  marker = 'disc',
}: {
  items: ReactNode[];
  className?: string;
  marker?: 'disc' | 'check' | 'decimal';
}) {
  if (marker === 'decimal') {
    return (
      <ol className={cn('list-decimal space-y-1.5 pl-5', className)}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  }

  return (
    <ul className={cn('space-y-1.5', marker === 'disc' && 'list-disc pl-5', className)}>
      {items.map((item, index) => (
        <li key={index} className={marker === 'check' ? 'flex gap-2' : undefined}>
          {marker === 'check' ? (
            <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" />
          ) : null}
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DefinitionList({
  items,
  className,
}: {
  items: { term: ReactNode; description: ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {items.map((item, index) => (
        <div key={index} className="rounded-lg bg-sand-50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-sand-500">
            {item.term}
          </dt>
          <dd className="mt-1 text-sm text-sand-800">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------------------
// External link — always states that it leaves the site
// ---------------------------------------------------------------------------

export function ExternalLink({
  href,
  children,
  className,
  srHint = 'ouvre un nouvel onglet',
}: {
  href: string;
  children: ReactNode;
  className?: string;
  srHint?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={cn('font-medium text-brand-700 underline underline-offset-2 hover:text-brand-900', className)}
    >
      {children}
      <span className="sr-only"> ({srHint})</span>
    </a>
  );
}
