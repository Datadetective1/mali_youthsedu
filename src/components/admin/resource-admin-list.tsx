'use client';

import { useState, useTransition } from 'react';
import { ExternalLink, Loader2, RotateCcw, Save } from 'lucide-react';
import type { LearningResource, VerificationStatus } from '@/lib/types';
import { Badge, Card, CardBody, Disclosure, Notice } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { SelectField, TextAreaField } from '@/components/ui/form';
import { resetOverrideAction, saveResourceOverrideAction } from '@/app/actions/admin';

export function ResourceAdminList({
  resources,
  labels,
}: {
  resources: LearningResource[];
  labels: Record<string, string>;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<VerificationStatus | ''>('');

  const filtered = resources.filter((resource) => {
    if (filter && resource.verification !== filter) return false;
    if (!query) return true;
    const needle = query.toLowerCase();
    return (
      resource.title.toLowerCase().includes(needle) ||
      resource.provider.toLowerCase().includes(needle)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher…"
          aria-label="Rechercher une ressource"
          className="min-h-12 flex-1 rounded-lg border-2 border-sand-300 bg-white px-3 text-base focus:border-brand-600 focus:outline-none"
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as VerificationStatus | '')}
          aria-label={labels.verification}
          className="min-h-12 rounded-lg border-2 border-sand-300 bg-white px-3 text-base focus:border-brand-600 focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="verified">{labels.statusVerified}</option>
          <option value="pending">{labels.statusPending}</option>
          <option value="broken">{labels.statusBroken}</option>
        </select>
      </div>

      <p className="text-sm text-sand-600">{filtered.length} ressource(s)</p>

      <ul className="space-y-2">
        {filtered.map((resource) => (
          <li key={resource.id}>
            <ResourceRow resource={resource} labels={labels} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResourceRow({
  resource,
  labels,
}: {
  resource: LearningResource;
  labels: Record<string, string>;
}) {
  const [verification, setVerification] = useState<VerificationStatus>(resource.verification);
  const [notes, setNotes] = useState(resource.qualityNotes);
  const [archived, setArchived] = useState(Boolean(resource.archived));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save(overrides: { archived?: boolean } = {}) {
    setError(null);
    startTransition(async () => {
      const result = await saveResourceOverrideAction({
        resourceId: resource.id,
        verification,
        qualityNotes: notes,
        archived: overrides.archived ?? archived,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(labels.updated ?? '');
      setTimeout(() => setMessage(null), 2500);
    });
  }

  return (
    <Card>
      <CardBody className="p-3 sm:p-4">
        <Disclosure
          className="border-0"
          summary={
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{resource.title}</span>
              <span className="text-sm text-sand-500">{resource.provider}</span>
              <Badge
                tone={
                  verification === 'verified'
                    ? 'success'
                    : verification === 'broken'
                      ? 'danger'
                      : 'warning'
                }
              >
                {verification === 'verified'
                  ? labels.statusVerified
                  : verification === 'broken'
                    ? labels.statusBroken
                    : labels.statusPending}
              </Badge>
              {archived ? <Badge tone="neutral">{labels.archived}</Badge> : null}
            </span>
          }
        >
          <div className="space-y-4">
            <p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 text-sm text-brand-700 underline underline-offset-2"
              >
                {resource.url}
                <ExternalLink aria-hidden className="size-3.5" />
              </a>
            </p>

            {resource.lastReviewed ? (
              <p className="text-sm text-sand-600">
                {labels.lastReviewed} : {resource.lastReviewed}
              </p>
            ) : null}

            {error ? (
              <Notice tone="danger" role="alert">
                {error}
              </Notice>
            ) : null}
            {message ? (
              <Notice tone="success" role="status">
                {message}
              </Notice>
            ) : null}

            <SelectField
              label={labels.verification ?? ''}
              value={verification}
              onChange={(event) => setVerification(event.target.value as VerificationStatus)}
              options={[
                { value: 'pending', label: labels.statusPending ?? '' },
                { value: 'verified', label: labels.statusVerified ?? '' },
                { value: 'broken', label: labels.statusBroken ?? '' },
              ]}
            />

            <TextAreaField
              label={labels.qualityNotes ?? ''}
              rows={3}
              maxLength={2000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => save()} disabled={pending}>
                {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
                {pending ? labels.saving : labels.save}
              </Button>

              <Button
                size="sm"
                variant="quiet"
                disabled={pending}
                onClick={() => {
                  const next = !archived;
                  setArchived(next);
                  save({ archived: next });
                }}
              >
                {archived ? labels.unarchive : labels.archive}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await resetOverrideAction('resource', resource.id);
                    setVerification('pending');
                    setArchived(false);
                  })
                }
              >
                <RotateCcw aria-hidden />
                {labels.reset}
              </Button>
            </div>
          </div>
        </Disclosure>
      </CardBody>
    </Card>
  );
}
