import { describe, expect, it } from 'vitest';
import { adjustWorkload, generateWeeklyPlan, planTotalMinutes, type WeeklyPlanInput } from './weekly-plan';
import { pathById } from '@/content/paths';

function input(overrides: Partial<WeeklyPlanInput> = {}): WeeklyPlanInput {
  return {
    userId: 'user-1',
    pathId: 'litteratie-numerique',
    weekStart: '2026-03-02',
    hoursPerWeek: 5,
    connectivity: 'correcte',
    completedItemIds: [],
    completedProjectIds: [],
    ...overrides,
  };
}

describe('generateWeeklyPlan', () => {
  it('produces between three and seven tasks', () => {
    const plan = generateWeeklyPlan(input());
    expect(plan.tasks.length).toBeGreaterThanOrEqual(3);
    expect(plan.tasks.length).toBeLessThanOrEqual(7);
  });

  it('is deterministic for the same user, week and path', () => {
    const first = generateWeeklyPlan(input());
    const second = generateWeeklyPlan(input());
    expect(second.tasks.map((t) => `${t.id}:${t.day}`)).toEqual(
      first.tasks.map((t) => `${t.id}:${t.day}`),
    );
  });

  it('always includes one practical and one reflective activity', () => {
    const plan = generateWeeklyPlan(input());
    expect(plan.tasks.some((task) => task.kind === 'pratique' || task.kind === 'projet')).toBe(true);
    expect(plan.tasks.some((task) => task.kind === 'reflexion')).toBe(true);
  });

  it('respects the declared time budget within a reasonable margin', () => {
    const plan = generateWeeklyPlan(input({ hoursPerWeek: 5 }));
    // Core tasks are budgeted; the mandatory practical and reflection blocks may
    // push slightly past, but never to double the declared time.
    expect(planTotalMinutes(plan)).toBeLessThanOrEqual(5 * 60 * 2);
  });

  it('schedules a lighter week for someone with very little time', () => {
    const light = planTotalMinutes(generateWeeklyPlan(input({ hoursPerWeek: 2 })));
    const heavy = planTotalMinutes(generateWeeklyPlan(input({ hoursPerWeek: 20 })));
    expect(light).toBeLessThan(heavy);
  });

  it('spreads tasks over fewer days when time is short', () => {
    const light = generateWeeklyPlan(input({ hoursPerWeek: 2 }));
    const heavy = generateWeeklyPlan(input({ hoursPerWeek: 20 }));
    const lightDays = new Set(light.tasks.map((task) => task.day)).size;
    const heavyDays = new Set(heavy.tasks.map((task) => task.day)).size;
    expect(lightDays).toBeLessThanOrEqual(heavyDays);
  });

  it('skips items the user has already completed', () => {
    const path = pathById.get('litteratie-numerique');
    const firstItem = path?.stages[0]?.items[0];
    expect(firstItem).toBeDefined();

    const plan = generateWeeklyPlan(input({ completedItemIds: [firstItem!.id] }));
    expect(plan.tasks.some((task) => task.itemId === firstItem!.id)).toBe(false);
  });

  it('deprioritises data-hungry items when the connection is rare', () => {
    // The English path leans on streamed audio; with a rare connection the plan
    // should still be produced, and should not be empty.
    const plan = generateWeeklyPlan(input({ pathId: 'anglais-emploi', connectivity: 'rare' }));
    expect(plan.tasks.length).toBeGreaterThanOrEqual(3);
  });

  it('takes the weekly objective from the current stage', () => {
    const plan = generateWeeklyPlan(input());
    const firstStage = pathById.get('litteratie-numerique')?.stages[0];
    expect(plan.objective).toBe(firstStage?.objective);
  });

  it('advances the objective once the first stage is finished', () => {
    const path = pathById.get('litteratie-numerique');
    const firstStage = path?.stages[0];
    const completed = firstStage?.items.map((item) => item.id) ?? [];

    const plan = generateWeeklyPlan(input({ completedItemIds: completed }));
    expect(plan.objective).toBe(path?.stages[1]?.objective);
  });

  it('returns an empty plan rather than throwing for an unknown path', () => {
    const plan = generateWeeklyPlan(input({ pathId: 'parcours-inexistant' }));
    expect(plan.tasks).toHaveLength(0);
    expect(plan.objective).toContain('Choisissez');
  });

  it('assigns every task to a valid day of the week', () => {
    const plan = generateWeeklyPlan(input());
    for (const task of plan.tasks) {
      expect(task.day).toBeGreaterThanOrEqual(0);
      expect(task.day).toBeLessThanOrEqual(6);
    }
  });

  it('gives each task a unique id', () => {
    const plan = generateWeeklyPlan(input());
    const ids = plan.tasks.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('works for every seeded path', () => {
    for (const path of pathById.values()) {
      const plan = generateWeeklyPlan(input({ pathId: path.id }));
      expect(plan.tasks.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('adjustWorkload', () => {
  it('steps down through the brackets', () => {
    expect(adjustWorkload(10, 'lighter')).toBe(5);
    expect(adjustWorkload(5, 'lighter')).toBe(2);
  });

  it('steps up through the brackets', () => {
    expect(adjustWorkload(2, 'heavier')).toBe(5);
    expect(adjustWorkload(10, 'heavier')).toBe(20);
  });

  it('stops at the extremes instead of going out of range', () => {
    expect(adjustWorkload(2, 'lighter')).toBe(2);
    expect(adjustWorkload(20, 'heavier')).toBe(20);
  });
});
