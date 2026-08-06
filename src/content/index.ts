/**
 * Content barrel.
 *
 * Content is authored as typed TypeScript modules rather than loaded from the
 * database at request time. That is a deliberate low-bandwidth decision: the
 * curriculum ships in the bundle, renders with zero round trips, and can be
 * cached by the service worker for offline use. The database holds the same
 * content (seeded from here) plus admin edits, which are applied as an overlay.
 *
 * See docs/CONTENT_MODEL.md and docs/DECISIONS.md (ADR-003).
 */

export { sectors, sectorById } from './sectors';
export { skills, skillById, skillName, skillsByDimension } from './skills';
export { resources, resourceById, resourcesByIds } from './resources';
export {
  careerPaths,
  pathById,
  pathBySlug,
  pathName,
  totalItems,
  findStage,
  findItem,
} from './paths';
export {
  practicalProjects,
  projectById,
  projectsForPath,
  projectBySlug,
} from './projects';
export {
  interviewQuestions,
  interviewQuestionById,
  questionsByCategory,
} from './interview-questions';
export { jobExamples, jobExampleById } from './job-examples';
export { checklists, checklistById } from './checklists';
export { emailTemplates, templateById } from './templates';
