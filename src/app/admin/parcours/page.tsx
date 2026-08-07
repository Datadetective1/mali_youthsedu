import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { careerPaths } from '@/content/paths';
import { PageHeader } from '@/components/layout/page';
import { PathAdminList } from '@/components/admin/path-admin-list';

export const metadata: Metadata = { title: 'Parcours', robots: { index: false } };

export default async function AdminPathsPage() {
  const t = await getDictionary();

  return (
    <>
      <PageHeader title={t.admin.tabs.paths} description={t.admin.overlayNotice} />

      <PathAdminList
        paths={careerPaths.map((path) => ({
          id: path.id,
          name: path.name,
          summary: path.summary,
          description: path.description,
          featured: path.featured,
          published: path.published !== false,
          stageCount: path.stages.length,
        }))}
        labels={{
          name: t.admin.pathEditor.name,
          summary: t.admin.pathEditor.summary,
          description: t.admin.pathEditor.description,
          featured: t.admin.pathEditor.featured,
          featuredHint: t.admin.pathEditor.featuredHint,
          published: t.admin.pathEditor.published,
          updated: t.admin.pathEditor.updated,
          reset: t.admin.pathEditor.resetToDefault,
          resetConfirm: t.admin.pathEditor.resetConfirm,
          save: t.actions.save,
          saving: t.actions.saving,
          stages: t.admin.overview.stages,
        }}
      />
    </>
  );
}
