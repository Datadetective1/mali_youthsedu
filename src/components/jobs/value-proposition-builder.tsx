'use client';

import { useState, useTransition } from 'react';
import { Copy, Loader2, Sparkles } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { ValuePropositionInput, ValuePropositionOutput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { TextAreaField, TextField } from '@/components/ui/form';
import { Card, CardBody, EmptyState, Notice, Section } from '@/components/ui';
import { AiDisclosure } from './ai-disclosure';
import { buildValuePropositionAction } from '@/app/actions/jobs';

const EMPTY: ValuePropositionInput = {
  problem: '',
  skills: '',
  results: '',
  proof: '',
  approach: '',
  motivation: '',
  targetRole: '',
};

export function ValuePropositionBuilder({
  t,
  initialInput,
  initialOutput,
  aiAvailable,
  isSignedIn,
}: {
  t: Dictionary;
  initialInput: ValuePropositionInput | null;
  initialOutput: ValuePropositionOutput | null;
  aiAvailable: boolean;
  isSignedIn: boolean;
}) {
  const v = t.valueProp;
  const [input, setInput] = useState<ValuePropositionInput>(initialInput ?? EMPTY);
  const [output, setOutput] = useState<ValuePropositionOutput | null>(initialOutput);
  const [useAi, setUseAi] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof ValuePropositionInput>(key: K, value: string) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    setError(null);
    startTransition(async () => {
      const result = await buildValuePropositionAction({ ...input, useAi });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOutput(result.data.output);
      setNotice(result.data.aiNotice);
    });
  }

  const fields: { key: keyof ValuePropositionInput; label: string; hint: string; rows?: number }[] = [
    { key: 'problem', label: v.q.problem, hint: v.q.problemHint, rows: 3 },
    { key: 'skills', label: v.q.skills, hint: v.q.skillsHint, rows: 2 },
    { key: 'results', label: v.q.results, hint: v.q.resultsHint, rows: 3 },
    { key: 'proof', label: v.q.proof, hint: v.q.proofHint, rows: 3 },
    { key: 'approach', label: v.q.approach, hint: v.q.approachHint, rows: 2 },
    { key: 'motivation', label: v.q.motivation, hint: v.q.motivationHint, rows: 3 },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        {/* The honesty promise sits above the form, not below the output —
            people need to know the rules before they start writing. */}
        <Notice tone="info">{v.honestyNotice}</Notice>

        {fields.map((field) => (
          <TextAreaField
            key={field.key}
            label={field.label}
            hint={field.hint}
            rows={field.rows ?? 3}
            maxLength={2000}
            value={input[field.key] ?? ''}
            onChange={(event) => update(field.key, event.target.value)}
          />
        ))}

        <TextField
          label={v.q.targetRole}
          hint={v.q.targetRoleHint}
          optional
          maxLength={200}
          value={input.targetRole ?? ''}
          onChange={(event) => update('targetRole', event.target.value)}
        />

        <AiDisclosure
          available={aiAvailable}
          enabled={useAi}
          onChange={setUseAi}
          labels={{
            optIn: t.ai.aiOptIn,
            deterministic: t.ai.disclosureDeterministic,
            ai: t.ai.disclosureAi,
            neverInvents: t.ai.neverInvents,
            unavailable: t.ai.aiUnavailable,
          }}
        />

        {error ? (
          <Notice tone="danger" role="alert">
            {error}
          </Notice>
        ) : null}

        <Button size="lg" onClick={generate} disabled={pending}>
          {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Sparkles aria-hidden />}
          {pending ? v.generating : output ? v.regenerateAction : v.generateAction}
        </Button>

        {!isSignedIn ? <Notice tone="info">{t.recommendation.guestSaveNotice}</Notice> : null}
      </div>

      <div>
        {notice ? (
          <Notice tone="info" className="mb-4" role="status">
            {notice}
          </Notice>
        ) : null}

        {!output ? (
          <EmptyState title={v.emptyTitle} description={v.emptyBody} />
        ) : (
          <Section title={v.outputs.title} description={v.outputs.intro}>
            <OutputBlock title={v.outputs.pitch} hint={v.outputs.pitchHint} text={output.pitch} copy={t.actions.copy} copied={t.actions.copied} />
            <OutputBlock title={v.outputs.cvSummary} hint={v.outputs.cvSummaryHint} text={output.cvSummary} copy={t.actions.copy} copied={t.actions.copied} />
            <OutputBlock title={v.outputs.tellMeAboutYou} hint={v.outputs.tellMeAboutYouHint} text={output.tellMeAboutYou} copy={t.actions.copy} copied={t.actions.copied} />
            <OutputBlock title={v.outputs.whyHireYou} hint={v.outputs.whyHireYouHint} text={output.whyHireYou} copy={t.actions.copy} copied={t.actions.copied} />
            <OutputBlock title={v.outputs.roleStatement} text={output.roleStatement} copy={t.actions.copy} copied={t.actions.copied} />
            <p className="text-sm text-sand-500">{v.outputs.editable}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function OutputBlock({
  title,
  hint,
  text,
  copy,
  copied: copiedLabel,
}: {
  title: string;
  hint?: string;
  text: string;
  copy: string;
  copied: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Card>
      <CardBody>
        <h3 className="font-semibold">{title}</h3>
        {hint ? <p className="mt-0.5 text-sm text-sand-500">{hint}</p> : null}
        <p className="mt-3 whitespace-pre-line rounded-lg bg-sand-50 p-3 text-sand-800">{text}</p>
        <Button
          size="sm"
          variant="ghost"
          className="mt-2"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              // Clipboard unavailable; the text stays selectable on screen.
            }
          }}
        >
          <Copy aria-hidden />
          {copied ? copiedLabel : copy}
        </Button>
      </CardBody>
    </Card>
  );
}
