import Link from 'next/link';
import {
  BookOpen,
  Briefcase,
  Globe,
  Handshake,
  HardHat,
  Languages,
  Laptop,
  Sprout,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { CareerPath } from '@/lib/types';
import { Badge, ProgressBar } from '@/components/ui';
import { cn, formatMinutes } from '@/lib/utils';
import { accentFor } from '@/components/visual/accent';

/**
 * Icons are referenced by name in the content modules, so a content author can
 * pick one without importing anything. Unknown names fall back rather than
 * crashing the page.
 */
const ICONS: Record<string, LucideIcon> = {
  Laptop,
  Languages,
  Handshake,
  HardHat,
  Briefcase,
  Sprout,
  Globe,
  Users,
  BookOpen,
};

const LEVEL_LABELS: Record<CareerPath['level'], string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
};

/**
 * Renders a content-declared icon by name.
 *
 * Written as a component rather than `const Icon = ICONS[name]` inside a
 * render body: assigning a component to a local during render creates a new
 * component identity on every pass, which React's lint rules flag and which
 * costs a remount.
 */
export function PathIcon({ name, className }: { name: string; className?: string }) {
  const Resolved = ICONS[name] ?? BookOpen;
  return <Resolved aria-hidden className={className} />;
}

export function PathCard({
  path,
  stagesLabel,
  progress,
  href,
  compact = false,
}: {
  path: CareerPath;
  stagesLabel: string;
  progress?: { done: number; total: number };
  href?: string;
  compact?: boolean;
}) {
  const target = href ?? `/parcours/${path.slug}`;

  const accent = accentFor(path.id);

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[--radius-card] border border-sand-200 bg-white transition-shadow hover:shadow-[--shadow-raised]',
      )}
    >
      {/* A colour bar per pathway. Eight identical green cards were impossible
          to tell apart at a glance, which defeats the point of a card grid. */}
      <span aria-hidden className={cn('block h-1.5 w-full', accent.bar)} />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={cn(
              'grid size-14 shrink-0 place-items-center rounded-xl shadow-sm',
              accent.tile,
            )}
          >
            <PathIcon name={path.icon} className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold sm:text-lg">
              {/* Stretched link: the whole card is the target, but only the
                  title is announced as the link. */}
              <Link href={target} className="after:absolute after:inset-0 after:content-['']">
                {path.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-sand-600">{path.summary}</p>
          </div>
        </div>

        {!compact ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{LEVEL_LABELS[path.level]}</Badge>
            <Badge tone="neutral">{stagesLabel}</Badge>
            <Badge tone="neutral">{formatMinutes(path.estimatedHours * 60)}</Badge>
            {path.caution ? <Badge tone="warning">Prérequis réglementaires</Badge> : null}
          </div>
        ) : null}

        {progress && progress.total > 0 ? (
          <ProgressBar
            className="mt-4"
            value={progress.done}
            total={progress.total}
            label="Progression"
          />
        ) : null}
      </div>
    </article>
  );
}

export type { LucideIcon };
