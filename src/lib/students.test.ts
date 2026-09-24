import { describe, expect, it } from 'vitest';
import {
  accuracy,
  classroomOptions,
  countByStatus,
  courseProgressFor,
  enrollmentChanges,
  enrollmentProblem,
  filterStudents,
  type StudentRow,
} from './students.ts';

const roster: StudentRow[] = [
  { uid: '1', name: 'Lucía Núñez Torres', email: '20261111@angeles.edu.pe', dni: '71234567', classroom: '5to A' },
  { uid: '2', name: 'Juan Carlos Pérez Rojas', email: '20262222@angeles.edu.pe', dni: '72345678', classroom: '4to B' },
  { uid: '3', name: 'Ana Pérez', email: '20263333@angeles.edu.pe', dni: '73456789', classroom: '5to A', active: false },
  { uid: '4', name: 'Juan Quispe', email: '20264444@angeles.edu.pe', dni: '74567890', classroom: null },
];

const uids = (rows: StudentRow[]) => rows.map((s) => s.uid);

describe('filterStudents', () => {
  it('shows active students by default, so a withdrawn one does not clutter the list', () => {
    expect(uids(filterStudents(roster, {}))).not.toContain('3');
  });

  it('can show only the withdrawn ones, or everyone', () => {
    expect(uids(filterStudents(roster, { status: 'inactive' }))).toEqual(['3']);
    expect(filterStudents(roster, { status: 'all' })).toHaveLength(4);
  });

  it('finds a name typed without accents or capitals', () => {
    expect(uids(filterStudents(roster, { query: 'nunez' }))).toEqual(['1']);
    expect(uids(filterStudents(roster, { query: 'PEREZ', status: 'all' }))).toEqual(['3', '2']);
  });

  it('needs every word to match, so a full name narrows the list', () => {
    expect(uids(filterStudents(roster, { query: 'juan perez' }))).toEqual(['2']);
    expect(uids(filterStudents(roster, { query: 'juan' }))).toEqual(['2', '4']);
  });

  it('searches the login email and the DNI too', () => {
    expect(uids(filterStudents(roster, { query: '20264444' }))).toEqual(['4']);
    expect(uids(filterStudents(roster, { query: '7123' }))).toEqual(['1']);
  });

  it('filters by classroom, including students who have none', () => {
    expect(uids(filterStudents(roster, { classroom: '5to A', status: 'all' }))).toEqual(['3', '1']);
    expect(uids(filterStudents(roster, { classroom: 'none' }))).toEqual(['4']);
  });

  it('sorts by name, ignoring accents', () => {
    const names = filterStudents(roster, { status: 'all' }).map((s) => s.name);
    expect(names).toEqual(['Ana Pérez', 'Juan Carlos Pérez Rojas', 'Juan Quispe', 'Lucía Núñez Torres']);
  });

  it('does not reorder the list it was given', () => {
    const copy = [...roster];
    filterStudents(roster, {});
    expect(roster).toEqual(copy);
  });
});

describe('classroomOptions', () => {
  it('lists each classroom once, in grade order', () => {
    expect(classroomOptions(roster)).toEqual(['4to B', '5to A']);
  });
});

describe('countByStatus', () => {
  it('counts the withdrawn apart', () => {
    expect(countByStatus(roster)).toEqual({ total: 4, active: 3, inactive: 1 });
  });
});

describe('accuracy', () => {
  it('is the share of answered exercises that were right', () => {
    expect(accuracy({ solved: 45, failedAttempts: 15 })).toBe(75);
  });

  it('has no value for a student who has not answered anything yet', () => {
    expect(accuracy({ solved: 0, failedAttempts: 0 })).toBeNull();
    expect(accuracy(null)).toBeNull();
  });
});

describe('courseProgressFor', () => {
  it('shows a 3rd-year student only the base course, read from `progress`', () => {
    expect(courseProgressFor({ uid: 'x', grade: '3ro', progress: 12 })).toEqual([
      { id: 'razonamiento', name: 'Razonamiento Matemático (básico)', level: 12 },
    ]);
  });

  // The old panel only ever read and moved `progress`, which a 4th or 5th
  // year student never plays.
  it('shows an upper-year student the courses they actually play', () => {
    const courses = courseProgressFor({
      uid: 'x', grade: '5to', progress: 99,
      courseProgress: { razonamiento_5to: 30, trigonometria: 8 },
    });
    expect(courses.map((c) => [c.id, c.level])).toEqual([
      ['razonamiento_5to', 30],
      ['trigonometria', 8],
      ['geometria_5to', 0],
    ]);
  });
});

describe('enrollmentChanges', () => {
  const student: StudentRow = { uid: 'x', name: 'Ana Pérez', dni: '71234567', grade: '4to', section: 'B' };

  it('sends nothing when nothing changed', () => {
    expect(enrollmentChanges(student, { name: 'Ana Pérez', dni: '71234567', grade: '4to', section: 'B' })).toEqual({});
  });

  it('ignores whitespace around an unchanged value', () => {
    expect(enrollmentChanges(student, { name: '  Ana Pérez ', dni: '71234567', grade: '4to', section: 'B' })).toEqual({});
  });

  it('sends only the fields that changed', () => {
    expect(enrollmentChanges(student, { name: 'Ana Pérez', dni: '71234567', grade: '5to', section: 'A' }))
      .toEqual({ grade: '5to', section: 'A' });
  });

  it('turns an emptied section into null, which is what the server stores', () => {
    expect(enrollmentChanges(student, { name: 'Ana Pérez', dni: '71234567', grade: '4to', section: '' }))
      .toEqual({ section: null });
  });
});

describe('enrollmentProblem', () => {
  it('refuses to blank out a name or a DNI', () => {
    expect(enrollmentProblem({ name: '' })).toMatch(/nombre/);
    expect(enrollmentProblem({ dni: '' })).toMatch(/DNI/);
  });

  it('refuses a grade the school does not teach', () => {
    expect(enrollmentProblem({ grade: '6to' })).toMatch(/grado/);
  });

  it('accepts a valid change', () => {
    expect(enrollmentProblem({ grade: '5to', section: null })).toBeNull();
  });
});
