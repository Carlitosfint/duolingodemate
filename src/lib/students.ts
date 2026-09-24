import { VALID_GRADES } from './validation.ts';

// The shape /api/teacher/students returns, reduced to what the staff panel
// reads. Everything is optional because rows created before a column existed
// come back with it null.
export interface StudentRow {
  uid: string;
  name?: string | null;
  email?: string | null;
  dni?: string | null;
  grade?: string | null;
  section?: string | null;
  classroom?: string | null;
  avatar?: string | null;
  active?: boolean | null;
  coins?: number | null;
  tickets?: number | null;
  progress?: number | null;
  courseProgress?: Record<string, number> | null;
  stats?: { solved?: number; failedAttempts?: number; maxStreak?: number } | null;
  mistakes?: Array<{ problem?: string; userAnswer?: string; correctAnswer?: string; topic?: string }> | null;
}

export type StatusFilter = 'active' | 'inactive' | 'all';

// Accent- and case-insensitive: a secretary typing "perez" has to find
// "Pérez", and nobody types the tilde on "Núñez" in a search box.
const fold = (value: unknown) =>
  String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export function filterStudents<T extends StudentRow>(
  students: T[],
  { query = '', classroom = 'all', status = 'active' }: { query?: string; classroom?: string; status?: StatusFilter },
): T[] {
  // Every word has to appear somewhere, so "juan perez" finds
  // "Juan Carlos Pérez Rojas" but not every Juan in the school.
  const words = fold(query).split(/\s+/).filter(Boolean);
  return students
    .filter((s) => status === 'all' || (status === 'active' ? s.active !== false : s.active === false))
    .filter((s) => classroom === 'all' || (classroom === 'none' ? !s.classroom : s.classroom === classroom))
    .filter((s) => {
      if (words.length === 0) return true;
      const haystack = fold(`${s.name ?? ''} ${s.email ?? ''} ${s.dni ?? ''}`);
      return words.every((w) => haystack.includes(w));
    })
    .sort((a, b) => fold(a.name).localeCompare(fold(b.name), 'es'));
}

export function classroomOptions(students: StudentRow[]): string[] {
  return Array.from(new Set(students.map((s) => s.classroom).filter((c): c is string => !!c)))
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
}

export function countByStatus(students: StudentRow[]) {
  const inactive = students.filter((s) => s.active === false).length;
  return { total: students.length, active: students.length - inactive, inactive };
}

// Share of answered exercises the student got right. null until they've
// answered anything, so a new student reads as "no data", not as 0%.
export function accuracy(stats: StudentRow['stats']): number | null {
  const solved = stats?.solved ?? 0;
  const failed = stats?.failedAttempts ?? 0;
  if (solved + failed === 0) return null;
  return Math.round((solved / (solved + failed)) * 100);
}

// Which courses a student sees depends on their grade, and each keeps its
// own progress: the base course in `progress`, the rest in `courseProgress`.
export const COURSES = [
  { id: 'razonamiento', name: 'Razonamiento Matemático (básico)', grades: ['3ro'] },
  { id: 'razonamiento_5to', name: 'Razonamiento Matemático', grades: ['4to', '5to'] },
  { id: 'trigonometria', name: 'Trigonometría', grades: ['4to', '5to'] },
  { id: 'geometria_5to', name: 'Geometría', grades: ['5to'] },
] as const;

export function courseProgressFor(student: StudentRow) {
  const courses = student.grade
    ? COURSES.filter((c) => (c.grades as readonly string[]).includes(student.grade!))
    : COURSES;
  return courses.map((c) => ({
    id: c.id,
    name: c.name,
    level: c.id === 'razonamiento' ? student.progress ?? 0 : student.courseProgress?.[c.id] ?? 0,
  }));
}

export interface EnrollmentDraft {
  name: string;
  dni: string;
  grade: string;
  section: string;
}

export function enrollmentDraftFrom(student: StudentRow): EnrollmentDraft {
  return {
    name: student.name ?? '',
    dni: student.dni ?? '',
    grade: student.grade ?? '',
    section: student.section ?? '',
  };
}

// Only what actually changed is sent. Sending an untouched DNI back would be
// harmless today, but it turns every save into a write of every field and
// hides what the person really meant to change.
export function enrollmentChanges(student: StudentRow, draft: EnrollmentDraft): Partial<Record<keyof EnrollmentDraft, string | null>> {
  const before = enrollmentDraftFrom(student);
  const changes: Partial<Record<keyof EnrollmentDraft, string | null>> = {};
  for (const key of ['name', 'dni', 'grade', 'section'] as const) {
    const next = draft[key].trim();
    if (next === before[key].trim()) continue;
    changes[key] = key === 'section' && !next ? null : next;
  }
  return changes;
}

// The same rules the server applies, checked before the request so the
// person gets the message next to the field instead of after a round trip.
export function enrollmentProblem(changes: ReturnType<typeof enrollmentChanges>): string | null {
  if ('name' in changes && !changes.name) return 'El nombre no puede quedar vacío.';
  if ('dni' in changes && !changes.dni) return 'El DNI no puede quedar vacío.';
  if ('grade' in changes && !VALID_GRADES.includes(changes.grade ?? '')) return 'Elige un grado.';
  return null;
}
