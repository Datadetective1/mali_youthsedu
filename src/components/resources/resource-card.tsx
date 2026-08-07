import { AlertTriangle, Clock, ExternalLink as ExternalIcon, ShieldCheck, WifiOff } from 'lucide-react';
import type { LearningResource } from '@/lib/types';
import { Badge, Card, CardBody, type BadgeTone } from '@/components/ui';
import { formatMinutes } from '@/lib/utils';

const FORMAT_LABELS: Record<LearningResource['format'], string> = {
  cours: 'Cours',
  video: 'Vidéo',
  article: 'Article',
  guide: 'Guide',
  exercice: 'Exercice',
  outil: 'Outil',
  modele: 'Modèle',
  podcast: 'Audio',
  livre: 'Livre',
};

const LANGUAGE_LABELS: Record<LearningResource['language'], string> = {
  fr: 'Français',
  en: 'Anglais',
  bm: 'Bambara',
  multi: 'Plusieurs langues',
};

const CONNECTIVITY: Record<
  LearningResource['connectivity'],
  { label: string; tone: BadgeTone }
> = {
  offline: { label: 'Utilisable hors ligne', tone: 'success' },
  low: { label: 'Peu de données', tone: 'success' },
  medium: { label: 'Connexion requise', tone: 'neutral' },
  high: { label: 'Consomme beaucoup de données', tone: 'warning' },
};

const VERIFICATION: Record<
  LearningResource['verification'],
  { label: string; tone: BadgeTone }
> = {
  verified: { label: 'Lien vérifié', tone: 'success' },
  pending: { label: 'À vérifier avant publication', tone: 'warning' },
  broken: { label: 'Lien signalé inaccessible', tone: 'danger' },
};

/**
 * A resource entry.
 *
 * Data cost and verification status are shown as prominently as the title.
 * Someone on a 500 MB monthly bundle needs to know a link is a video course
 * *before* tapping it, and needs to know when we have not checked the link
 * ourselves.
 */
export function ResourceCard({
  resource,
  compact = false,
  action,
}: {
  resource: LearningResource;
  compact?: boolean;
  action?: React.ReactNode;
}) {
  const connectivity = CONNECTIVITY[resource.connectivity];
  const verification = VERIFICATION[resource.verification];

  return (
    <Card className="h-full">
      <CardBody className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-brand-800 underline-offset-4 hover:underline"
              >
                {resource.title}
                <span className="sr-only"> (ouvre un nouvel onglet)</span>
              </a>
            </h3>
            <p className="mt-0.5 text-sm text-sand-500">{resource.provider}</p>
          </div>
          <ExternalIcon aria-hidden className="mt-1 size-4 shrink-0 text-sand-400" />
        </div>

        {!compact ? (
          <p className="mt-2 text-sm text-sand-600">{resource.description}</p>
        ) : null}

        <ul className="mt-3 flex flex-wrap gap-1.5">
          <li>
            <Badge tone="neutral">{FORMAT_LABELS[resource.format]}</Badge>
          </li>
          <li>
            <Badge tone="neutral">{LANGUAGE_LABELS[resource.language]}</Badge>
          </li>
          <li>
            <Badge tone="neutral">
              <Clock aria-hidden className="size-3" />
              {formatMinutes(resource.minutes)}
            </Badge>
          </li>
          <li>
            <Badge tone={connectivity.tone}>
              {resource.connectivity === 'offline' || resource.connectivity === 'low' ? (
                <WifiOff aria-hidden className="size-3" />
              ) : null}
              {connectivity.label}
            </Badge>
          </li>
          {resource.cost === 'freemium' ? (
            <li>
              <Badge tone="warning">Gratuit puis payant</Badge>
            </li>
          ) : (
            <li>
              <Badge tone="success">Gratuit</Badge>
            </li>
          )}
          {resource.certificate ? (
            <li>
              <Badge tone="info">Attestation possible</Badge>
            </li>
          ) : null}
          {!resource.mobileFriendly ? (
            <li>
              <Badge tone="warning">Peu adapté au petit écran</Badge>
            </li>
          ) : null}
        </ul>

        {!compact && resource.qualityNotes ? (
          <p className="mt-3 rounded-lg bg-sand-50 p-2.5 text-sm text-sand-600">
            {resource.qualityNotes}
          </p>
        ) : null}

        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          {resource.verification === 'verified' ? (
            <ShieldCheck aria-hidden className="size-4 text-success-600" />
          ) : (
            <AlertTriangle aria-hidden className="size-4 text-warning-600" />
          )}
          <Badge tone={verification.tone}>{verification.label}</Badge>
        </p>

        {action ? <div className="mt-3 pt-1">{action}</div> : null}
      </CardBody>
    </Card>
  );
}

export { FORMAT_LABELS, LANGUAGE_LABELS };
