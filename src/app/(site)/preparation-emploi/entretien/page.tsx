import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import {
  getConfidenceWork,
  listChecklistStates,
  listInterviewAnswers,
  listStarExamples,
} from '@/lib/db/repository';
import { interviewQuestions } from '@/content/interview-questions';
import { checklists } from '@/content/checklists';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { InterviewWorkspace } from '@/components/jobs/interview-workspace';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.interview.metaTitle, description: t.interview.intro };
}

export default async function InterviewPage() {
  const t = await getDictionary();
  const session = await getSession();

  const [answers, states, stars, confidence] = session
    ? await Promise.all([
        listInterviewAnswers(session.userId),
        listChecklistStates(session.userId),
        listStarExamples(session.userId),
        getConfidenceWork(session.userId),
      ])
    : [[], [], [], null];

  return (
    <PageShell width="wide">
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/preparation-emploi', label: t.center.title },
          { label: t.interview.title },
        ]}
      />

      <PageHeader title={t.interview.title} description={t.interview.intro} />

      <InterviewWorkspace
        t={t}
        questions={interviewQuestions}
        answers={Object.fromEntries(answers.map((answer) => [answer.questionId, answer.body]))}
        checklists={checklists.filter((checklist) =>
          [
            'chk-interview-preparation',
            'chk-cv-mastery',
            'chk-employer-research',
            'chk-interview-logistics',
            'chk-questions-to-ask',
          ].includes(checklist.id),
        )}
        checklistStates={Object.fromEntries(
          states.map((state) => [state.checklistId, state.doneItemIds]),
        )}
        starExamples={stars}
        confidence={confidence}
        isSignedIn={Boolean(session)}
      />
    </PageShell>
  );
}
