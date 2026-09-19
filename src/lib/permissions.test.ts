import { describe, expect, it } from 'vitest';
import {
  canManageEnrollment,
  editableFieldsFor,
  visibleStudentsFor,
  ENROLLMENT_FIELDS,
  TEACHING_FIELDS,
} from './permissions.ts';

// These rules are the difference between a teacher doing their job and a
// teacher rewriting a student's national ID, so they get tested directly.
describe('canManageEnrollment', () => {
  it('lets the admin and the secretary run enrollment', () => {
    expect(canManageEnrollment('admin')).toBe(true);
    expect(canManageEnrollment('secretary')).toBe(true);
  });

  it('keeps teachers and students out of it', () => {
    expect(canManageEnrollment('teacher')).toBe(false);
    expect(canManageEnrollment('student')).toBe(false);
  });

  it('refuses anything it does not recognise', () => {
    expect(canManageEnrollment('')).toBe(false);
    expect(canManageEnrollment('ADMIN')).toBe(false);
    expect(canManageEnrollment(undefined as any)).toBe(false);
  });
});

describe('editableFieldsFor', () => {
  it('gives a teacher the classroom incentives and nothing else', () => {
    const fields = editableFieldsFor('teacher');
    expect([...fields].sort()).toEqual([...TEACHING_FIELDS].sort());
    for (const field of ENROLLMENT_FIELDS) {
      expect(fields).not.toContain(field);
    }
  });

  it('gives enrollment roles both sets', () => {
    for (const role of ['admin', 'secretary']) {
      const fields = editableFieldsFor(role);
      for (const field of [...ENROLLMENT_FIELDS, ...TEACHING_FIELDS]) {
        expect(fields).toContain(field);
      }
    }
  });

  it('never exposes a field that would change who someone is', () => {
    for (const role of ['admin', 'secretary', 'teacher', 'student', 'nonsense']) {
      const fields = editableFieldsFor(role);
      for (const forbidden of ['role', 'schoolId', 'uid', 'email', 'id', 'active', 'classrooms']) {
        expect(fields).not.toContain(forbidden);
      }
    }
  });
});

describe('visibleStudentsFor', () => {
  const students = [
    { uid: 'a', classroom: '4to A' },
    { uid: 'b', classroom: '5to B' },
    { uid: 'c', classroom: '4to A' },
    { uid: 'd', classroom: null },
  ];

  it('limits a teacher to the classrooms they were assigned', () => {
    const seen = visibleStudentsFor({ role: 'teacher', classrooms: ['4to A'] }, students);
    expect(seen.map((s) => s.uid)).toEqual(['a', 'c']);
  });

  it('handles a teacher covering several classrooms', () => {
    const seen = visibleStudentsFor({ role: 'teacher', classrooms: ['4to A', '5to B'] }, students);
    expect(seen.map((s) => s.uid)).toEqual(['a', 'b', 'c']);
  });

  // The default that keeps accounts created before this feature working.
  it('shows the whole school to a teacher with no assignment', () => {
    expect(visibleStudentsFor({ role: 'teacher', classrooms: [] }, students)).toHaveLength(4);
    expect(visibleStudentsFor({ role: 'teacher' }, students)).toHaveLength(4);
    expect(visibleStudentsFor({ role: 'teacher', classrooms: null }, students)).toHaveLength(4);
  });

  it('never narrows the admin or the secretary', () => {
    expect(visibleStudentsFor({ role: 'admin', classrooms: ['4to A'] }, students)).toHaveLength(4);
    expect(visibleStudentsFor({ role: 'secretary', classrooms: ['4to A'] }, students)).toHaveLength(4);
  });

  it('does not match a student who has no classroom against an assignment', () => {
    const seen = visibleStudentsFor({ role: 'teacher', classrooms: ['4to A'] }, students);
    expect(seen.find((s) => s.uid === 'd')).toBeUndefined();
  });
});
