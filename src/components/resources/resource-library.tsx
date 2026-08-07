'use client';

import { useMemo, useState, useTransition } from 'react';
import { BookmarkCheck, BookmarkPlus, Search, SlidersHorizontal } from 'lucide-react';
import type { LearningResource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { EmptyState, Notice } from '@/components/ui';
import { ResourceCard } from './resource-card';
import { toggleResourceAction } from '@/app/actions/learning';
import { normalizeText } from '@/lib/utils';
import { plural, type PluralMessage } from '@/lib/i18n/format';

export interface LibraryLabels {
  searchPlaceholder: string;
  filters: string;
  reset: string;
  countTemplate: PluralMessage;
  noResults: string;
  noResultsHint: string;
  save: string;
  saved: string;
  filterLanguage: string;
  filterFormat: string;
  filterLevel: string;
  filterConnectivity: string;
  filterCost: string;
  filterAll: string;
  guestNotice: string;
  verificationHelp: string;
}

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'multi', label: 'Plusieurs langues' },
];
const FORMATS = [
  { value: 'cours', label: 'Cours' },
  { value: 'guide', label: 'Guide' },
  { value: 'article', label: 'Article' },
  { value: 'exercice', label: 'Exercice' },
  { value: 'video', label: 'Vidéo' },
  { value: 'podcast', label: 'Audio' },
  { value: 'outil', label: 'Outil' },
  { value: 'modele', label: 'Modèle' },
];
const LEVELS = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
];
const CONNECTIVITY = [
  { value: 'offline', label: 'Hors ligne' },
  { value: 'low', label: 'Peu de données' },
  { value: 'medium', label: 'Connexion normale' },
  { value: 'high', label: 'Beaucoup de données' },
];
const COSTS = [
  { value: 'gratuit', label: 'Gratuit' },
  { value: 'freemium', label: 'Gratuit puis payant' },
];

/**
 * Filterable resource library.
 *
 * Filtering happens client-side over the full catalogue: it is a few dozen
 * records, so a round trip per keystroke would cost data for no benefit.
 */
export function ResourceLibrary({
  resources,
  savedIds,
  isSignedIn,
  labels,
}: {
  resources: LearningResource[];
  savedIds: string[];
  isSignedIn: boolean;
  labels: LibraryLabels;
}) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [format, setFormat] = useState('');
  const [level, setLevel] = useState('');
  const [connectivity, setConnectivity] = useState('');
  const [cost, setCost] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState(() => new Set(savedIds));
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = normalizeText(query);
    return resources.filter((resource) => {
      if (language && resource.language !== language) return false;
      if (format && resource.format !== format) return false;
      if (level && resource.level !== level) return false;
      if (connectivity && resource.connectivity !== connectivity) return false;
      if (cost && resource.cost !== cost) return false;
      if (!needle) return true;

      const haystack = normalizeText(
        `${resource.title} ${resource.provider} ${resource.description} ${resource.qualityNotes}`,
      );
      return haystack.includes(needle);
    });
  }, [resources, query, language, format, level, connectivity, cost]);

  const hasFilters = Boolean(language || format || level || connectivity || cost || query);

  function toggle(resourceId: string) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(resourceId)) next.delete(resourceId);
      else next.add(resourceId);
      return next;
    });
    startTransition(() => void toggleResourceAction(resourceId));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-sand-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchPlaceholder}
            className="min-h-12 w-full rounded-lg border-2 border-sand-300 bg-white py-2 pl-11 pr-3 text-base focus:border-brand-600 focus:outline-none"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters((value) => !value)}
          aria-expanded={showFilters}
          aria-controls="filtres-ressources"
        >
          <SlidersHorizontal aria-hidden />
          {labels.filters}
        </Button>
      </div>

      {showFilters ? (
        <div
          id="filtres-ressources"
          className="grid gap-3 rounded-[--radius-card] border border-sand-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <FilterSelect
            label={labels.filterLanguage}
            value={language}
            onChange={setLanguage}
            options={LANGUAGES}
            allLabel={labels.filterAll}
          />
          <FilterSelect
            label={labels.filterFormat}
            value={format}
            onChange={setFormat}
            options={FORMATS}
            allLabel={labels.filterAll}
          />
          <FilterSelect
            label={labels.filterLevel}
            value={level}
            onChange={setLevel}
            options={LEVELS}
            allLabel={labels.filterAll}
          />
          <FilterSelect
            label={labels.filterConnectivity}
            value={connectivity}
            onChange={setConnectivity}
            options={CONNECTIVITY}
            allLabel={labels.filterAll}
          />
          <FilterSelect
            label={labels.filterCost}
            value={cost}
            onChange={setCost}
            options={COSTS}
            allLabel={labels.filterAll}
          />
          {hasFilters ? (
            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setQuery('');
                  setLanguage('');
                  setFormat('');
                  setLevel('');
                  setConnectivity('');
                  setCost('');
                }}
              >
                {labels.reset}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <Notice tone="warning">{labels.verificationHelp}</Notice>
      {!isSignedIn ? <Notice tone="info">{labels.guestNotice}</Notice> : null}

      <p role="status" className="text-sm text-sand-600">
        {plural(labels.countTemplate, filtered.length)}
      </p>

      {filtered.length === 0 ? (
        <EmptyState title={labels.noResults} description={labels.noResultsHint} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <li key={resource.id}>
              <ResourceCard
                resource={resource}
                action={
                  isSignedIn ? (
                    <Button
                      size="sm"
                      variant={saved.has(resource.id) ? 'quiet' : 'secondary'}
                      onClick={() => toggle(resource.id)}
                    >
                      {saved.has(resource.id) ? (
                        <>
                          <BookmarkCheck aria-hidden />
                          {labels.saved}
                        </>
                      ) : (
                        <>
                          <BookmarkPlus aria-hidden />
                          {labels.save}
                        </>
                      )}
                    </Button>
                  ) : null
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-sand-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-lg border-2 border-sand-300 bg-white px-3 py-2 text-base focus:border-brand-600 focus:outline-none"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
