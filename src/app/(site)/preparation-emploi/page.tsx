import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  ClipboardCheck,
  FileText,
  Gauge,
  HeartHandshake,
  MessageSquare,
  MessagesSquare,
  Search,
  Sparkles,
} from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import {
  getCvProfile,
  getValueProposition,
  listAnalyses,
  listChecklistStates,
  listEmployerResearch,
  listInterviewAnswers,
  listStarExamples,
  listUserProjects,
} from '@/lib/db/repository';
import { jobReadinessProgress } from '@/lib/engine/progress';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Card, CardBody, Notice, ProgressBar, Section } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.center.metaTitle, description: t.center.intro };
}

export default async function JobReadinessPage() {
  const t = await getDictionary();
  const session = await getSession();

  const modules = [
    { key: 'analyzer', href: '/preparation-emploi/analyser', Icon: Search, ...t.center.modules.analyzer },
    { key: 'cv', href: '/preparation-emploi/cv', Icon: FileText, ...t.center.modules.cv },
    { key: 'value', href: '/preparation-emploi/valeur', Icon: Sparkles, ...t.center.modules.value },
    { key: 'interview', href: '/preparation-emploi/entretien', Icon: MessagesSquare, ...t.center.modules.interview },
    { key: 'employer', href: '/preparation-emploi/employeur', Icon: Building2, ...t.center.modules.employer },
    { key: 'gaps', href: '/preparation-emploi/ecarts', Icon: Gauge, ...t.center.modules.gaps },
    { key: 'communication', href: '/preparation-emploi/communication', Icon: MessageSquare, ...t.center.modules.communication },
    { key: 'confidence', href: '/preparation-emploi/entretien#confiance', Icon: HeartHandshake, ...t.center.modules.confidence },
    { key: 'checklist', href: '/preparation-emploi/checklist', Icon: ClipboardCheck, ...t.center.modules.checklist },
  ];

  let readiness: ReturnType<typeof jobReadinessProgress> | null = null;

  if (session) {
    const [cv, valueProp, analyses, answers, stars, checklists, employers, projects] =
      await Promise.all([
        getCvProfile(session.userId),
        getValueProposition(session.userId),
        listAnalyses(session.userId),
        listInterviewAnswers(session.userId),
        listStarExamples(session.userId),
        listChecklistStates(session.userId),
        listEmployerResearch(session.userId),
        listUserProjects(session.userId),
      ]);

    readiness = jobReadinessProgress({
      hasCv: Boolean(cv && cv.headline.trim().length > 0),
      cvLinesMastered: checklists.some(
        (state) => state.checklistId === 'chk-cv-mastery' && state.doneItemIds.length >= 6,
      ),
      analysesRun: analyses.length,
      hasValueProposition: Boolean(valueProp),
      interviewAnswersWritten: answers.length,
      starExamples: stars.length,
      employerResearchDone: employers.some((entry) => entry.notes.trim().length > 0),
      checklistsCompleted: checklists.filter((state) => state.doneItemIds.length > 0).length,
      projectsCompleted: projects.filter((project) => project.completedAt).length,
    });
  }

  return (
    <PageShell width="wide">
      <PageHeader title={t.center.title} description={t.center.intro} />

      {/* The single most important sentence on this page. */}
      <Notice tone="warning" className="mb-8">
        {t.center.disclaimer}
      </Notice>

      {readiness ? (
        <Card className="mb-8">
          <CardBody>
            <h2 className="font-bold">{t.center.progressTitle}</h2>
            <ProgressBar
              className="mt-3"
              value={readiness.components.filter((component) => component.done).length}
              total={readiness.components.length}
              label={t.center.progressTitle}
            />
            <p className="mt-2 text-sm text-sand-500">{t.center.progressHint}</p>

            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {readiness.components.map((component) => (
                <li key={component.key} className="flex items-start gap-2 text-sm">
                  <span
                    aria-hidden
                    className={
                      component.done
                        ? 'mt-1.5 size-2 shrink-0 rounded-full bg-success-600'
                        : 'mt-1.5 size-2 shrink-0 rounded-full bg-sand-300'
                    }
                  />
                  <span>
                    <span className={component.done ? 'text-sand-500' : 'font-medium text-sand-800'}>
                      {component.label}
                    </span>
                    <span className="block text-xs text-sand-500">{component.hint}</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      ) : (
        <Notice tone="info" className="mb-8">
          <p>{t.explore.guestNotice}</p>
          <ButtonLink href="/inscription" size="sm" className="mt-3">
            {t.auth.signUpAction}
          </ButtonLink>
        </Notice>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ key, href, Icon, title, summary }) => (
          <li key={key}>
            <Card className="h-full transition-shadow hover:shadow-[--shadow-raised]">
              <CardBody>
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700"
                >
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-3 font-semibold">
                  <Link href={href} className="hover:text-brand-800">
                    {title}
                  </Link>
                </h2>
                <p className="mt-1.5 text-sm text-sand-600">{summary}</p>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>

      <Section title={t.center.sixQuestionsTitle} className="mt-12">
        <ol className="grid gap-3 sm:grid-cols-2">
          {t.center.sixQuestions.map((entry, index) => (
            <li key={entry.q} className="rounded-[--radius-card] border border-sand-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-sand-400">
                {index + 1}
              </p>
              <p className="mt-1 font-semibold">{entry.q}</p>
              <p className="mt-1 text-sm text-sand-600">{entry.a}</p>
            </li>
          ))}
        </ol>
      </Section>
    </PageShell>
  );
}
