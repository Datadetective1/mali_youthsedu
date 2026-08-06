/**
 * Domain types shared by content, the rules engines, the database layer and the UI.
 *
 * These mirror the PostgreSQL schema in `supabase/migrations`. When one changes,
 * change the other — `docs/DATABASE.md` documents the mapping.
 */

// ---------------------------------------------------------------------------
// Shared scalars
// ---------------------------------------------------------------------------

export type Level = 'debutant' | 'intermediaire' | 'avance';
export const levels: Level[] = ['debutant', 'intermediaire', 'avance'];

/** How much network a resource needs. `offline` means downloadable/printable. */
export type ConnectivityNeed = 'offline' | 'low' | 'medium' | 'high';

export type ResourceFormat =
  | 'cours'
  | 'video'
  | 'article'
  | 'guide'
  | 'exercice'
  | 'outil'
  | 'modele'
  | 'podcast'
  | 'livre';

export type ResourceLanguage = 'fr' | 'en' | 'bm' | 'multi';
export type ResourceCost = 'gratuit' | 'freemium';

/**
 * Link quality. `verified` may only be set by a human who actually opened the
 * link — see docs/CONTENT_MODEL.md. Seed content ships as `pending`.
 */
export type VerificationStatus = 'verified' | 'pending' | 'broken';

/**
 * The four recruitment dimensions the product is organised around, taken from
 * HR feedback. `communication` was added as a supporting fourth dimension.
 */
export type SkillDimension = 'savoir-faire' | 'savoir-etre' | 'reflexion' | 'communication';

export type ProjectDifficulty = 'facile' | 'moyen' | 'exigeant';

export type InterviewCategory =
  | 'generale'
  | 'comportementale'
  | 'commerciale'
  | 'minier'
  | 'administrative'
  | 'technique'
  | 'motivation'
  | 'difficile'
  | 'entrepreneuriat';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export interface Sector {
  id: string;
  name: string;
  description: string;
  /** Regulatory or safety caveat shown wherever the sector appears. */
  caution?: string;
  keywords: string[];
}

export interface Skill {
  id: string;
  name: string;
  dimension: SkillDimension;
  description: string;
  /**
   * Accent-free lowercase terms used by the job-description analyzer to detect
   * this skill in a French job advert. Order does not matter; more is better.
   */
  keywords: string[];
  sectorIds?: string[];
}

export interface KnowledgeCheck {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export type RoadmapItemKind = 'lecture' | 'pratique' | 'reflexion' | 'evaluation';

export interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  minutes: number;
  kind: RoadmapItemKind;
  resourceIds?: string[];
}

export interface PracticalExercise {
  title: string;
  instructions: string[];
  deliverable: string;
}

export interface RoadmapStage {
  id: string;
  order: number;
  name: string;
  objective: string;
  skillIds: string[];
  estimatedMinutes: number;
  items: RoadmapItem[];
  resourceIds: string[];
  practicalExercise: PracticalExercise;
  checklist: string[];
  reflection: string;
  evidence: string;
  knowledgeCheck?: KnowledgeCheck[];
}

export interface CareerPath {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  audience: string[];
  outcomes: string[];
  prerequisites: string[];
  sectorIds: string[];
  skillIds: string[];
  level: Level;
  featured: boolean;
  order: number;
  estimatedHours: number;
  icon: string;
  stages: RoadmapStage[];
  projectIds: string[];
  /** Shown when the domain carries regulatory or safety constraints. */
  caution?: string;
  published?: boolean;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  url: string;
  description: string;
  language: ResourceLanguage;
  skillIds: string[];
  sectorIds: string[];
  format: ResourceFormat;
  level: Level;
  minutes: number;
  connectivity: ConnectivityNeed;
  mobileFriendly: boolean;
  offlineCapable: boolean;
  cost: ResourceCost;
  certificate: boolean;
  qualityNotes: string;
  verification: VerificationStatus;
  /** ISO date of the last human review, or null when never reviewed. */
  lastReviewed: string | null;
  archived?: boolean;
}

