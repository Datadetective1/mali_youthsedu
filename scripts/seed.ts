/**
 * Seeds reference content into the database from the TypeScript content
 * modules, which remain the single source of truth.
 *
 * Usage:
 *   npm run db:seed                    # local JSON driver
 *   DATA_DRIVER=supabase npm run db:seed   # requires SUPABASE_SERVICE_ROLE_KEY
 *
 * Idempotent: every write is an upsert keyed on the content id, so running it
 * twice changes nothing and running it after a content edit updates the rows.
 *
 * IMPORTANT: `verification` is copied through as authored. Seeded resources are
 * `pending` and this script will not silently promote them — a link is verified
 * when a human has opened it, never because a script ran.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { careerPaths } from '../src/content/paths';
import { practicalProjects } from '../src/content/projects';
import { resources } from '../src/content/resources';
import { sectors } from '../src/content/sectors';
import { skills } from '../src/content/skills';
import { interviewQuestions } from '../src/content/interview-questions';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`${name} est requis pour seeder Supabase.`);
    process.exit(1);
  }
  return value;
}

async function upsertAll(
  client: SupabaseClient,
  table: string,
  rows: Record<string, unknown>[],
  conflict = 'id',
) {
  if (rows.length === 0) return;
  // Chunked: a single 500-row insert can exceed the request size limit.
  const size = 100;
  for (let index = 0; index < rows.length; index += size) {
    const chunk = rows.slice(index, index + size);
    const { error } = await client.from(table).upsert(chunk, { onConflict: conflict });
    if (error) {
      console.error(`Echec sur ${table} :`, error.message);
      process.exit(1);
    }
  }
  console.log(`✓ ${table}: ${rows.length} ligne(s)`);
}

async function main() {
  const driver = process.env.DATA_DRIVER ?? 'local';

  if (driver !== 'supabase') {
    // The local driver reads content straight from the TypeScript modules, so
    // there is nothing to copy. Report the counts so the command is still a
    // useful sanity check.
    console.log('DATA_DRIVER=local : le contenu est lu depuis src/content, aucun seed necessaire.');
    report();
    return;
  }

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('Seed du contenu de reference vers Supabase…\n');

  await upsertAll(
    client,
    'sectors',
    sectors.map((sector) => ({
      id: sector.id,
      name: sector.name,
      description: sector.description,
      caution: sector.caution ?? null,
      keywords: sector.keywords,
    })),
  );

  await upsertAll(
    client,
    'skills',
    skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      dimension: skill.dimension,
      description: skill.description,
      keywords: skill.keywords,
      sector_ids: skill.sectorIds ?? [],
    })),
  );

  await upsertAll(
    client,
    'learning_resources',
    resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      provider: resource.provider,
      url: resource.url,
      description: resource.description,
      language: resource.language,
      skill_ids: resource.skillIds,
      sector_ids: resource.sectorIds,
      format: resource.format,
      level: resource.level,
      minutes: resource.minutes,
      connectivity: resource.connectivity,
      mobile_friendly: resource.mobileFriendly,
      offline_capable: resource.offlineCapable,
      cost: resource.cost,
      certificate: resource.certificate,
      quality_notes: resource.qualityNotes,
      verification: resource.verification,
      last_reviewed: resource.lastReviewed,
      archived: resource.archived ?? false,
    })),
  );

  await upsertAll(
    client,
    'career_paths',
    careerPaths.map((path) => ({
      id: path.id,
      slug: path.slug,
      name: path.name,
      summary: path.summary,
      description: path.description,
      audience: path.audience,
      outcomes: path.outcomes,
      prerequisites: path.prerequisites,
      sector_ids: path.sectorIds,
      skill_ids: path.skillIds,
      level: path.level,
      featured: path.featured,
      sort_order: path.order,
      estimated_hours: path.estimatedHours,
      icon: path.icon,
      caution: path.caution ?? null,
      published: path.published !== false,
    })),
  );

  await upsertAll(
    client,
    'roadmap_stages',
    careerPaths.flatMap((path) =>
      path.stages.map((stage) => ({
        id: stage.id,
        path_id: path.id,
        sort_order: stage.order,
        name: stage.name,
        objective: stage.objective,
        skill_ids: stage.skillIds,
        estimated_minutes: stage.estimatedMinutes,
        resource_ids: stage.resourceIds,
        practical_exercise: stage.practicalExercise,
        checklist: stage.checklist,
        reflection: stage.reflection,
        evidence: stage.evidence,
        knowledge_check: stage.knowledgeCheck ?? [],
      })),
    ),
  );

  await upsertAll(
    client,
    'roadmap_items',
    careerPaths.flatMap((path) =>
      path.stages.flatMap((stage) =>
        stage.items.map((item, index) => ({
          id: item.id,
          stage_id: stage.id,
          path_id: path.id,
          sort_order: index + 1,
          title: item.title,
          description: item.description ?? null,
          minutes: item.minutes,
          kind: item.kind,
          resource_ids: item.resourceIds ?? [],
        })),
      ),
    ),
  );

  await upsertAll(
    client,
    'roadmap_resource_links',
    careerPaths.flatMap((path) =>
      path.stages.flatMap((stage) =>
        stage.resourceIds.map((resourceId, index) => ({
          stage_id: stage.id,
          resource_id: resourceId,
          sort_order: index,
        })),
      ),
    ),
    'stage_id,resource_id',
  );

  await upsertAll(
    client,
    'practical_projects',
    practicalProjects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      path_id: project.pathId,
      difficulty: project.difficulty,
      simulated: project.simulated,
      estimated_minutes: project.estimatedMinutes,
      scenario: project.scenario,
      objective: project.objective,
      instructions: project.instructions,
      deliverable: project.deliverable,
      skill_ids: project.skillIds,
      evaluation_checklist: project.evaluationChecklist,
      portfolio_description: project.portfolioDescription,
      offline_friendly: project.offlineFriendly,
    })),
  );

  await upsertAll(
    client,
    'interview_questions',
    interviewQuestions.map((question) => ({
      id: question.id,
      category: question.category,
      question: question.question,
      why_asked: question.whyAsked,
      what_they_listen_for: question.whatTheyListenFor,
      trap: question.trap,
      structure: question.structure,
      sector_ids: question.sectorIds ?? [],
    })),
  );

  console.log('');
  report();
}

function report() {
  const stageCount = careerPaths.reduce((sum, path) => sum + path.stages.length, 0);
  const itemCount = careerPaths.reduce(
    (sum, path) => sum + path.stages.reduce((inner, stage) => inner + stage.items.length, 0),
    0,
  );
  const pending = resources.filter((resource) => resource.verification === 'pending').length;

  console.log('Contenu de reference :');
  console.log(`  ${sectors.length} secteurs`);
  console.log(`  ${skills.length} competences`);
  console.log(`  ${careerPaths.length} parcours, ${stageCount} etapes, ${itemCount} taches`);
  console.log(`  ${resources.length} ressources`);
  console.log(`  ${practicalProjects.length} projets pratiques`);
  console.log(`  ${interviewQuestions.length} questions d'entretien`);

  if (pending > 0) {
    console.log('');
    console.log(`ATTENTION : ${pending} ressource(s) marquee(s) "a verifier avant publication".`);
    console.log('Ces liens doivent etre ouverts et controles par une personne avant toute mise');
    console.log('en ligne publique. Voir docs/CONTENT_MODEL.md.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
