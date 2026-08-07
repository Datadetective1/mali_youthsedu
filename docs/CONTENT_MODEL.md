# Content model

## Where content lives

Curriculum content is authored as typed TypeScript in `src/content/`. It is the
single source of truth; the database holds a seeded copy plus an admin overlay
([ADR-003](DECISIONS.md)).

| File | Contents | Volume |
| --- | --- | --- |
| `sectors.ts` | Employment sectors and their detection keywords | 10 |
| `skills.ts` | Skill vocabulary across the four recruitment dimensions | 62 |
| `paths/` | Career pathways, one file each | 8 (45 stages, 229 tasks) |
| `resources.ts` | Curated external resources | 48 |
| `projects.ts` | Practical portfolio projects | 16 |
| `interview-questions.ts` | Interview questions with coaching | 40 |
| `job-examples.ts` | Fictional job adverts for the analyzer | 5 |
| `checklists.ts` | Persisted checklists | 6 |
| `templates.ts` | Message templates | 7 |

`src/content/content.test.ts` enforces referential integrity, volume floors and
the honesty rules below. A broken cross-reference fails the build rather than a
user's page.

---

## The link-verification rule

**`verification: 'verified'` may only be set by a person who has actually
opened the link and checked the content.**

Seeded resources ship as `'pending'` with `lastReviewed: null`, and the UI
labels them « À vérifier avant publication ». A test asserts no seeded resource
claims verification, and a database constraint forbids `verified` without a
review date.

This is not bureaucracy. A user on a 500 MB monthly bundle spends real money
opening a link. Telling them we checked it when we did not is a lie with a
price attached.

To verify a batch:

```bash
npm run content:check          # lists every pending link with its URL
```

Then, for each one, open it and confirm it is reachable, free (or that the
`cost` field says otherwise), roughly as described, and in the stated language.
Mark it through `/admin/ressources`, which stamps `lastReviewed` automatically —
that is why the admin path is preferred over editing the file.

If a link is dead, set `broken` rather than deleting it: the id may be
referenced by a stage, and the archive is the record of what was tried.

---

## Authoring a pathway

Pathways are built with `buildPath()`, which derives stage and item ids from
the slug so they cannot collide and a reordering is a visible change:

```ts
export const monParcours = buildPath({
  slug: 'mon-parcours',
  name: 'Nom du parcours',
  summary: 'Une phrase.',
  description: 'Un paragraphe : à qui cela s’adresse et pourquoi.',
  audience: ['Vous êtes…'],
  outcomes: ['À la fin, vous saurez…'],
  prerequisites: [],
  sectorIds: ['commerce'],
  skillIds: ['vente-techniques'],
  level: 'debutant',
  featured: false,
  order: 9,
  icon: 'Handshake',
  projectIds: ['proj-…'],
  stages: [ /* 4 to 8 */ ],
});
```

Every stage must have an objective, at least three items, a practical exercise
with a deliverable, a checklist, a reflection question and an evidence output.
The tests enforce it.

**The evidence output is the point.** Each stage produces something the person
can show an employer. A stage that ends in "you now understand X" and nothing
showable is not finished.

### Regulated sectors

A pathway whose primary sector is regulated must carry a `caution`. The mining
support pathway states plainly that it does not prepare anyone for regulated
roles and that diplomas, certification and safety training come from accredited
bodies. `npm run content:check` fails if that warning goes missing.

The check deliberately looks at the *primary* sector only. The English pathway
teaches mining vocabulary but does not claim to prepare anyone for a mining
role; a warning there would be noise that trains people to ignore the notice
where it matters.

---

## Authoring a resource

```ts
defineResource({
  id: 'res-provider-topic',
  title: 'Titre exact',
  provider: 'Nom du fournisseur',
  url: 'https://…',                 // https only, enforced by test
  description: 'Ce que c’est, en une ou deux phrases.',
  language: 'fr',
  skillIds: ['tableur'],
  sectorIds: ['administration'],
  format: 'cours',
  level: 'debutant',
  minutes: 240,
  connectivity: 'low',              // offline | low | medium | high
  mobileFriendly: true,
  offlineCapable: false,
  cost: 'gratuit',
  certificate: false,
  qualityNotes: 'Ce qu’il faut savoir avant de cliquer.',
});
```

`connectivity` and `cost` are as prominent as the title in the UI. Someone
budgeting data needs to know a link is a video course *before* tapping it, and
`freemium` must be labelled so nobody discovers a paywall after investing time.

`qualityNotes` is where honesty lives: say when content is aimed at another
country, when a certificate is paid, when a provider has an interest in
overselling, or when something needs a computer rather than a phone.

---

## Skill keywords drive the analyzer

`skills[].keywords` is the vocabulary the job-description analyzer matches
against. Keywords must be lowercase and accent-free — a test enforces both,
because incoming text is normalised the same way.

Adding a keyword immediately improves extraction with no code change and no
deployment risk. This is the intended way to improve the analyzer.

Matching tolerates French plurals and the feminine ending, so `commercial`
matches *commerciale* and *commerciaux*. Keep keywords specific enough not to
fire spuriously: `crm` is fine, a bare `sap` would not be.

---

## Simulated projects

A project with `simulated: true` is a teaching exercise. The UI labels it, and
its `portfolioDescription` must say so, because presenting an exercise as paid
client work is the kind of lie that collapses in one reference call. A test
enforces the wording.

---

## Job examples are fictional

Every advert in `job-examples.ts` is invented, says so in its own text, and is
labelled in the UI. Fabricating a real opening would be both dishonest and
cruel to someone job-hunting. A test asserts each contains the word.

---

## Tone

- Vouvoiement throughout.
- Clear French, never academic. If a sentence would not survive being read aloud to a 17-year-old, rewrite it.
- Never machine-translated. Proper accents and typographic apostrophes (`’`).
- Concrete over abstract: "aucun écart de caisse sur six mois", not "rigoureux".
- Never promise outcomes. Prepare, explain, and be honest about what is not known.
