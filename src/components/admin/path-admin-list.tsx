'use client';

import { useState, useTransition } from 'react';
import { Loader2, RotateCcw, Save } from 'lucide-react';
import { Badge, Card, CardBody, Disclosure, Notice } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { CheckboxRow, TextAreaField, TextField } from '@/components/ui/form';
import { resetOverrideAction, savePathOverrideAction } from '@/app/actions/admin';

interface PathRow {
  id: string;
  name: string;
  summary: string;
  description: string;
  featured: boolean;
  published: boolean;
  stageCount: number;
}

export function PathAdminList({
  paths,
  labels,
}: {
  paths: PathRow[];
  labels: Record<string, string>;
}) {
  return (
    <ul className="space-y-2">
      {paths.map((path) => (
        <li key={path.id}>
          <PathEditor path={path} labels={labels} />
        </li>
      ))}
    </ul>
  );
}

function PathEditor({ path, labels }: { path: PathRow; labels: Record<string, string> }) {
  const [draft, setDraft] = useState(path);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, startTransition] = useTransition();

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await savePathOverrideAction({
        pathId: path.id,
        name: draft.name,
        summary: draft.summary,
        description: draft.description,
        featured: draft.featured,
        published: draft.published,
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
              <span className="font-medium">{draft.name}</span>
              <Badge tone="neutral">
                {path.stageCount} {labels.stages}
              </Badge>
              {draft.featured ? <Badge tone="accent">{labels.featured}</Badge> : null}
              {!draft.published ? <Badge tone="warning">Brouillon</Badge> : null}
            </span>
          }
        >
          <div className="space-y-4">
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

            <TextField
              label={labels.name ?? ''}
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              maxLength={200}
            />
            <TextAreaField
              label={labels.summary ?? ''}
              rows={2}
              maxLength={500}
              value={draft.summary}
              onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
            />
            <TextAreaField
              label={labels.description ?? ''}
              rows={5}
              maxLength={3000}
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            />

            <CheckboxRow
              label={labels.featured ?? ''}
              hint={labels.featuredHint}
              checked={draft.featured}
              onChange={(checked) => setDraft({ ...draft, featured: checked })}
            />
            <CheckboxRow
              label={labels.published ?? ''}
              checked={draft.published}
              onChange={(checked) => setDraft({ ...draft, published: checked })}
            />

            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={save} disabled={pending}>
                {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
                {pending ? labels.saving : labels.save}
              </Button>

              {confirmReset ? (
                <>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await resetOverrideAction('path', path.id);
                        setDraft(path);
                        setConfirmReset(false);
                      })
                    }
                  >
                    {labels.reset}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                    Annuler
                  </Button>
                  <p className="w-full text-sm text-sand-600">{labels.resetConfirm}</p>
                </>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setConfirmReset(true)}>
                  <RotateCcw aria-hidden />
                  {labels.reset}
                </Button>
              )}
            </div>
          </div>
        </Disclosure>
      </CardBody>
    </Card>
  );
}
