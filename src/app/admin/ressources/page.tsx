import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { resourcesWithOverrides } from '@/lib/content-overlay';
import { PageHeader } from '@/components/layout/page';
import { Notice } from '@/components/ui';
import { ResourceAdminList } from '@/components/admin/resource-admin-list';

export const metadata: Metadata = { title: 'Ressources', robots: { index: false } };

export default async function AdminResourcesPage() {
  const t = await getDictionary();
  const resources = await resourcesWithOverrides();

  return (
    <>
      <PageHeader title={t.admin.tabs.resources} description={t.admin.overlayNotice} />

      <Notice tone="warning" className="mb-6">
        {t.admin.resourceEditor.markVerifiedHint}
      </Notice>

      <ResourceAdminList
        resources={resources}
        labels={{
          verification: t.admin.resourceEditor.verification,
          markVerified: t.admin.resourceEditor.markVerified,
          archive: t.admin.resourceEditor.archive,
          unarchive: t.admin.resourceEditor.unarchive,
          archived: t.admin.resourceEditor.archived,
          qualityNotes: t.admin.resourceEditor.qualityNotes,
          updated: t.admin.resourceEditor.updated,
          reset: t.admin.pathEditor.resetToDefault,
          save: t.actions.save,
          saving: t.actions.saving,
          lastReviewed: t.labels.lastReviewed,
          statusVerified: t.resources.verificationVerified,
          statusPending: t.resources.verificationPending,
          statusBroken: t.resources.verificationBroken,
        }}
      />
    </>
  );
}
