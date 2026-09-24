import { describe, expect, it } from 'vitest';
import { buildTutorPrompt, cleanTutorInput, createRateLimiter, MAX_TUTOR_QUESTION } from './tutor.ts';

const body = {
  problem: {
    intro: 'Ana tiene el doble de la edad de Beto. Dentro de 5 años sumarán 40. ¿Qué edad tiene Beto?',
    topic: 'Edades',
    answer: '10',
    explanation: 'Sea x la edad de Beto...',
  },
  question: 'Dame una pista',
};

describe('cleanTutorInput', () => {
  it('keeps what the tutor needs', () => {
    expect(cleanTutorInput(body)).toMatchObject({ topic: 'Edades', answer: '10', question: 'Dame una pista' });
  });

  it('needs a problem and a question', () => {
    expect(cleanTutorInput({ ...body, question: '   ' })).toBeNull();
    expect(cleanTutorInput({ question: 'hola' })).toBeNull();
    expect(cleanTutorInput(null)).toBeNull();
  });

  it('bounds the question, so the endpoint cannot be used for long free-form prompts', () => {
    const long = cleanTutorInput({ ...body, question: 'x'.repeat(5000) });
    expect(long!.question.length).toBe(MAX_TUTOR_QUESTION);
  });

  it('ignores anything that is not text', () => {
    const odd = cleanTutorInput({ problem: { ...body.problem, topic: { a: 1 } }, question: 'ok' });
    expect(odd!.topic).toBe('');
  });
});

describe('buildTutorPrompt', () => {
  const prompt = buildTutorPrompt(cleanTutorInput(body)!);

  it('carries the problem and the question', () => {
    expect(prompt).toContain(body.problem.intro);
    expect(prompt).toContain('Pregunta del estudiante: "Dame una pista"');
  });

  it('tells the model not to give the answer away', () => {
    expect(prompt).toMatch(/NUNCA digas la respuesta final/);
  });

  // The old prompt called every problem "de variación geométrica" and
  // appended a % to every answer ("Respuesta Correcta: 10%").
  it('describes the actual topic and the answer as it is', () => {
    expect(prompt).toContain('Tema: Edades');
    expect(prompt).toMatch(/no la reveles\): 10$/m);
    expect(prompt).not.toMatch(/variación geométrica|10%/);
  });
});

describe('createRateLimiter', () => {
  it('lets a user through up to the limit, then stops them', () => {
    const allow = createRateLimiter({ limit: 3, windowMs: 1000 });
    expect([allow('a', 0), allow('a', 1), allow('a', 2), allow('a', 3)]).toEqual([true, true, true, false]);
  });

  it('counts each user separately', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow('a', 0)).toBe(true);
    expect(allow('b', 0)).toBe(true);
    expect(allow('a', 1)).toBe(false);
  });

  it('lets them back in once the window has passed', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow('a', 0)).toBe(true);
    expect(allow('a', 999)).toBe(false);
    expect(allow('a', 1000)).toBe(true);
  });
});
