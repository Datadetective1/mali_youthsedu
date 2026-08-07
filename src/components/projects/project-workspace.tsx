'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { CheckCircle2, Copy, Loader2, Save } from 'lucide-react';
import type { PracticalProject, UserProject } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckboxRow, TextAreaField, TextField } from '@/components/ui/form';
import { Card, CardBody, Notice } from '@/components/ui';
import { saveProjectAction } from '@/app/actions/learning';

export interface ProjectWorkspaceLabels {
  myWork: string;
  myWorkPlaceholder: string;
  evidenceLink: string;
  evidenceLinkHint: string;
  reflectionLabel: string;
  evaluationChecklist: string;
  markDone: string;
  markDoneHint: string;
  done: string;
  save: string;
  saving: string;
  saved: string;
  portfolioDescription: string;
  portfolioDescriptionHint: string;
  copy: string;
  copied: string;
  addToPortfolio: string;
  inPortfolio: string;
  signInRequired: string;
}

/**
 * Where a project actually gets done.
 *
 * The "mark as complete" button stays disabled until every self-evaluation box
 * is ticked. That is not bureaucracy: the checklist is what turns "I did a
 * thing" into something the person can defend in an interview.
 */
export function ProjectWorkspace({
  project,
  initial,
  isSignedIn,
  labels,
}: {
  project: PracticalProject;
  initial: UserProject | null;
  isSignedIn: boolean;
  labels: ProjectWorkspaceLabels;
}) {
  const router = useRouter();
  const [work, setWork] = useState(initial?.work ?? '');
  const [evidenceUrl, setEvidenceUrl] = useState(initial?.evidenceUrl ?? '');
  const [reflection, setReflection] = useState(initial?.reflection ?? '');
  const [checked, setChecked] = useState<string[]>(initial?.checklistDone ?? []);
  const [inPortfolio, setInPortfolio] = useState(initial?.inPortfolio ?? false);
  const [completed, setCompleted] = useState(Boolean(initial?.completedAt));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const allChecked = checked.length === project.evaluationChecklist.length;

  if (!isSignedIn) {
    return <Notice tone="info">{labels.signInRequired}</Notice>;
  }

  function persist(patch: { completed?: boolean; inPortfolio?: boolean } = {}) {
    setError(null);
    startTransition(async () => {
      const result = await saveProjectAction({
        projectId: project.id,
        work,
        evidenceUrl,
        reflection,
        checklistDone: checked,
        ...patch,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(labels.saved);
      setTimeout(() => setMessage(null), 3000);
      router.refresh();
    });
  }

  function toggleCheck(index: number, value: boolean) {
    const key = String(index);
    setChecked((current) =>
      value ? [...new Set([...current, key])] : current.filter((entry) => entry !== key),
    );
  }

  return (
    <div className="space-y-5">
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

      <Card>
        <CardBody className="space-y-4">
          <TextAreaField
            label={labels.myWork}
            placeholder={labels.myWorkPlaceholder}
            value={work}
            onChange={(event) => setWork(event.target.value)}
            rows={7}
            maxLength={20000}
          />

          <TextField
            label={labels.evidenceLink}
            hint={labels.evidenceLinkHint}
            type="url"
            inputMode="url"
            optional
            value={evidenceUrl}
            onChange={(event) => setEvidenceUrl(event.target.value)}
            maxLength={500}
          />

          <TextAreaField
            label={labels.reflectionLabel}
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            rows={4}
            maxLength={10000}
          />

          <Button onClick={() => persist()} disabled={pending}>
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
            {pending ? labels.saving : labels.save}
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="font-semibold">{labels.evaluationChecklist}</h3>
          <div className="mt-2">
            {project.evaluationChecklist.map((item, index) => (
              <CheckboxRow
                key={index}
                label={item}
                checked={checked.includes(String(index))}
                onChange={(value) => toggleCheck(index, value)}
              />
            ))}
          </div>

          <div className="mt-4 border-t border-sand-200 pt-4">
            {completed ? (
              <p className="flex items-center gap-2 font-medium text-success-700">
                <CheckCircle2 aria-hidden className="size-5" />
                {labels.done}
              </p>
            ) : (
              <>
                <Button
                  variant="accent"
                  disabled={!allChecked || pending}
                  onClick={() => {
                    setCompleted(true);
                    persist({ completed: true });
                  }}
                >
                  {labels.markDone}
                </Button>
                {!allChecked ? (
                  <p className="mt-2 text-sm text-sand-500">{labels.markDoneHint}</p>
                ) : null}
              </>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="font-semibold">{labels.portfolioDescription}</h3>
          <p className="mt-1 text-sm text-sand-500">{labels.portfolioDescriptionHint}</p>
          <p className="mt-3 rounded-lg bg-sand-50 p-3 text-sm text-sand-700">
            {project.portfolioDescription}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(project.portfolioDescription);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  // Clipboard blocked (insecure context or permission denied);
                  // the text is on screen and selectable, so this is not fatal.
                }
              }}
            >
              <Copy aria-hidden />
              {copied ? labels.copied : labels.copy}
            </Button>

            <Button
              size="sm"
              variant={inPortfolio ? 'quiet' : 'secondary'}
              disabled={!completed || pending}
              onClick={() => {
                const next = !inPortfolio;
                setInPortfolio(next);
                persist({ inPortfolio: next });
              }}
            >
              {inPortfolio ? labels.inPortfolio : labels.addToPortfolio}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
