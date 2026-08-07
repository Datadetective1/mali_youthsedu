import { describe, expect, it } from 'vitest';
import {
  careerPaths,
  checklists,
  interviewQuestions,
  jobExamples,
  practicalProjects,
  resourceById,
  resources,
  sectorById,
  sectors,
  skillById,
  skills,
} from './index';
import { emailTemplates } from './templates';

/**
 * Content integrity.
 *
 * These tests are the reason a broken cross-reference cannot reach a user: a
 * stage pointing at a deleted resource, a project attached to a path that no
 * longer exists, or — most importantly — a link claiming to be verified when
 * nobody verified it.
 */

describe('seed volume meets the product brief', () => {
  it('ships at least 8 learning paths', () => {
    expect(careerPaths.length).toBeGreaterThanOrEqual(8);
  });

  it('gives every path between 4 and 8 stages', () => {
    for (const path of careerPaths) {
      expect(path.stages.length, path.slug).toBeGreaterThanOrEqual(4);
      expect(path.stages.length, path.slug).toBeLessThanOrEqual(8);
    }
  });

  it('gives every stage several tasks', () => {
    for (const path of careerPaths) {
      for (const stage of path.stages) {
        expect(stage.items.length, `${path.slug}/${stage.id}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('ships at least 40 curated resources', () => {
    expect(resources.length).toBeGreaterThanOrEqual(40);
  });

  it('ships at least 16 practical projects', () => {
    expect(practicalProjects.length).toBeGreaterThanOrEqual(16);
  });

  it('gives every path at least two practical projects', () => {
    for (const path of careerPaths) {
      const projects = practicalProjects.filter((project) => project.pathId === path.id);
      expect(projects.length, path.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it('ships at least 30 interview questions', () => {
    expect(interviewQuestions.length).toBeGreaterThanOrEqual(30);
  });

  it('ships the job-description examples the brief asks for', () => {
    const sectorsCovered = new Set(jobExamples.map((example) => example.sectorId));
    expect(sectorsCovered.has('mines')).toBe(true);
    expect(sectorsCovered.has('commerce')).toBe(true);
    expect(sectorsCovered.has('administration')).toBe(true);
    expect(sectorsCovered.has('numerique')).toBe(true);
    expect(jobExamples.length).toBeGreaterThanOrEqual(4);
  });
});

describe('referential integrity', () => {
  it('resolves every skill referenced by a path', () => {
    for (const path of careerPaths) {
      for (const skillId of path.skillIds) {
        expect(skillById.has(skillId), `${path.slug} → ${skillId}`).toBe(true);
      }
      for (const stage of path.stages) {
        for (const skillId of stage.skillIds) {
          expect(skillById.has(skillId), `${stage.id} → ${skillId}`).toBe(true);
        }
      }
    }
  });

  it('resolves every sector referenced by a path or a skill', () => {
    for (const path of careerPaths) {
      for (const sectorId of path.sectorIds) {
        expect(sectorById.has(sectorId), `${path.slug} → ${sectorId}`).toBe(true);
      }
    }
    for (const skill of skills) {
      for (const sectorId of skill.sectorIds ?? []) {
        expect(sectorById.has(sectorId), `${skill.id} → ${sectorId}`).toBe(true);
      }
    }
  });

  it('resolves every resource referenced by a stage or an item', () => {
    for (const path of careerPaths) {
      for (const stage of path.stages) {
        for (const resourceId of stage.resourceIds) {
          expect(resourceById.has(resourceId), `${stage.id} → ${resourceId}`).toBe(true);
        }
        for (const item of stage.items) {
          for (const resourceId of item.resourceIds ?? []) {
            expect(resourceById.has(resourceId), `${item.id} → ${resourceId}`).toBe(true);
          }
        }
      }
    }
  });

  it('resolves every project referenced by a path, and vice versa', () => {
    const projectIds = new Set(practicalProjects.map((project) => project.id));
    const pathIds = new Set(careerPaths.map((path) => path.id));

    for (const path of careerPaths) {
      for (const projectId of path.projectIds) {
        expect(projectIds.has(projectId), `${path.slug} → ${projectId}`).toBe(true);
      }
    }
    for (const project of practicalProjects) {
      expect(pathIds.has(project.pathId), `${project.slug} → ${project.pathId}`).toBe(true);
    }
  });

  it('resolves every skill referenced by a project or a resource', () => {
    for (const project of practicalProjects) {
      for (const skillId of project.skillIds) {
        expect(skillById.has(skillId), `${project.slug} → ${skillId}`).toBe(true);
      }
    }
    for (const resource of resources) {
      for (const skillId of resource.skillIds) {
        expect(skillById.has(skillId), `${resource.id} → ${skillId}`).toBe(true);
      }
      for (const sectorId of resource.sectorIds) {
        expect(sectorById.has(sectorId), `${resource.id} → ${sectorId}`).toBe(true);
      }
    }
  });

  it('keeps every id unique', () => {
    const collect = (ids: string[], label: string) => {
      expect(new Set(ids).size, `duplicate ${label} id`).toBe(ids.length);
    };
    collect(careerPaths.map((p) => p.id), 'path');
    collect(skills.map((s) => s.id), 'skill');
    collect(sectors.map((s) => s.id), 'sector');
    collect(resources.map((r) => r.id), 'resource');
    collect(practicalProjects.map((p) => p.id), 'project');
    collect(interviewQuestions.map((q) => q.id), 'question');
    collect(jobExamples.map((j) => j.id), 'job example');
    collect(checklists.map((c) => c.id), 'checklist');
    collect(emailTemplates.map((t) => t.id), 'template');
    collect(
      careerPaths.flatMap((p) => p.stages.map((s) => s.id)),
      'stage',
    );
    collect(
      careerPaths.flatMap((p) => p.stages.flatMap((s) => s.items.map((i) => i.id))),
      'item',
    );
    collect(
      checklists.flatMap((c) => c.items.map((i) => `${c.id}:${i.id}`)),
      'checklist item',
    );
  });
});

describe('link honesty', () => {
  it('marks every seeded resource as pending human verification', () => {
    // If this test starts failing, someone marked a link verified. That is only
    // legitimate after a human actually opened it — see docs/CONTENT_MODEL.md.
    const claimedVerified = resources.filter((resource) => resource.verification === 'verified');
    expect(
      claimedVerified.map((r) => r.id),
      'a seeded resource claims to be verified without a human review',
    ).toEqual([]);
  });

  it('leaves lastReviewed null while verification is pending', () => {
    for (const resource of resources) {
      if (resource.verification === 'pending') {
        expect(resource.lastReviewed, resource.id).toBeNull();
      }
    }
  });

  it('gives every resource an absolute https link', () => {
    for (const resource of resources) {
      expect(resource.url, resource.id).toMatch(/^https:\/\//);
    }
  });

  it('labels every job example as fictional', () => {
    for (const example of jobExamples) {
      expect(example.text, example.id).toMatch(/fictive|fictif/i);
    }
  });

  it('warns on every path that touches regulated mining work', () => {
    const mining = careerPaths.find((path) => path.id === 'mines-support');
    expect(mining?.caution).toBeTruthy();
    expect(mining?.caution).toMatch(/habilitation|certification|réglement/i);
  });

  it('flags simulated projects so they are never presented as client work', () => {
    for (const project of practicalProjects.filter((candidate) => candidate.simulated)) {
      expect(
        `${project.scenario} ${project.portfolioDescription}`,
        project.slug,
      ).toMatch(/simul|pédagogique/i);
    }
  });
});

describe('content quality', () => {
  it('gives every stage an objective, an exercise, a reflection and an evidence output', () => {
    for (const path of careerPaths) {
      for (const stage of path.stages) {
        expect(stage.objective.length, stage.id).toBeGreaterThan(20);
        expect(stage.practicalExercise.instructions.length, stage.id).toBeGreaterThanOrEqual(3);
        expect(stage.practicalExercise.deliverable.length, stage.id).toBeGreaterThan(10);
        expect(stage.checklist.length, stage.id).toBeGreaterThanOrEqual(3);
        expect(stage.reflection.length, stage.id).toBeGreaterThan(20);
        expect(stage.evidence.length, stage.id).toBeGreaterThan(10);
      }
    }
  });

  it('keeps every knowledge-check answer index inside its options', () => {
    for (const path of careerPaths) {
      for (const stage of path.stages) {
        for (const check of stage.knowledgeCheck ?? []) {
          expect(check.options.length, check.id).toBeGreaterThanOrEqual(2);
          expect(check.answerIndex, check.id).toBeGreaterThanOrEqual(0);
          expect(check.answerIndex, check.id).toBeLessThan(check.options.length);
          expect(check.explanation.length, check.id).toBeGreaterThan(20);
        }
      }
    }
  });

  it('estimates a non-zero duration for every stage and item', () => {
    for (const path of careerPaths) {
      expect(path.estimatedHours, path.slug).toBeGreaterThan(0);
      for (const stage of path.stages) {
        expect(stage.estimatedMinutes, stage.id).toBeGreaterThan(0);
        for (const item of stage.items) {
          expect(item.minutes, item.id).toBeGreaterThan(0);
        }
      }
    }
  });

  it('gives every project an evaluation checklist and a portfolio description', () => {
    for (const project of practicalProjects) {
      expect(project.instructions.length, project.slug).toBeGreaterThanOrEqual(4);
      expect(project.evaluationChecklist.length, project.slug).toBeGreaterThanOrEqual(4);
      expect(project.portfolioDescription.length, project.slug).toBeGreaterThan(40);
      expect(project.skillIds.length, project.slug).toBeGreaterThan(0);
    }
  });

  it('tells the candidate why each interview question is asked', () => {
    for (const question of interviewQuestions) {
      expect(question.whyAsked.length, question.id).toBeGreaterThan(30);
      expect(question.whatTheyListenFor.length, question.id).toBeGreaterThanOrEqual(2);
      expect(question.trap.length, question.id).toBeGreaterThan(15);
      expect(question.structure.length, question.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('covers the interview categories the brief calls for', () => {
    const categories = new Set(interviewQuestions.map((question) => question.category));
    for (const expected of ['generale', 'comportementale', 'commerciale', 'minier', 'difficile']) {
      expect(categories.has(expected as never), expected).toBe(true);
    }
  });

  it('gives every skill searchable keywords for the job analyzer', () => {
    for (const skill of skills) {
      expect(skill.keywords.length, skill.id).toBeGreaterThan(0);
      for (const keyword of skill.keywords) {
        // Keywords are matched against accent-stripped lowercase text.
        expect(keyword, `${skill.id}: "${keyword}"`).toBe(keyword.toLowerCase());
        expect(keyword, `${skill.id}: "${keyword}"`).not.toMatch(/[éèêëàâäîïôöùûüç]/);
      }
    }
  });

  it('covers all four recruitment dimensions', () => {
    const dimensions = new Set(skills.map((skill) => skill.dimension));
    expect(dimensions).toEqual(
      new Set(['savoir-faire', 'savoir-etre', 'reflexion', 'communication']),
    );
  });

  it('tells the user what to adapt in every message template', () => {
    for (const template of emailTemplates) {
      expect(template.adaptations.length, template.id).toBeGreaterThanOrEqual(2);
      expect(template.body.length, template.id).toBeGreaterThan(80);
    }
  });
});
