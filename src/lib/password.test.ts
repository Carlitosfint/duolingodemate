import { describe, expect, it } from 'vitest';
import { passwordChecks, passwordProblem, MAX_PASSWORD_LENGTH } from './password.ts';

const student = { email: '20265473@angeles.edu.pe', dni: '71234567' };

describe('passwordProblem', () => {
  it('accepts a reasonable password', () => {
    expect(passwordProblem('gato-azul-17', student)).toBeNull();
    expect(passwordProblem('Mate2026Lucia', student)).toBeNull();
  });

  it('asks for at least 8 characters', () => {
    expect(passwordProblem('abc123', student)).toMatch(/8 caracteres/);
  });

  it('asks for letters and numbers', () => {
    expect(passwordProblem('solamenteletras', student)).toMatch(/letras y números/);
    expect(passwordProblem('1234567890', student)).toMatch(/letras y números/);
  });

  it('refuses the DNI, even with something stuck to it', () => {
    expect(passwordProblem('71234567a', student)).toMatch(/DNI/);
    expect(passwordProblem('x71234567', student)).toMatch(/DNI/);
  });

  // The login code is on every class list the teacher prints.
  it('refuses the login code', () => {
    expect(passwordProblem('20265473ab', student)).toMatch(/correo/);
  });

  it('refuses the obvious ones, whatever the capitals', () => {
    expect(passwordProblem('Password123', student)).toMatch(/común/);
    expect(passwordProblem('colegio123', student)).toMatch(/común/);
  });

  it('refuses leading or trailing spaces, which people never remember typing', () => {
    expect(passwordProblem(' gato-azul-17', student)).toMatch(/espacios/);
  });

  it('refuses anything that is not a string', () => {
    expect(passwordProblem(undefined, student)).toBeTruthy();
    expect(passwordProblem(12345678, student)).toBeTruthy();
    expect(passwordProblem({}, student)).toBeTruthy();
  });

  it('bounds the length', () => {
    expect(passwordProblem('a1'.repeat(MAX_PASSWORD_LENGTH), student)).toMatch(/máximo/);
  });

  it('does not over-match short identifiers', () => {
    // A staff member called "rosa" can still use a password containing "rosa".
    expect(passwordProblem('rosales2026', { email: 'rosa@angeles.edu.pe' })).toBeNull();
  });

  it('works without identity details', () => {
    expect(passwordProblem('gato-azul-17')).toBeNull();
  });
});

describe('passwordChecks', () => {
  it('reports each rule separately, for the live checklist', () => {
    const checks = passwordChecks('abc', student);
    expect(checks.map((c) => [c.id, c.ok])).toEqual([
      ['length', false],
      ['mix', false],
      ['personal', true],
    ]);
  });

  it('does not tick "personal" on an empty field', () => {
    expect(passwordChecks('', student).find((c) => c.id === 'personal')?.ok).toBe(false);
  });

  it('agrees with passwordProblem when everything is ticked', () => {
    const pw = 'gato-azul-17';
    expect(passwordChecks(pw, student).every((c) => c.ok)).toBe(true);
    expect(passwordProblem(pw, student)).toBeNull();
  });
});
