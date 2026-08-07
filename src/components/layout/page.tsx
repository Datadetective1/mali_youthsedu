import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Standard page container. One max width everywhere so pages feel related. */
export function PageShell({
  children,
  className,
  width = 'default',
}: {
  children: ReactNode;
  className?: string;
  width?: 'default' | 'narrow' | 'wide';
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 py-6 sm:py-10',
        width === 'narrow' && 'max-w-3xl',
        width === 'default' && 'max-w-5xl',
        width === 'wide' && 'max-w-6xl',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-6 sm:mb-8', className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sand-600 sm:text-lg">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export function Breadcrumb({
  label,
  items,
}: {
  label: string;
  items: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label={label} className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-sand-600">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link href={item.href} className="underline-offset-4 hover:text-brand-800 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-sand-800' : ''}>
                  {item.label}
                </span>
              )}
              {!last ? <ChevronRight aria-hidden className="size-4 text-sand-400" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Long-form prose block with readable measure. Used by the legal pages. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-2xl space-y-4 text-sand-700',
        '[&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-sand-900',
        '[&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-sand-900',
        '[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
        '[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5',
        '[&_a]:text-brand-700 [&_a]:underline [&_a]:underline-offset-2',
        className,
      )}
    >
      {children}
    </div>
  );
}
