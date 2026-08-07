# Product vision

## Mission

Help young people in Mali — regardless of location, income, education level or
background — acquire practical skills, prepare for employment, build
confidence, find opportunities and create sustainable livelihoods.

## Core belief

> Le talent est universel. Les opportunités ne le sont pas.

## North star

Every young person in Mali should be able to discover a suitable path, acquire
valuable skills, demonstrate their abilities, access meaningful opportunities,
and contribute back to their community.

## The problem

The constraint is not talent. It is access, structure, preparation, evidence
and connection:

- Orientation is unclear; there are few reliable signals about which trades to aim for.
- Preparation is thin; applications fail for avoidable reasons.
- Experience is demanded but not offered, so first-time candidates cannot start.
- Existing platforms assume a permanent, affordable internet connection.

## What HR told us, and what we built because of it

The direction was validated with an HR director who has recruited across
several sectors, including banking and fuel distribution. Her findings are not
background reading — each one has a corresponding feature.

### Where demand is

Commercial and sales profiles, mining-related profiles, the support functions
around mining and industry, and candidates with leadership potential.

→ Three of the eight pathways target these directly: **Commercial et vente**,
**Métiers support du secteur minier**, and **Anglais pour l'emploi** (the
language requirement that repeatedly blocks otherwise-suitable candidates).

### Why candidates fail

Rarely capability. Usually: low confidence and self-esteem, insufficient
interview preparation, poor mastery of their own CV, no research on the
employer, no understanding of the role's responsibilities, no comparison of
their profile against the requirements, unidentified gaps, an inability to
articulate their value, and difficulty thinking through an unfamiliar problem.

→ The Job Readiness Center exists module-for-module against that list. The CV
workspace deliberately does **not** generate a CV — it collects the material
and drills the three questions that make each line defensible, because a
one-click CV the candidate cannot explain is worse than none.

### The three dimensions recruiters assess

1. **Savoir-faire** — technical and practical ability
2. **Savoir-être** — conduct, attitude, reliability, confidence, teamwork
3. **Capacité de réflexion** — critical thinking, initiative, adaptability, creativity

We added a fourth:

4. **Savoir communiquer** — written and spoken communication, French, English, presentation, active listening

→ Every one of the 62 skills is tagged with its dimension, and the landing page
explains all four, because most candidates only prepare the first.

### The six questions before applying

What is the employer really looking for? Which requirements do I already meet?
Where are my gaps? How do I address or explain them? What specific value can I
bring? How should I adapt my CV and my answers?

→ These are the literal structure of the job analyzer's output, and a saved,
editable form on every analysis.

## Principles

| Principle | What it forces |
| --- | --- |
| **Access first** | A feature that excludes rural or low-income users is badly designed. This produced the system font stack, the hand-written components, and the print-to-PDF decision. |
| **French first** | Natural French, never academic, never machine-translated. Bambara comes later and from native speakers. |
| **Mobile first** | Designed for an entry-level Android phone, not a laptop. 44px minimum targets, one question per onboarding screen. |
| **Offline friendly** | Offline is a feature, not a badge — and its caching policy is a privacy decision. |
| **Practice over theory** | Every stage produces evidence a person can show an employer. |
| **Curate, don't produce** | Excellent free resources exist. Our value is choosing, ordering and contextualising them — and being honest about which links we have actually checked. |
| **Measure outcomes** | Skills, projects, applications, interviews, jobs. Not screen time. |
| **Build with young people** | Feedback shapes the content; the contact form is a first-class feature. |
| **No manipulation** | No streaks, no leaderboards, no shame, no addictive loops. |

## Scope discipline

**In scope for the first release:** the seven-step journey from Découvrir to
Transmettre, for a single user working alone.

**Deliberately out of scope:** a native app, an employer marketplace, social
feeds, chat, public profiles, leaderboards, paid content, and any fabricated
partnership or job opportunity.

**Prepared for, not built:** mentors, employers, training organisations,
schools, NGOs and alumni. The schema and the roles model accommodate them; none
is implemented.

## What we refuse to do

- Guarantee employment, interviews or income. The readiness index measures preparation, never hiring odds, and says so wherever it appears.
- Claim to train for regulated mining roles. Pathways touching the sector carry an explicit warning about diplomas, certification and safety training.
- Invent experience. The value-proposition builder assembles text only from words the user typed, and a guard discards AI output that introduces a number or credential they never supplied.
- Mark a link verified that nobody opened.
- Sell data or profile youth. There is no per-user event stream to sell.
- Present self-reported outcomes as verified.

## How we will know it works

Not sign-ups. Not time on screen.

**Leading:** onboarding completion, first practical project completed, first
job analysis run, first interview answer written.

**Real:** applications sent, interviews obtained, jobs and income opportunities
obtained, businesses started, young people mentoring other young people.

The second group is self-reported and labelled as such. Verifying it properly
would require partnerships with employers and training organisations — a
legitimate future step, and dishonest to imply today.
