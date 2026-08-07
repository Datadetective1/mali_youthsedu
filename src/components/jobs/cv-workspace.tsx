'use client';

import { useState, useTransition } from 'react';
import { Loader2, Plus, Printer, Save, Trash2 } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { CvProfile, PracticalProject, UserProject } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { TextAreaField, TextField } from '@/components/ui/form';
import { BulletList, Card, CardBody, Notice, Section } from '@/components/ui';
import { saveCvAction } from '@/app/actions/jobs';

type Cv = Omit<CvProfile, 'id' | 'userId' | 'updatedAt'>;

const EMPTY_CV: Cv = {
  fullName: '',
  headline: '',
  summary: '',
  phone: '',
  city: '',
  experiences: [],
  education: [],
  languages: [],
  skills: [],
  tools: [],
  projects: [],
  extras: '',
};

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * CV workspace.
 *
 * Deliberately not a CV generator. It collects the material, prompts for the
 * concrete detail that makes a line defensible, and prints. A one-click
 * generated CV that the candidate cannot explain is worse than no CV — that
 * failure mode is one of the HR findings this whole product is built around.
 */
export function CvWorkspace({
  t,
  initial,
  completedProjects,
  isSignedIn,
}: {
  t: Dictionary;
  initial: CvProfile | null;
  completedProjects: { project: PracticalProject; entry: UserProject }[];
  isSignedIn: boolean;
}) {
  const c = t.cv;
  const [cv, setCv] = useState<Cv>(initial ?? EMPTY_CV);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof Cv>(key: K, value: Cv[K]) {
    setCv((current) => ({ ...current, [key]: value }));
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await saveCvAction(cv);
      if (!result.ok) {
        setError(result.error ?? null);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  function importProjects() {
    const descriptions = completedProjects.map(
      ({ project, entry }) =>
        `${project.title} — ${entry.work.trim() || project.portfolioDescription}`,
    );
    update('projects', [...new Set([...cv.projects, ...descriptions])]);
    setImported(descriptions.length);
  }

  return (
    <div className="space-y-6">
      <Notice tone="warning">{c.honestyNotice}</Notice>

      {error ? (
        <Notice tone="danger" role="alert">
          {error}
        </Notice>
      ) : null}

      {/* ------------------------------------------------------------ Identity */}
      <Card className="print-avoid-break">
        <CardBody className="space-y-4">
          <h2 className="font-bold">{c.sections.identity}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label={c.fields.fullName}
              value={cv.fullName}
              onChange={(event) => update('fullName', event.target.value)}
              maxLength={120}
            />
            <TextField
              label={c.fields.city}
              value={cv.city}
              onChange={(event) => update('city', event.target.value)}
              maxLength={120}
            />
            <TextField
              label={c.fields.phone}
              type="tel"
              inputMode="tel"
              value={cv.phone}
              onChange={(event) => update('phone', event.target.value)}
              maxLength={40}
            />
          </div>
        </CardBody>
      </Card>

      {/* ------------------------------------------------------------ Headline */}
      <Card className="print-avoid-break">
        <CardBody className="space-y-4">
          <h2 className="font-bold">{c.sections.headline}</h2>
          <TextField
            label={c.fields.headline}
            hint={c.fields.headlineHint}
            value={cv.headline}
            onChange={(event) => update('headline', event.target.value)}
            maxLength={200}
          />
          <TextAreaField
            label={c.fields.summary}
            hint={c.fields.summaryHint}
            rows={4}
            maxLength={2000}
            value={cv.summary}
            onChange={(event) => update('summary', event.target.value)}
          />
        </CardBody>
      </Card>

      {/* --------------------------------------------------------- Experiences */}
      <Card className="print-avoid-break">
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold">{c.sections.experience}</h2>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                update('experiences', [
                  ...cv.experiences,
                  { id: newId(), role: '', organisation: '', period: '', description: '' },
                ])
              }
            >
              <Plus aria-hidden />
              {c.addExperience}
            </Button>
          </div>

          {cv.experiences.length === 0 ? (
            <Notice tone="info" title={c.noExperienceTitle} className="mt-4">
              {c.noExperienceBody}
            </Notice>
          ) : null}

          <div className="mt-4 space-y-5">
            {cv.experiences.map((experience, index) => (
              <fieldset key={experience.id} className="rounded-lg border border-sand-200 p-3">
                <legend className="px-1 text-sm font-semibold text-sand-500">
                  {index + 1}
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    label={c.fields.role}
                    value={experience.role}
                    onChange={(event) =>
                      update(
                        'experiences',
                        cv.experiences.map((entry) =>
                          entry.id === experience.id ? { ...entry, role: event.target.value } : entry,
                        ),
                      )
                    }
                    maxLength={200}
                  />
                  <TextField
                    label={c.fields.organisation}
                    value={experience.organisation}
                    onChange={(event) =>
                      update(
                        'experiences',
                        cv.experiences.map((entry) =>
                          entry.id === experience.id
                            ? { ...entry, organisation: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    maxLength={200}
                  />
                  <TextField
                    label={c.fields.period}
                    value={experience.period}
                    onChange={(event) =>
                      update(
                        'experiences',
                        cv.experiences.map((entry) =>
                          entry.id === experience.id
                            ? { ...entry, period: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    maxLength={80}
                  />
                </div>
                <TextAreaField
                  className="mt-3"
                  label={c.fields.description}
                  hint={c.fields.descriptionHint}
                  rows={4}
                  maxLength={3000}
                  value={experience.description}
                  onChange={(event) =>
                    update(
                      'experiences',
                      cv.experiences.map((entry) =>
                        entry.id === experience.id
                          ? { ...entry, description: event.target.value }
                          : entry,
                      ),
                    )
                  }
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2"
                  onClick={() =>
                    update(
                      'experiences',
                      cv.experiences.filter((entry) => entry.id !== experience.id),
                    )
                  }
                >
                  <Trash2 aria-hidden />
                  {t.actions.remove}
                </Button>
              </fieldset>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* ---------------------------------------------------------- Education */}
      <Card className="print-avoid-break">
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold">{c.sections.education}</h2>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                update('education', [
                  ...cv.education,
                  { id: newId(), diploma: '', institution: '', year: '' },
                ])
              }
            >
              <Plus aria-hidden />
              {c.addEducation}
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {cv.education.map((entry) => (
              <div key={entry.id} className="grid gap-3 rounded-lg border border-sand-200 p-3 sm:grid-cols-3">
                <TextField
                  label={c.fields.diploma}
                  value={entry.diploma}
                  onChange={(event) =>
                    update(
                      'education',
                      cv.education.map((item) =>
                        item.id === entry.id ? { ...item, diploma: event.target.value } : item,
                      ),
                    )
                  }
                  maxLength={200}
                />
                <TextField
                  label={c.fields.institution}
                  value={entry.institution}
                  onChange={(event) =>
                    update(
                      'education',
                      cv.education.map((item) =>
                        item.id === entry.id ? { ...item, institution: event.target.value } : item,
                      ),
                    )
                  }
                  maxLength={200}
                />
                <TextField
                  label={c.fields.year}
                  value={entry.year}
                  onChange={(event) =>
                    update(
                      'education',
                      cv.education.map((item) =>
                        item.id === entry.id ? { ...item, year: event.target.value } : item,
                      ),
                    )
                  }
                  maxLength={20}
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* ------------------------------------------ Skills, tools, languages */}
      <Card className="print-avoid-break">
        <CardBody className="space-y-4">
          <h2 className="font-bold">{c.sections.skills}</h2>
          <ListField
            label={c.sections.skills}
            values={cv.skills}
            onChange={(values) => update('skills', values)}
            max={40}
          />
          <ListField
            label={c.sections.tools}
            values={cv.tools}
            onChange={(values) => update('tools', values)}
            max={40}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold">{c.sections.languages}</h3>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                update('languages', [...cv.languages, { id: newId(), name: '', level: '' }])
              }
            >
              <Plus aria-hidden />
              {c.addLanguage}
            </Button>
          </div>
          <div className="space-y-3">
            {cv.languages.map((entry) => (
              <div key={entry.id} className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label={c.fields.languageName}
                  value={entry.name}
                  onChange={(event) =>
                    update(
                      'languages',
                      cv.languages.map((item) =>
                        item.id === entry.id ? { ...item, name: event.target.value } : item,
                      ),
                    )
                  }
                  maxLength={80}
                />
                <TextField
                  label={c.fields.languageLevel}
                  value={entry.level}
                  onChange={(event) =>
                    update(
                      'languages',
                      cv.languages.map((item) =>
                        item.id === entry.id ? { ...item, level: event.target.value } : item,
                      ),
                    )
                  }
                  maxLength={80}
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* ----------------------------------------------------------- Projects */}
      <Card className="print-avoid-break">
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold">{c.sections.projects}</h2>
            {completedProjects.length > 0 ? (
              <Button size="sm" variant="secondary" onClick={importProjects}>
                {c.importProjects}
              </Button>
            ) : null}
          </div>

          {imported !== null ? (
            <Notice tone="success" className="mt-3" role="status">
              {c.importedProjects(imported)}
            </Notice>
          ) : null}

          <ListField
            className="mt-4"
            label={c.sections.projects}
            values={cv.projects}
            onChange={(values) => update('projects', values)}
            max={20}
            multiline
          />

          <TextAreaField
            className="mt-4"
            label={c.sections.extras}
            rows={3}
            maxLength={3000}
            value={cv.extras}
            onChange={(event) => update('extras', event.target.value)}
          />
        </CardBody>
      </Card>

      {/* ------------------------------------------------------------ Mastery */}
      <Section title={c.masteryTitle} description={c.masteryIntro}>
        <Card>
          <CardBody>
            <BulletList marker="decimal" items={c.masteryQuestions} />
          </CardBody>
        </Card>
      </Section>

      <div data-print="hide" className="flex flex-wrap items-center gap-3">
        {isSignedIn ? (
          <>
            <Button onClick={save} disabled={pending}>
              {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
              {pending ? t.actions.saving : t.actions.save}
            </Button>
            {saved ? (
              <span role="status" className="text-sm font-medium text-success-700">
                {t.actions.saved}
              </span>
            ) : null}
          </>
        ) : (
          <Notice tone="info">{t.recommendation.guestSaveNotice}</Notice>
        )}

        <Button variant="secondary" onClick={() => window.print()}>
          <Printer aria-hidden />
          {c.printCv}
        </Button>
      </div>

      <p data-print="hide" className="text-sm text-sand-500">
        {c.printHint}
      </p>
    </div>
  );
}

/** Comma-free list editor: one entry per line, which is far easier on mobile. */
function ListField({
  label,
  values,
  onChange,
  max,
  multiline = false,
  className,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  max: number;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <TextAreaField
      className={className}
      label={label}
      hint="Une entrée par ligne."
      rows={multiline ? 6 : 4}
      value={values.join('\n')}
      onChange={(event) =>
        onChange(
          event.target.value
            .split('\n')
            .map((entry) => entry.trim())
            .filter(Boolean)
            .slice(0, max),
        )
      }
    />
  );
}