export interface PracticalProject {
  id: string;
  slug: string;
  title: string;
  pathId: string;
  difficulty: ProjectDifficulty;
  /** Simulated assignments must always be presented as exercises, never as client work. */
  simulated: boolean;
  estimatedMinutes: number;
  scenario: string;
  objective: string;
  instructions: string[];
  deliverable: string;
  skillIds: string[];
  evaluationChecklist: string[];
  portfolioDescription: string;
  offlineFriendly: boolean;
}

export interface InterviewQuestion {
  id: string;
  category: InterviewCategory;
  question: string;
  whyAsked: string;
  whatTheyListenFor: string[];
  trap: string;
  structure: string[];
  sectorIds?: string[];
}

export interface JobExample {
  id: string;
  slug: string;
  label: string;
  title: string;
  company: string;
  sectorId: string;
  location: string;
  text: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  help?: string;
}

export interface Checklist {
  id: string;
  title: string;
  intro?: string;
  items: ChecklistItem[];
}

// ---------------------------------------------------------------------------
// Onboarding & profile
// ---------------------------------------------------------------------------

export type AgeRange = '15-17' | '18-24' | '25-30' | '31-35' | 'prefer-not';
export type EducationLevel =
  | 'none'
  | 'primaire'
  | 'college'
  | 'lycee'
  | 'technique'
  | 'licence'
  | 'master';
export type UserStatus =
  | 'eleve'
  | 'etudiant'
  | 'diplome'
  | 'sans-emploi'
  | 'emploi-partiel'
  | 'salarie'
  | 'independant';
export type LocationType = 'urbain' | 'periurbain' | 'rural';
export type FrenchLevel = 'base' | 'courant' | 'avance';
export type EnglishLevel = 'aucun' | 'debutant' | 'intermediaire' | 'avance';
export type DigitalLevel = 'debutant' | 'intermediaire' | 'avance';
export type Goal =
  | 'trouver-emploi'
  | 'premier-emploi'
  | 'changer-metier'
  | 'travail-distance'
  | 'freelance'
  | 'creer-activite'
  | 'competences'
  | 'secteur';
export type InterestId =
  | 'commerce'
  | 'mines'
  | 'administration'
  | 'numerique'
  | 'langues'
  | 'entrepreneuriat'
  | 'finance'
  | 'logistique'
  | 'agriculture'
  | 'communication';
export type ConnectivityQuality = 'rare' | 'limitee' | 'correcte' | 'bonne';
export type DeviceType = 'telephone-simple' | 'smartphone' | 'ordinateur-partage' | 'ordinateur';
export type ExperienceLevel =
  | 'aucune'
  | 'scolaire-benevole'
  | 'stage'
  | 'moins-2ans'
  | 'plus-2ans';
export type LearningStyle = 'lecture' | 'video' | 'pratique' | 'groupe';

export interface OnboardingAnswers {
  ageRange?: AgeRange;
  educationLevel: EducationLevel;
  status: UserStatus;
  locationType: LocationType;
  frenchLevel: FrenchLevel;
  englishLevel: EnglishLevel;
  digitalLevel: DigitalLevel;
  goal: Goal;
  interests: InterestId[];
  hoursPerWeek: number;
  connectivity: ConnectivityQuality;
  device: DeviceType;
  experience: ExperienceLevel;
  learningStyle: LearningStyle;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  onboarding: OnboardingAnswers | null;
  onboardingCompletedAt: string | null;
  locale: string;
  isAdmin: boolean;
}

// ---------------------------------------------------------------------------
// Recommendation
// ---------------------------------------------------------------------------

export interface RecommendationReason {
  /** Short label shown as a chip, e.g. "Objectif". */
  factor: string;
  /** Full sentence in French explaining the contribution. */
  explanation: string;
  points: number;
}

export interface PathScore {
  pathId: string;
  score: number;
  reasons: RecommendationReason[];
}

