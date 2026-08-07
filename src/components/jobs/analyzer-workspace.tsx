'use client';

import { useState, useTransition } from 'react';
import { Loader2, Search } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { JobComparison, JobExtraction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { TextAreaField, TextField } from '@/components/ui/form';
import { Card, CardBody, Notice } from '@/components/ui';
import { AiDisclosure } from './ai-disclosure';
import { AnalysisResult } from './analysis-result';
import { analyzeJobAction } from '@/app/actions/jobs';

interface Example {
  id: string;
  label: string;
  text: string;
  title: string;
  company: string;
}

export function AnalyzerWorkspace({
  t,
  examples,
  aiAvailable,
  isSignedIn,
}: {
  t: Dictionary;
  examples: Example[];
  aiAvailable: boolean;
  isSignedIn: boolean;
}) {
  const [text, setText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [useAi, setUseAi] = useState(false);
  const [usedExample, setUsedExample] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    extraction: JobExtraction;
    comparison: JobComparison | null;
    aiNotice: string | null;
    hasProfile: boolean;
    id: string | null;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  function run() {
    setError(null);
    startTransition(async () => {
      const response = await analyzeJobAction({ text, jobTitle, company, useAi });
      if (!response.ok) {
        setError(response.error);
        setResult(null);
        return;
      }
      setResult({
        extraction: response.data.extraction,
        comparison: response.data.comparison,
        aiNotice: response.data.aiNotice,
        hasProfile: response.data.hasProfile,
        id: response.data.id,
      });
      // Bring the result into view for someone using a screen reader or a
      // small screen where the form fills the viewport.
      requestAnimationFrame(() => {
        document.getElementById('resultat-analyse')?.scrollIntoView({ block: 'start' });
      });
    });
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardBody className="space-y-4">
          <TextAreaField
            label={t.analyzer.pasteLabel}
            hint={t.analyzer.pasteHint}
            placeholder={t.analyzer.pastePlaceholder}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setUsedExample(false);
            }}
            rows={10}
            maxLength={20000}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label={t.analyzer.titleLabel}
              hint={t.analyzer.titleHint}
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              maxLength={200}
              optional
            />
            <TextField
              label={t.analyzer.companyLabel}
              hint={t.analyzer.companyHint}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              maxLength={200}
              optional
            />
          </div>

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

          <Button size="lg" onClick={run} disabled={pending || text.trim().length === 0}>
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Search aria-hidden />}
            {pending ? t.analyzer.analyzing : t.analyzer.analyzeAction}
          </Button>
        </CardBody>
      </Card>

      {/* ------------------------------------------------------------ Examples */}
      <section aria-labelledby="exemples-offres">
        <h2 id="exemples-offres" className="text-lg font-bold">
          {t.analyzer.examplesTitle}
        </h2>
        <p className="mt-1 text-sm text-sand-600">{t.analyzer.examplesIntro}</p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {examples.map((example) => (
            <li key={example.id}>
              <Button
                size="sm"
                variant="quiet"
                onClick={() => {
                  setText(example.text);
                  setJobTitle(example.title);
                  setCompany(example.company);
                  setUsedExample(true);
                  setResult(null);
                }}
              >
                {example.label}
              </Button>
            </li>
          ))}
        </ul>

        {usedExample ? (
          <Notice tone="warning" className="mt-3">
            {t.analyzer.exampleNotice}
          </Notice>
        ) : null}
      </section>

      {/* -------------------------------------------------------------- Result */}
      {result ? (
        <div id="resultat-analyse">
          {result.aiNotice ? (
            <Notice tone="info" className="mb-4" role="status">
              {result.aiNotice}
            </Notice>
          ) : null}

          <AnalysisResult
            t={t}
            extraction={result.extraction}
            comparison={result.comparison}
            hasProfile={result.hasProfile}
            analysisId={result.id}
            isSignedIn={isSignedIn}
          />
        </div>
      ) : null}
    </div>
  );
}