export interface Recommendation {
  primaryPathId: string;
  supportingPathId: string | null;
  alternatives: string[];
  reasons: RecommendationReason[];
  hoursPerWeek: number;
  estimatedWeeks: number;
  scores: PathScore[];
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';

export interface UserRoadmap {
  id: string;
  userId: string;
  pathId: string;
  isPrimary: boolean;
  startedAt: string;
  completedAt: string | null;
  archivedAt: string | null;
}

/** One row per completed roadmap item. Absence means "not done". */
export interface ProgressEntry {
  id: string;
  userId: string;
  pathId: string;
  stageId: string;
  itemId: string;
  completedAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  scope: 'stage' | 'project' | 'employer' | 'reflection';
  refId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedResource {
  id: string;
  userId: string;
  resourceId: string;
  savedAt: string;
  rating: 'useful' | 'not-useful' | null;
}

// ---------------------------------------------------------------------------
// Weekly plan
// ---------------------------------------------------------------------------

export type WeeklyTaskKind = RoadmapItemKind | 'projet';

export interface WeeklyTask {
  id: string;
  planId: string;
  title: string;
  description?: string;
  kind: WeeklyTaskKind;
  minutes: number;
  /** 0 = Monday … 6 = Sunday. */
  day: number;
  pathId: string | null;
  stageId: string | null;
  itemId: string | null;
  projectId: string | null;
  completedAt: string | null;
  order: number;
}

export interface WeeklyPlan {
  id: string;
  userId: string;
  /** ISO date of the Monday. */
  weekStart: string;
  pathId: string;
  objective: string;
  hoursTarget: number;
  tasks: WeeklyTask[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Projects & portfolio
// ---------------------------------------------------------------------------

export interface UserProject {
  id: string;
  userId: string;
  projectId: string;
  startedAt: string;
  completedAt: string | null;
  work: string;
  evidenceUrl: string | null;
  reflection: string;
  checklistDone: string[];
  inPortfolio: boolean;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Job analysis
// ---------------------------------------------------------------------------

export type RequirementKind =
  | 'responsabilite'
  | 'competence-requise'
  | 'competence-appreciee'
  | 'langue'
  | 'outil'
  | 'formation'
  | 'experience'
  | 'comportement';

export interface ExtractedRequirement {
  id: string;
  kind: RequirementKind;
  label: string;
  /** Sentence from the advert this was taken from — keeps the result auditable. */
  evidence: string;
  skillId?: string;
  /** 0-1 confidence of the deterministic extractor. */
  confidence: number;
}

export interface JobExtraction {
  jobTitle: string;
  company: string | null;
  responsibilities: string[];
  requiredSkills: ExtractedRequirement[];
  preferredSkills: ExtractedRequirement[];
  languages: ExtractedRequirement[];
  tools: ExtractedRequirement[];
  education: ExtractedRequirement[];
  experience: ExtractedRequirement[];
  behavioral: ExtractedRequirement[];
  keywords: string[];
  interviewThemes: string[];
  /** Which engine produced this: rules always run; AI may refine. */
  source: 'rules' | 'rules+ai';
}

export type MatchStrength = 'strong' | 'partial' | 'missing';

export interface RequirementMatch {
  requirementId: string;
  label: string;
  kind: RequirementKind;
  strength: MatchStrength;
  /** Why the engine reached this verdict, in French. */
  rationale: string;
  suggestion?: string;
  pathId?: string;
}

export interface ReadinessComponent {
  key:
    | 'skills'
    | 'languages'
    | 'tools'
    | 'experience'
    | 'education'
    | 'preparation';
  label: string;
  score: number;
  weight: number;
  detail: string;
}

export interface ReadinessScore {
  score: number;
  band: 'low' | 'medium' | 'high';
  components: ReadinessComponent[];
}

export interface JobComparison {
  matches: RequirementMatch[];
  transferable: { label: string; rationale: string }[];
  experienceGap: string | null;
  recommendedActions: { label: string; pathId?: string }[];
  questionsToResearch: string[];
  examplesToPrepare: string[];
  readiness: ReadinessScore;
}

export interface JobAnalysis {
  id: string;
  userId: string | null;
  jobTitle: string;
  company: string | null;
  rawText: string;
  extraction: JobExtraction;
  comparison: JobComparison | null;
  answers: Partial<Record<SixQuestionKey, string>>;
  createdAt: string;
}

export type SixQuestionKey =
  | 'whyRole'
  | 'whyCompany'
  | 'whyMe'
  | 'myGaps'
  | 'howCompensate'
  | 'whatValue';

// ---------------------------------------------------------------------------
// Value proposition, interview practice, CV
// ---------------------------------------------------------------------------

export interface ValuePropositionInput {
  problem: string;
  skills: string;
  results: string;
  proof: string;
  approach: string;
  motivation: string;
  targetRole?: string;
}

export interface ValuePropositionOutput {
  pitch: string;
  cvSummary: string;
  tellMeAboutYou: string;
  whyHireYou: string;
  roleStatement: string;
  source: 'rules' | 'rules+ai';
}

export interface ValueProposition {
  id: string;
  userId: string;
  input: ValuePropositionInput;
  output: ValuePropositionOutput;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewAnswer {
  id: string;
  userId: string;
  questionId: string;
  body: string;
  updatedAt: string;
}

export interface StarExample {
  id: string;
  userId: string;
  label: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  updatedAt: string;
}

export interface CvExperience {
  id: string;
  role: string;
  organisation: string;
  period: string;
  description: string;
}

export interface CvEducation {
  id: string;
  diploma: string;
  institution: string;
  year: string;
}

export interface CvLanguage {
  id: string;
  name: string;
  level: string;
}

export interface CvProfile {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  summary: string;
  phone: string;
  city: string;
  experiences: CvExperience[];
  education: CvEducation[];
  languages: CvLanguage[];
  skills: string[];
  tools: string[];
  projects: string[];
  extras: string;
  updatedAt: string;
}

export interface ChecklistState {
  id: string;
  userId: string;
  checklistId: string;
  doneItemIds: string[];
  updatedAt: string;
}

export interface SkillGapEntry {
  id: string;
  userId: string;
  label: string;
  skillId: string | null;
  occurrences: number;
  status: 'todo' | 'learning' | 'addressed';
  pathId: string | null;
  updatedAt: string;
}

export interface EmployerResearch {
  id: string;
  userId: string;
  company: string;
  notes: string;
  doneItemIds: string[];
  updatedAt: string;
}

export interface ConfidenceWork {
  id: string;
  userId: string;
  fearedQuestion: string;
  preparedAnswer: string;
  evidence: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Feedback & metrics
// ---------------------------------------------------------------------------

export type FeedbackType =
  | 'idee'
  | 'probleme'
  | 'contenu'
  | 'accessibilite'
  | 'partenariat'
  | 'autre';

export interface Feedback {
  id: string;
  type: FeedbackType;
  message: string;
  email: string | null;
  createdAt: string;
}

export type MetricEvent =
  | 'onboarding_completed'
  | 'roadmap_started'
  | 'task_completed'
  | 'project_completed'
  | 'job_analysis_run'
  | 'value_prop_created'
  | 'interview_answer_saved'
  | 'weekly_plan_generated'
  | 'offline_save'
  | 'self_reported_application'
  | 'self_reported_interview'
  | 'self_reported_offer';

export interface MetricCounter {
  event: MetricEvent;
  count: number;
}

// ---------------------------------------------------------------------------
// Offline sync
// ---------------------------------------------------------------------------

export type SyncOperation =
  | { type: 'complete-item'; pathId: string; stageId: string; itemId: string; at: string }
  | { type: 'uncomplete-item'; pathId: string; stageId: string; itemId: string; at: string }
  | { type: 'complete-task'; taskId: string; at: string }
  | { type: 'uncomplete-task'; taskId: string; at: string }
  | { type: 'move-task'; taskId: string; day: number; at: string }
  | { type: 'save-note'; scope: UserNote['scope']; refId: string; body: string; at: string };

export interface QueuedOperation {
  id: string;
  operation: SyncOperation;
  queuedAt: string;
  attempts: number;
}
